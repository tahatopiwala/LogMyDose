import { Patient, User } from "@logmydose/shared/prisma";

export interface RegisterPatientInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface RegisterUserInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: "provider" | "clinic_admin";
  tenantId: string;
  credentials?: string;
}

export interface LoginInput {
  email: string;
  password: string;
  userType: "patient" | "user";
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

export interface UserAuthResponse {
  user: Omit<User, "passwordHash" | "tokenVersion">;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshInput {
  refreshToken: string;
  userType: "patient" | "user";
}

export interface CurrentUser {
  id: string;
  email: string;
  role: string;
  tenantId?: string;
}

export interface IAuthService {
  registerPatient(input: RegisterPatientInput): Promise<PatientAuthResponse>;
  registerUser(
    input: RegisterUserInput,
    currentUser: CurrentUser,
  ): Promise<{ user: Omit<User, "passwordHash" | "tokenVersion"> }>;
  login(input: LoginInput): Promise<PatientAuthResponse | UserAuthResponse>;
  refresh(input: RefreshInput): Promise<TokenPair>;
  logout(currentUser: CurrentUser): Promise<void>;
  getCurrentPatient(
    id: string,
  ): Promise<Omit<Patient, "passwordHash" | "tokenVersion"> | null>;
  getCurrentUser(
    id: string,
  ): Promise<Omit<User, "passwordHash" | "tokenVersion"> | null>;
  verifyEmail(token: string): Promise<void>;
  resendVerificationEmail(patientId: string): Promise<void>;
}
