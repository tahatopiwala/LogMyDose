import { User, Prisma } from '@peptiderx/shared/prisma';
import { IBaseRepository } from './IBaseRepository.js';

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  role: string;
  tenantId?: string;
  credentials?: string;
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  credentials?: string;
  permissions?: Prisma.InputJsonValue;
  isActive?: boolean;
}

export interface IUserRepository extends IBaseRepository<User, CreateUserInput, UpdateUserInput> {
  findByEmail(email: string): Promise<User | null>;
  incrementTokenVersion(id: string): Promise<void>;
  findByTenantId(tenantId: string): Promise<User[]>;
}
