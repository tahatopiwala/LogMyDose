import { Patient } from "@biostak/shared/prisma";

export interface RegisterPatientInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface PatientAuthResponse {
  patient: Omit<Patient, "passwordHash" | "tokenVersion">;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshInput {
  refreshToken: string;
}

export interface CurrentPatient {
  id: string;
  email: string;
}

export interface IAuthService {
  registerPatient(input: RegisterPatientInput): Promise<PatientAuthResponse>;
  login(input: LoginInput): Promise<PatientAuthResponse>;
  refresh(input: RefreshInput): Promise<TokenPair>;
  logout(patientId: string): Promise<void>;
  getCurrentPatient(
    id: string,
  ): Promise<Omit<Patient, "passwordHash" | "tokenVersion"> | null>;
  verifyEmail(token: string): Promise<void>;
  resendVerificationEmail(patientId: string): Promise<void>;
}
