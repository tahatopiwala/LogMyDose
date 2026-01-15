import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler.js";
import { IPatientRepository } from "../interfaces/repositories/IPatientRepository.js";
import { getContainer } from "../container/index.js";

export function createRequireProTier(patientRepository: IPatientRepository) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError(401, "Not authenticated", "NOT_AUTHENTICATED");
      }

      if (req.user.role !== "patient") {
        throw new AppError(403, "Patient access required", "PATIENT_REQUIRED");
      }

      // Fetch patient to check subscription
      const patient = await patientRepository.findById(req.user.id);
      if (!patient) {
        throw new AppError(404, "Patient not found", "PATIENT_NOT_FOUND");
      }

      // Valid Pro tiers
      const validTiers = ["pro", "premium"];
      const validStatuses = ["active", "trialing"];

      const tier = patient.subscriptionTier?.toLowerCase() || "";
      const status = patient.subscriptionStatus?.toLowerCase() || "";

      if (!validTiers.includes(tier)) {
        throw new AppError(
          403,
          "Pro subscription required",
          "SUBSCRIPTION_REQUIRED",
        );
      }

      if (!validStatuses.includes(status)) {
        throw new AppError(
          403,
          "Active subscription required",
          "SUBSCRIPTION_INACTIVE",
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export async function requireProSubscription(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const middleware = createRequireProTier(getContainer().patientRepository);
  return middleware(req, res, next);
}
