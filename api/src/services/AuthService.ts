import crypto from "crypto";
import {
  IAuthService,
  RegisterPatientInput,
  LoginInput,
  TokenPair,
  PatientAuthResponse,
  RefreshInput,
} from "../interfaces/services/IAuthService.js";
import { IPatientRepository } from "../interfaces/repositories/IPatientRepository.js";
import { IQueueService } from "../interfaces/services/IQueueService.js";
import { hashPassword, verifyPassword } from "../lib/password.js";
import {
  generateTokenPair,
  verifyRefreshToken,
  TokenPayload,
} from "../lib/jwt.js";
import { AppError } from "../middleware/errorHandler.js";
import { Patient } from "@logmydose/shared/prisma";
import { env } from "../lib/env.js";

export class AuthService implements IAuthService {
  constructor(
    private readonly patientRepository: IPatientRepository,
    private readonly queueService: IQueueService,
  ) {}

  async registerPatient(
    input: RegisterPatientInput,
  ): Promise<PatientAuthResponse> {
    const existing = await this.patientRepository.findByEmail(input.email);

    if (existing) {
      throw new AppError(
        409,
        "An account with this email already exists",
        "EMAIL_EXISTS",
      );
    }

    const passwordHash = await hashPassword(input.password);

    const patient = await this.patientRepository.create({
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      subscriptionTier: "free",
    });

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await this.patientRepository.createVerificationToken({
      patientId: patient.id,
      token: verificationToken,
      expiresAt,
    });

    const verificationUrl = `${env.APP_URL}/verify-email?token=${verificationToken}`;

    // Queue welcome email
    await this.queueService.addWelcomeEmailJob({
      to: patient.email,
      patientId: patient.id,
      firstName: patient.firstName || undefined,
    });

    // Queue email verification email
    await this.queueService.addVerifyEmailJob({
      to: patient.email,
      patientId: patient.id,
      firstName: patient.firstName || undefined,
      verificationToken,
      verificationUrl,
      expiresAt: expiresAt.toISOString(),
    });

    const tokenPayload: TokenPayload = {
      id: patient.id,
      email: patient.email,
      role: "patient",
    };

    const tokens = generateTokenPair(tokenPayload, {
      id: patient.id,
      tokenVersion: 0,
    });

    return {
      patient: this.sanitizePatient(patient),
      ...tokens,
    };
  }

  async login(input: LoginInput): Promise<PatientAuthResponse> {
    const patient = await this.patientRepository.findByEmail(input.email);

    if (!patient) {
      throw new AppError(401, "Invalid credentials", "INVALID_CREDENTIALS");
    }

    const isValid = await verifyPassword(input.password, patient.passwordHash);

    if (!isValid) {
      throw new AppError(401, "Invalid credentials", "INVALID_CREDENTIALS");
    }

    const tokenPayload: TokenPayload = {
      id: patient.id,
      email: patient.email,
      role: "patient",
    };

    const tokens = generateTokenPair(tokenPayload, {
      id: patient.id,
      tokenVersion: patient.tokenVersion,
    });

    return {
      patient: this.sanitizePatient(patient),
      ...tokens,
    };
  }

  async refresh(input: RefreshInput): Promise<TokenPair> {
    const payload = verifyRefreshToken(input.refreshToken);

    const patient = await this.patientRepository.findById(payload.id);

    if (!patient || patient.tokenVersion !== payload.tokenVersion) {
      throw new AppError(
        401,
        "Invalid refresh token",
        "INVALID_REFRESH_TOKEN",
      );
    }

    const tokenPayload: TokenPayload = {
      id: patient.id,
      email: patient.email,
      role: "patient",
    };

    return generateTokenPair(tokenPayload, {
      id: patient.id,
      tokenVersion: patient.tokenVersion,
    });
  }

  async logout(patientId: string): Promise<void> {
    await this.patientRepository.incrementTokenVersion(patientId);
  }

  async getCurrentPatient(
    id: string,
  ): Promise<Omit<Patient, "passwordHash" | "tokenVersion"> | null> {
    const patient = await this.patientRepository.findById(id);
    return patient ? this.sanitizePatient(patient) : null;
  }

  async verifyEmail(token: string): Promise<void> {
    const verificationToken =
      await this.patientRepository.findVerificationToken(token);

    if (!verificationToken) {
      throw new AppError(400, "Invalid verification token", "INVALID_TOKEN");
    }

    if (verificationToken.usedAt) {
      throw new AppError(400, "Token has already been used", "TOKEN_USED");
    }

    if (verificationToken.expiresAt < new Date()) {
      throw new AppError(
        400,
        "Verification token has expired",
        "TOKEN_EXPIRED",
      );
    }

    await this.patientRepository.markVerificationTokenUsed(token);
    await this.patientRepository.markEmailVerified(verificationToken.patientId);
  }

  async resendVerificationEmail(patientId: string): Promise<void> {
    const patient = await this.patientRepository.findById(patientId);

    if (!patient) {
      throw new AppError(404, "Patient not found", "NOT_FOUND");
    }

    if (patient.emailVerifiedAt) {
      throw new AppError(400, "Email is already verified", "ALREADY_VERIFIED");
    }

    // Clean up old tokens
    await this.patientRepository.deleteExpiredVerificationTokens(patientId);

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await this.patientRepository.createVerificationToken({
      patientId: patient.id,
      token: verificationToken,
      expiresAt,
    });

    const verificationUrl = `${env.APP_URL}/verify-email?token=${verificationToken}`;

    // Queue verification email
    await this.queueService.addVerifyEmailJob({
      to: patient.email,
      patientId: patient.id,
      firstName: patient.firstName || undefined,
      verificationToken,
      verificationUrl,
      expiresAt: expiresAt.toISOString(),
    });
  }

  private sanitizePatient(
    patient: Patient,
  ): Omit<Patient, "passwordHash" | "tokenVersion"> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, tokenVersion, ...sanitized } = patient;
    return sanitized;
  }
}
