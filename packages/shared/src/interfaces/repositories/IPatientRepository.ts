import { IBaseRepository, FindManyOptions } from './IBaseRepository.js';
import { Patient, PatientWithClinic } from '../../entities/index.js';
import { PaginatedResponse, InputJsonValue } from '../../types/index.js';

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
  settings?: InputJsonValue;
  clinicId?: string | null;
  clinicLinkedAt?: Date | null;
  clinicControlLevel?: string | null;
  accountType?: string;
}

export interface FindClinicPatientsOptions extends FindManyOptions {
  clinicId: string;
  search?: string;
  status?: string;
}

export interface IPatientRepository
  extends IBaseRepository<Patient, CreatePatientInput, UpdatePatientInput> {
  findByEmail(email: string): Promise<Patient | null>;
  findByIdWithClinic(id: string): Promise<PatientWithClinic | null>;
  findByClinicId(options: FindClinicPatientsOptions): Promise<PaginatedResponse<Patient>>;
  incrementTokenVersion(id: string): Promise<void>;
  linkToClinic(patientId: string, clinicId: string, controlLevel: string): Promise<Patient>;
  unlinkFromClinic(patientId: string): Promise<Patient>;
}
