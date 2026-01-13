import { IBaseRepository } from "./IBaseRepository.js";
import { User } from "../../entities/index.js";
import { InputJsonValue } from "../../types/index.js";

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
  permissions?: InputJsonValue;
  isActive?: boolean;
}

export interface IUserRepository extends IBaseRepository<
  User,
  CreateUserInput,
  UpdateUserInput
> {
  findByEmail(email: string): Promise<User | null>;
  incrementTokenVersion(id: string): Promise<void>;
  findByTenantId(tenantId: string): Promise<User[]>;
}
