import { JsonValue } from '../types/database.js';

/**
 * Patient entity - D2C and clinic-managed users
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
  accountType: string;
  subscriptionTier: string | null;
  subscriptionStatus: string | null;
  stripeCustomerId: string | null;
  clinicId: string | null;
  clinicLinkedAt: Date | null;
  clinicControlLevel: string | null;
  consentSignedAt: Date | null;
  settings: JsonValue | null;
  tokenVersion: number;
  createdAt: Date;
}

/**
 * Patient without sensitive fields
 */
export type SafePatient = Omit<Patient, 'passwordHash' | 'tokenVersion'>;

/**
 * Patient with clinic relation
 */
export interface PatientWithClinic extends Patient {
  clinic: {
    id: string;
    name: string;
    branding: JsonValue | null;
  } | null;
}
