import { PrismaClient, User } from "@logmydose/shared/prisma";
import {
  IUserRepository,
  CreateUserInput,
  UpdateUserInput,
  FindManyOptions,
} from "../interfaces/repositories/index.js";
import { PaginatedResponse } from "../types/index.js";

export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findMany(options?: FindManyOptions): Promise<PaginatedResponse<User>> {
    const page = options?.page || 1;
    const limit = options?.limit || 20;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        orderBy: options?.orderBy || { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.user.count(),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(data: CreateUserInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async update(id: string, data: UpdateUserInput): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async count(where?: Record<string, unknown>): Promise<number> {
    return this.prisma.user.count({ where: where as never });
  }

  async incrementTokenVersion(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { tokenVersion: { increment: 1 } },
    });
  }

  async findByTenantId(tenantId: string): Promise<User[]> {
    return this.prisma.user.findMany({ where: { tenantId } });
  }
}
