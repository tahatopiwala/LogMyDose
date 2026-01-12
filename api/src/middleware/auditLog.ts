import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@peptiderx/shared/prisma';
import { prisma } from '../lib/db.js';

interface AuditLogData {
  action: string;
  tableName?: string;
  recordId?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
}

export async function createAuditLog(
  req: Request,
  data: AuditLogData
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        patientId: req.user?.role === 'patient' ? req.user.id : undefined,
        tenantId: req.user?.tenantId,
        action: data.action,
        tableName: data.tableName,
        recordId: data.recordId,
        oldValues: data.oldValues as Prisma.InputJsonValue,
        newValues: data.newValues as Prisma.InputJsonValue,
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
      },
    });
  } catch (error) {
    // Log error but don't fail the request
    console.error('Failed to create audit log:', error);
  }
}

// Middleware to automatically log certain actions
export function auditMiddleware(action: string) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    // Store the action for later use
    (req as Request & { auditAction?: string }).auditAction = action;
    next();
  };
}
