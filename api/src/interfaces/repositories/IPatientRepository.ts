import {
  Patient,
  Prisma,
  EmailVerificationToken,
} from "@biostak/shared/prisma";
import { IBaseRepository } from "./IBaseRepository.js";

export interface CreateVerificationTokenInput {
  patientId: string;
  token: string;
  expiresAt: Date;
}

export interface CreatePatientInput {
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  subscriptionTier?: string;
}

export interface UpdatePatientInput {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  phone?: string;
  settings?: Prisma.InputJsonValue;
  subscriptionTier?: string;
  subscriptionStatus?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionPeriodEnd?: Date;
  subscriptionPriceId?: string;
  trialEndsAt?: Date;
  cancelAtPeriodEnd?: boolean;
  emailVerifiedAt?: Date;
}

export interface PatientExportData {
  patient: {
    firstName: string | null;
    lastName: string | null;
    email: string;
    dateOfBirth: Date | null;
  };
  protocols: Array<{
    id: string;
    status: string;
    startDate: Date | null;
    endDate: Date | null;
    source: string;
    notes: string | null;
    substances: Array<{
      substance: {
        name: string;
        doseUnit: string | null;
      };
      dose: Prisma.Decimal;
      doseUnit: string | null;
      frequency: string | null;
    }>;
  }>;
  doses: Array<{
    id: string;
    loggedAt: Date;
    dose: Prisma.Decimal;
    doseUnit: string | null;
    status: string;
    administrationSite: string | null;
    notes: string | null;
    substance: {
      name: string;
    };
    product: {
      name: string;
    } | null;
  }>;
}

export interface IPatientRepository
  extends IBaseRepository<Patient, CreatePatientInput, UpdatePatientInput> {
  findByEmail(email: string): Promise<Patient | null>;
  incrementTokenVersion(id: string): Promise<void>;
  // Email verification methods
  createVerificationToken(
    input: CreateVerificationTokenInput,
  ): Promise<EmailVerificationToken>;
  findVerificationToken(token: string): Promise<EmailVerificationToken | null>;
  markVerificationTokenUsed(token: string): Promise<void>;
  markEmailVerified(patientId: string): Promise<Patient>;
  deleteExpiredVerificationTokens(patientId: string): Promise<void>;
  // Settings methods
  updatePassword(id: string, passwordHash: string): Promise<void>;
  softDelete(id: string): Promise<void>;
  findByStripeCustomerId(customerId: string): Promise<Patient | null>;
  updateSubscription(
    id: string,
    data: {
      stripeCustomerId?: string;
      stripeSubscriptionId?: string | null;
      subscriptionTier?: string;
      subscriptionStatus?: string;
      subscriptionPeriodEnd?: Date | null;
      subscriptionPriceId?: string | null;
      trialEndsAt?: Date | null;
      cancelAtPeriodEnd?: boolean;
    },
  ): Promise<Patient>;
  getExportData(
    patientId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<PatientExportData>;
}
