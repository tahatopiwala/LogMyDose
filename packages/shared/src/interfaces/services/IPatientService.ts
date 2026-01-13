import {
  Patient,
  PatientWithClinic,
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
  getProfile(patientId: string): Promise<PatientWithClinic | null>;
  updateProfile(patientId: string, data: UpdatePatientInput): Promise<Patient>;
  linkToClinic(
    patientId: string,
    inviteCode: string,
  ): Promise<PatientWithClinic>;
  unlinkFromClinic(patientId: string): Promise<Patient>;
  getProtocols(patientId: string): Promise<ProtocolWithDetails[]>;
  getDoses(
    patientId: string,
    query: PatientDosesQuery,
  ): Promise<PaginatedResponse<Dose>>;
  getAlerts(patientId: string): Promise<Alert[]>;
}
