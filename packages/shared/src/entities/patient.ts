import { JsonValue } from "../types/database.js";

/**
 * Patient entity - D2C users
 * Maps to: patients table
 */
export interface Patient {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: Date | null;
  phone: string | null;
  subscriptionTier: string | null;
  subscriptionStatus: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  subscriptionPeriodEnd: Date | null;
  subscriptionPriceId: string | null;
  trialEndsAt: Date | null;
  cancelAtPeriodEnd: boolean;
  settings: JsonValue | null;
  tokenVersion: number;
  emailVerifiedAt: Date | null;
  deletedAt: Date | null;
  createdAt: Date;
}

/**
 * Patient without sensitive fields
 */
export type SafePatient = Omit<Patient, "passwordHash" | "tokenVersion">;
