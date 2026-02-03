import {
  Patient,
  Alert,
  Dose,
  ProtocolWithDetails,
} from "../../entities/index.js";
import { UpdatePatientInput } from "../repositories/IPatientRepository.js";
import { PaginatedResponse } from "../../types/index.js";

export interface PatientDosesQuery {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export interface IPatientService {
  getProfile(patientId: string): Promise<Patient | null>;
  updateProfile(patientId: string, data: UpdatePatientInput): Promise<Patient>;
  getProtocols(patientId: string): Promise<ProtocolWithDetails[]>;
  getDoses(
    patientId: string,
    query: PatientDosesQuery,
  ): Promise<PaginatedResponse<Dose>>;
  getAlerts(patientId: string): Promise<Alert[]>;
}
