import {
  IAuthService,
  RegisterPatientInput,
  RegisterUserInput,
  LoginInput,
  TokenPair,
  PatientAuthResponse,
  UserAuthResponse,
  RefreshInput,
  CurrentUser,
} from '../interfaces/services/IAuthService.js';
import { IUserRepository } from '../interfaces/repositories/IUserRepository.js';
import { IPatientRepository } from '../interfaces/repositories/IPatientRepository.js';
import { hashPassword, verifyPassword } from '../lib/password.js';
import { generateTokenPair, verifyRefreshToken, TokenPayload } from '../lib/jwt.js';
import { AppError } from '../middleware/errorHandler.js';
import { Patient, User } from '@peptiderx/shared/prisma';

export class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly patientRepository: IPatientRepository
  ) {}

  async registerPatient(input: RegisterPatientInput): Promise<PatientAuthResponse> {
    const existing = await this.patientRepository.findByEmail(input.email);

    if (existing) {
      throw new AppError(409, 'An account with this email already exists', 'EMAIL_EXISTS');
    }

    const passwordHash = await hashPassword(input.password);

    const patient = await this.patientRepository.create({
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      accountType: 'd2c',
      subscriptionTier: 'free',
    });

    const tokenPayload: TokenPayload = {
      id: patient.id,
      email: patient.email,
      role: 'patient',
    };

    const tokens = generateTokenPair(tokenPayload, { id: patient.id, tokenVersion: 0 });

    return {
      patient: this.sanitizePatient(patient),
      ...tokens,
    };
  }

  async registerUser(
    input: RegisterUserInput,
    currentUser: CurrentUser
  ): Promise<{ user: Omit<User, 'passwordHash' | 'tokenVersion'> }> {
    // Only super_admin or clinic_admin can create users
    if (!['super_admin', 'clinic_admin'].includes(currentUser.role)) {
      throw new AppError(403, 'Insufficient permissions', 'FORBIDDEN');
    }

    // Clinic admins can only create users for their own tenant
    if (currentUser.role === 'clinic_admin' && currentUser.tenantId !== input.tenantId) {
      throw new AppError(403, 'Cannot create users for other tenants', 'FORBIDDEN');
    }

    const existing = await this.userRepository.findByEmail(input.email);

    if (existing) {
      throw new AppError(409, 'An account with this email already exists', 'EMAIL_EXISTS');
    }

    const passwordHash = await hashPassword(input.password);

    const user = await this.userRepository.create({
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role,
      tenantId: input.tenantId,
      credentials: input.credentials,
    });

    return { user: this.sanitizeUser(user) };
  }

  async login(input: LoginInput): Promise<PatientAuthResponse | UserAuthResponse> {
    if (input.userType === 'patient') {
      const patient = await this.patientRepository.findByEmail(input.email);

      if (!patient) {
        throw new AppError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
      }

      const isValid = await verifyPassword(input.password, patient.passwordHash);

      if (!isValid) {
        throw new AppError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
      }

      const tokenPayload: TokenPayload = {
        id: patient.id,
        email: patient.email,
        role: 'patient',
        tenantId: patient.clinicId || undefined,
      };

      const tokens = generateTokenPair(tokenPayload, {
        id: patient.id,
        tokenVersion: patient.tokenVersion,
      });

      return {
        patient: this.sanitizePatient(patient),
        ...tokens,
      };
    } else {
      const user = await this.userRepository.findByEmail(input.email);

      if (!user || !user.isActive) {
        throw new AppError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
      }

      const isValid = await verifyPassword(input.password, user.passwordHash);

      if (!isValid) {
        throw new AppError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
      }

      const tokenPayload: TokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role as TokenPayload['role'],
        tenantId: user.tenantId || undefined,
      };

      const tokens = generateTokenPair(tokenPayload, {
        id: user.id,
        tokenVersion: user.tokenVersion,
      });

      return {
        user: this.sanitizeUser(user),
        ...tokens,
      };
    }
  }

  async refresh(input: RefreshInput): Promise<TokenPair> {
    const payload = verifyRefreshToken(input.refreshToken);

    if (input.userType === 'patient') {
      const patient = await this.patientRepository.findById(payload.id);

      if (!patient || patient.tokenVersion !== payload.tokenVersion) {
        throw new AppError(401, 'Invalid refresh token', 'INVALID_REFRESH_TOKEN');
      }

      const tokenPayload: TokenPayload = {
        id: patient.id,
        email: patient.email,
        role: 'patient',
        tenantId: patient.clinicId || undefined,
      };

      return generateTokenPair(tokenPayload, {
        id: patient.id,
        tokenVersion: patient.tokenVersion,
      });
    } else {
      const user = await this.userRepository.findById(payload.id);

      if (!user || !user.isActive || user.tokenVersion !== payload.tokenVersion) {
        throw new AppError(401, 'Invalid refresh token', 'INVALID_REFRESH_TOKEN');
      }

      const tokenPayload: TokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role as TokenPayload['role'],
        tenantId: user.tenantId || undefined,
      };

      return generateTokenPair(tokenPayload, {
        id: user.id,
        tokenVersion: user.tokenVersion,
      });
    }
  }

  async logout(currentUser: CurrentUser): Promise<void> {
    if (currentUser.role === 'patient') {
      await this.patientRepository.incrementTokenVersion(currentUser.id);
    } else {
      await this.userRepository.incrementTokenVersion(currentUser.id);
    }
  }

  async getCurrentPatient(id: string): Promise<Omit<Patient, 'passwordHash' | 'tokenVersion'> | null> {
    const patient = await this.patientRepository.findById(id);
    return patient ? this.sanitizePatient(patient) : null;
  }

  async getCurrentUser(id: string): Promise<Omit<User, 'passwordHash' | 'tokenVersion'> | null> {
    const user = await this.userRepository.findById(id);
    return user ? this.sanitizeUser(user) : null;
  }

  private sanitizePatient(patient: Patient): Omit<Patient, 'passwordHash' | 'tokenVersion'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, tokenVersion, ...sanitized } = patient;
    return sanitized;
  }

  private sanitizeUser(user: User): Omit<User, 'passwordHash' | 'tokenVersion'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, tokenVersion, ...sanitized } = user;
    return sanitized;
  }
}
