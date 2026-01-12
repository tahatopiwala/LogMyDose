import { JsonValue } from '../types/database.js';

/**
 * AuditLog entity
 * Maps to: audit_logs table
 */
export interface AuditLog {
  id: string;
  tenantId: string | null;
  userId: string | null;
  patientId: string | null;
  action: string;
  tableName: string | null;
  recordId: string | null;
  oldValues: JsonValue | null;
  newValues: JsonValue | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
}
