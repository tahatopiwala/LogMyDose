import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, TokenPayload } from "../lib/jwt.js";
import { AppError } from "./errorHandler.js";

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    // Check Authorization header first, then fall back to cookies
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader) {
      const [bearer, headerToken] = authHeader.split(" ");
      if (bearer === "Bearer" && headerToken) {
        token = headerToken;
      }
    }

    // Fall back to cookie if no valid Authorization header
    if (!token && req.cookies?.lmd_access_token) {
      token = req.cookies.lmd_access_token;
    }

    if (!token) {
      throw new AppError(
        401,
        "No authentication token provided",
        "NO_AUTH_TOKEN",
      );
    }

    const payload = verifyAccessToken(token);
    req.user = payload;

    next();
  } catch (error) {
    next(error);
  }
}

export function requirePatient(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  if (!req.user) {
    return next(new AppError(401, "Not authenticated", "NOT_AUTHENTICATED"));
  }

  if (req.user.role !== "patient") {
    return next(
      new AppError(403, "Patient access required", "PATIENT_REQUIRED"),
    );
  }

  next();
}
