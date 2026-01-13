import { Tenant, Patient, ClinicInvitation } from "@logmydose/shared/prisma";
import crypto from "crypto";
import {
  ITenantService,
  GetClinicPatientsQuery,
  CreateInvitationInput,
  InvitationResponse,
} from "../interfaces/services/ITenantService.js";
import {
  ITenantRepository,
  TenantWithCounts,
  UpdateTenantInput,
  CreateTenantInput,
} from "../interfaces/repositories/ITenantRepository.js";
import { IPatientRepository } from "../interfaces/repositories/IPatientRepository.js";
import { PaginatedResponse } from "../types/index.js";
import { AppError } from "../middleware/errorHandler.js";

export class TenantService implements ITenantService {
  constructor(
    private readonly tenantRepository: ITenantRepository,
    private readonly patientRepository: IPatientRepository,
  ) {}

  async getMyClinic(tenantId: string): Promise<TenantWithCounts | null> {
    return this.tenantRepository.findByIdWithCounts(tenantId);
  }

  async updateMyClinic(
    tenantId: string,
    data: UpdateTenantInput,
  ): Promise<Tenant> {
    return this.tenantRepository.update(tenantId, data);
  }

  async getClinicPatients(
    tenantId: string,
    query: GetClinicPatientsQuery,
  ): Promise<PaginatedResponse<Patient>> {
    return this.patientRepository.findByClinicId({
      clinicId: tenantId,
      page: query.page,
      limit: query.limit,
      search: query.search,
      status: query.status,
    });
  }

  async createInvitation(
    tenantId: string,
    input: CreateInvitationInput,
  ): Promise<InvitationResponse> {
    // Check if email already has an active invitation
    const existingInvitation =
      await this.tenantRepository.findPendingInvitation(tenantId, input.email);

    if (existingInvitation) {
      throw new AppError(
        409,
        "An active invitation already exists for this email",
        "INVITATION_EXISTS",
      );
    }

    // Check if patient is already linked
    const existingPatient = await this.patientRepository.findByEmail(
      input.email,
    );

    if (existingPatient?.clinicId === tenantId) {
      throw new AppError(
        409,
        "This patient is already linked to your clinic",
        "PATIENT_LINKED",
      );
    }

    const inviteCode = crypto.randomBytes(16).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (input.expiresInDays || 7));

    const invitation = await this.tenantRepository.createInvitation({
      clinicId: tenantId,
      email: input.email,
      inviteCode,
      expiresAt,
    });

    return {
      id: invitation.id,
      email: invitation.email,
      inviteCode: invitation.inviteCode,
      expiresAt: invitation.expiresAt,
      clinicName: invitation.clinic.name,
    };
  }

  async getInvitations(tenantId: string): Promise<ClinicInvitation[]> {
    return this.tenantRepository.findInvitationsByClinicId(tenantId);
  }

  // Super admin methods
  async getAllTenants(
    page?: number,
    limit?: number,
  ): Promise<PaginatedResponse<TenantWithCounts>> {
    return this.tenantRepository.findAllWithCounts({ page, limit });
  }

  async createTenant(data: CreateTenantInput): Promise<Tenant> {
    const existing = await this.tenantRepository.findBySlug(data.slug);

    if (existing) {
      throw new AppError(
        409,
        "A tenant with this slug already exists",
        "SLUG_EXISTS",
      );
    }

    return this.tenantRepository.create(data);
  }

  async getTenantById(id: string): Promise<TenantWithCounts | null> {
    return this.tenantRepository.findByIdWithCounts(id);
  }

  async getTenantWithUsers(id: string): Promise<
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
    return this.tenantRepository.findByIdWithUsers(id);
  }
}
