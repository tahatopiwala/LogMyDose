import { IBaseRepository, FindManyOptions } from "./IBaseRepository.js";
import {
  Tenant,
  TenantWithCounts,
  TenantWithUsers,
  ClinicInvitation,
  InvitationWithClinic,
} from "../../entities/index.js";
import { PaginatedResponse, InputJsonValue } from "../../types/index.js";

export interface CreateTenantInput {
  name: string;
  slug: string;
  branding?: InputJsonValue;
  settings?: InputJsonValue;
}

export interface UpdateTenantInput {
  name?: string;
  branding?: InputJsonValue;
  settings?: InputJsonValue;
  subscriptionTier?: string;
  subscriptionStatus?: string;
}

export interface CreateInvitationInput {
  clinicId: string;
  email: string;
  inviteCode: string;
  expiresAt: Date;
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
  findByIdWithUsers(id: string): Promise<TenantWithUsers | null>;

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
