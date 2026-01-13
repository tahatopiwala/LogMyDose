import {
  PrismaClient,
  Tenant,
  ClinicInvitation,
} from "@logmydose/shared/prisma";
import {
  ITenantRepository,
  CreateTenantInput,
  UpdateTenantInput,
  TenantWithCounts,
  CreateInvitationInput,
  InvitationWithClinic,
  FindManyOptions,
} from "../interfaces/repositories/index.js";
import { PaginatedResponse } from "../types/index.js";

export class TenantRepository implements ITenantRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Tenant | null> {
    return this.prisma.tenant.findUnique({ where: { id } });
  }

  async findBySlug(slug: string): Promise<Tenant | null> {
    return this.prisma.tenant.findUnique({ where: { slug } });
  }

  async findByIdWithCounts(id: string): Promise<TenantWithCounts | null> {
    return this.prisma.tenant.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            patients: true,
            protocols: true,
          },
        },
      },
    });
  }

  async findMany(
    options?: FindManyOptions,
  ): Promise<PaginatedResponse<Tenant>> {
    const page = options?.page || 1;
    const limit = options?.limit || 20;

    const [data, total] = await Promise.all([
      this.prisma.tenant.findMany({
        orderBy: options?.orderBy || { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.tenant.count(),
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

  async findAllWithCounts(
    options?: FindManyOptions,
  ): Promise<PaginatedResponse<TenantWithCounts>> {
    const page = options?.page || 1;
    const limit = options?.limit || 20;

    const [data, total] = await Promise.all([
      this.prisma.tenant.findMany({
        include: {
          _count: {
            select: {
              users: true,
              patients: true,
            },
          },
        },
        orderBy: options?.orderBy || { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.tenant.count(),
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

  async findByIdWithUsers(id: string): Promise<
    | (Tenant & {
        users: Array<{
          id: string;
          email: string;
          firstName: string | null;
          lastName: string | null;
          role: string;
          isActive: boolean;
        }>;
      })
    | null
  > {
    return this.prisma.tenant.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
          },
        },
        _count: {
          select: {
            patients: true,
            protocols: true,
          },
        },
      },
    });
  }

  async create(data: CreateTenantInput): Promise<Tenant> {
    return this.prisma.tenant.create({ data });
  }

  async update(id: string, data: UpdateTenantInput): Promise<Tenant> {
    return this.prisma.tenant.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.tenant.delete({ where: { id } });
  }

  async count(where?: Record<string, unknown>): Promise<number> {
    return this.prisma.tenant.count({ where: where as never });
  }

  // Invitation methods
  async findInvitationByCode(
    inviteCode: string,
  ): Promise<InvitationWithClinic | null> {
    return this.prisma.clinicInvitation.findUnique({
      where: { inviteCode },
      include: { clinic: { select: { name: true } } },
    });
  }

  async findPendingInvitation(
    clinicId: string,
    email: string,
  ): Promise<ClinicInvitation | null> {
    return this.prisma.clinicInvitation.findFirst({
      where: {
        clinicId,
        email,
        status: "pending",
        expiresAt: { gt: new Date() },
      },
    });
  }

  async findInvitationsByClinicId(
    clinicId: string,
  ): Promise<ClinicInvitation[]> {
    return this.prisma.clinicInvitation.findMany({
      where: { clinicId },
      orderBy: { createdAt: "desc" },
    });
  }

  async createInvitation(
    data: CreateInvitationInput,
  ): Promise<InvitationWithClinic> {
    return this.prisma.clinicInvitation.create({
      data,
      include: { clinic: { select: { name: true } } },
    });
  }

  async updateInvitationStatus(
    id: string,
    status: string,
  ): Promise<ClinicInvitation> {
    return this.prisma.clinicInvitation.update({
      where: { id },
      data: { status },
    });
  }
}
