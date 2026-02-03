import { IBaseRepository } from "./IBaseRepository.js";
import { Patient } from "../../entities/index.js";
import { InputJsonValue } from "../../types/index.js";

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
  settings?: InputJsonValue;
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

export interface IPatientRepository
  extends IBaseRepository<Patient, CreatePatientInput, UpdatePatientInput> {
  findByEmail(email: string): Promise<Patient | null>;
  incrementTokenVersion(id: string): Promise<void>;
}
