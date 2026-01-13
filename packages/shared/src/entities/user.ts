import { JsonValue } from "../types/database.js";

/**
 * User entity - Providers, admins, super admins (NOT patients)
 * Maps to: users table
 */
export interface User {
  id: string;
  tenantId: string | null;
  email: string;
  passwordHash: string;
  role: string;
  firstName: string | null;
  lastName: string | null;
  credentials: string | null;
  permissions: JsonValue | null;
  isActive: boolean;
  tokenVersion: number;
  createdAt: Date;
}

/**
 * User without sensitive fields
 */
export type SafeUser = Omit<User, "passwordHash" | "tokenVersion">;
