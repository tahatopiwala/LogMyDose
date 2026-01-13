import { Tenant, ClinicInvitation, Prisma } from "@logmydose/shared/prisma";
import { IBaseRepository, FindManyOptions } from "./IBaseRepository.js";
import { PaginatedResponse } from "../../types/index.js";

export interface CreateTenantInput {
  name: string;
  slug: string;
  branding?: Prisma.InputJsonValue;
  settings?: Prisma.InputJsonValue;
}

export interface UpdateTenantInput {
  name?: string;
  branding?: Prisma.InputJsonValue;
  settings?: Prisma.InputJsonValue;
  subscriptionTier?: string;
  subscriptionStatus?: string;
}

export interface TenantWithCounts extends Tenant {
  _count: {
    users: number;
    patients: number;
    protocols?: number;
  };
}

export interface CreateInvitationInput {
  clinicId: string;
  email: string;
  inviteCode: string;
  expiresAt: Date;
}

export interface InvitationWithClinic extends ClinicInvitation {
  clinic: {
    name: string;
  };
}

export interface ITenantRepository extends IBaseRepository<
  Tenant,
  CreateTenantInput,
  UpdateTenantInput
> {
  findBySlug(slug: string): Promise<Tenant | null>;
  findByIdWithCounts(id: string): Promise<TenantWithCounts | null>;
  findAllWithCounts(
    options?: FindManyOptions,
  ): Promise<PaginatedResponse<TenantWithCounts>>;
  findByIdWithUsers(
    id: string,
  ): Promise<
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
  >;

  // Invitation methods
  findInvitationByCode(
    inviteCode: string,
  ): Promise<InvitationWithClinic | null>;
  findPendingInvitation(
    clinicId: string,
    email: string,
  ): Promise<ClinicInvitation | null>;
  findInvitationsByClinicId(clinicId: string): Promise<ClinicInvitation[]>;
  createInvitation(data: CreateInvitationInput): Promise<InvitationWithClinic>;
  updateInvitationStatus(id: string, status: string): Promise<ClinicInvitation>;
}
