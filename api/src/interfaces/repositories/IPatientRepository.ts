import { Patient, Prisma, EmailVerificationToken } from '@logmydose/shared/prisma';
import { IBaseRepository, FindManyOptions } from './IBaseRepository.js';
import { PaginatedResponse } from '../../types/index.js';

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
  accountType?: string;
  subscriptionTier?: string;
}

export interface UpdatePatientInput {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  phone?: string;
  settings?: Prisma.InputJsonValue;
  clinicId?: string | null;
  clinicLinkedAt?: Date | null;
  clinicControlLevel?: string | null;
  accountType?: string;
}

export interface PatientWithClinic extends Patient {
  clinic?: {
    id: string;
    name: string;
    branding: Prisma.JsonValue;
  } | null;
}

export interface FindClinicPatientsOptions extends FindManyOptions {
  clinicId: string;
  search?: string;
  status?: string;
}

export interface IPatientRepository extends IBaseRepository<Patient, CreatePatientInput, UpdatePatientInput> {
  findByEmail(email: string): Promise<Patient | null>;
  findByIdWithClinic(id: string): Promise<PatientWithClinic | null>;
  findByClinicId(options: FindClinicPatientsOptions): Promise<PaginatedResponse<Patient>>;
  incrementTokenVersion(id: string): Promise<void>;
  linkToClinic(patientId: string, clinicId: string, controlLevel: string): Promise<Patient>;
  unlinkFromClinic(patientId: string): Promise<Patient>;
  // Email verification methods
  createVerificationToken(input: CreateVerificationTokenInput): Promise<EmailVerificationToken>;
  findVerificationToken(token: string): Promise<EmailVerificationToken | null>;
  markVerificationTokenUsed(token: string): Promise<void>;
  markEmailVerified(patientId: string): Promise<Patient>;
  deleteExpiredVerificationTokens(patientId: string): Promise<void>;
}
