import { Patient, Dose, Alert } from "@biostak/shared/prisma";
import {
  IPatientService,
  PatientDosesQuery,
} from "../interfaces/services/IPatientService.js";
import {
  IPatientRepository,
  UpdatePatientInput,
  PatientExportData,
} from "../interfaces/repositories/IPatientRepository.js";
import {
  IProtocolRepository,
  ProtocolWithDetails,
} from "../interfaces/repositories/IProtocolRepository.js";
import { IDoseRepository } from "../interfaces/repositories/IDoseRepository.js";
import { PaginatedResponse } from "../types/index.js";
import { AppError } from "../middleware/errorHandler.js";

export class PatientService implements IPatientService {
  constructor(
    private readonly patientRepository: IPatientRepository,
    private readonly protocolRepository: IProtocolRepository,
    private readonly doseRepository: IDoseRepository,
  ) {}

  async getProfile(patientId: string): Promise<Patient | null> {
    return this.patientRepository.findById(patientId);
  }

  async updateProfile(
    patientId: string,
    data: UpdatePatientInput,
  ): Promise<Patient> {
    return this.patientRepository.update(patientId, data);
  }

  async getProtocols(patientId: string): Promise<ProtocolWithDetails[]> {
    return this.protocolRepository.findByPatientId(patientId);
  }

  async getDoses(
    patientId: string,
    query: PatientDosesQuery,
  ): Promise<PaginatedResponse<Dose>> {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 20, 100);

    const result = await this.doseRepository.findManyByPatient({
      patientId,
      page,
      limit,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
    });

    return result as unknown as PaginatedResponse<Dose>;
  }

  async getAlerts(patientId: string): Promise<Alert[]> {
    return this.doseRepository.findActiveAlerts(patientId);
  }

  validateProSubscription(patient: Patient): void {
    const validTiers = ["pro", "premium"];
    const validStatuses = ["active", "trialing"];

    const tier = patient.subscriptionTier?.toLowerCase() || "";
    const status = patient.subscriptionStatus?.toLowerCase() || "";

    if (!validTiers.includes(tier)) {
      throw new AppError(
        403,
        "Pro subscription required for data export",
        "SUBSCRIPTION_REQUIRED",
      );
    }

    if (!validStatuses.includes(status)) {
      throw new AppError(
        403,
        "Active subscription required for data export",
        "SUBSCRIPTION_INACTIVE",
      );
    }
  }

  async getExportData(
    patientId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<PatientExportData> {
    // Validate date range
    if (startDate > endDate) {
      throw new AppError(
        400,
        "Start date must be before end date",
        "INVALID_DATE_RANGE",
      );
    }

    // Validate date range is not too large (2 years max)
    const maxRangeMs = 2 * 365 * 24 * 60 * 60 * 1000; // 2 years in milliseconds
    if (endDate.getTime() - startDate.getTime() > maxRangeMs) {
      throw new AppError(
        400,
        "Date range cannot exceed 2 years",
        "DATE_RANGE_TOO_LARGE",
      );
    }

    // Validate dates are not in the future
    const now = new Date();
    if (startDate > now || endDate > now) {
      throw new AppError(
        400,
        "Dates cannot be in the future",
        "INVALID_DATE_RANGE",
      );
    }

    return this.patientRepository.getExportData(patientId, startDate, endDate);
  }
}
