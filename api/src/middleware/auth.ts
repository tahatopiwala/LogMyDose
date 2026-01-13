import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../lib/jwt.js';
import { AppError } from './errorHandler.js';

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
  next: NextFunction
) {
  try {
    // Check Authorization header first, then fall back to cookies
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader) {
      const [bearer, headerToken] = authHeader.split(' ');
      if (bearer === 'Bearer' && headerToken) {
        token = headerToken;
      }
    }

    // Fall back to cookie if no valid Authorization header
    if (!token && req.cookies?.lmd_access_token) {
      token = req.cookies.lmd_access_token;
    }

    if (!token) {
      throw new AppError(401, 'No authentication token provided', 'NO_AUTH_TOKEN');
    }

    const payload = verifyAccessToken(token);
    req.user = payload;

    next();
  } catch (error) {
    next(error);
  }
}

export function requireRole(...roles: TokenPayload['role'][]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, 'Not authenticated', 'NOT_AUTHENTICATED'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, 'Insufficient permissions', 'FORBIDDEN'));
    }

    next();
  };
}

export function requirePatient(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return next(new AppError(401, 'Not authenticated', 'NOT_AUTHENTICATED'));
  }

  if (req.user.role !== 'patient') {
    return next(new AppError(403, 'Patient access required', 'PATIENT_REQUIRED'));
  }

  next();
}

export function requireProvider(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return next(new AppError(401, 'Not authenticated', 'NOT_AUTHENTICATED'));
  }

  const allowedRoles: TokenPayload['role'][] = ['provider', 'clinic_admin', 'super_admin'];

  if (!allowedRoles.includes(req.user.role)) {
    return next(new AppError(403, 'Provider access required', 'PROVIDER_REQUIRED'));
  }

  next();
}

export function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return next(new AppError(401, 'Not authenticated', 'NOT_AUTHENTICATED'));
  }

  const allowedRoles: TokenPayload['role'][] = ['clinic_admin', 'super_admin'];

  if (!allowedRoles.includes(req.user.role)) {
    return next(new AppError(403, 'Admin access required', 'ADMIN_REQUIRED'));
  }

  next();
}

export function requireSuperAdmin(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return next(new AppError(401, 'Not authenticated', 'NOT_AUTHENTICATED'));
  }

  if (req.user.role !== 'super_admin') {
    return next(new AppError(403, 'Super admin access required', 'SUPER_ADMIN_REQUIRED'));
  }

  next();
}
