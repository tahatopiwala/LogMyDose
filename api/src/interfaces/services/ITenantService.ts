import { Tenant, Patient, ClinicInvitation } from '@logmydose/shared/prisma';
import {
  TenantWithCounts,
  UpdateTenantInput,
  CreateTenantInput,
} from '../repositories/ITenantRepository.js';
import { PaginatedResponse } from '../../types/index.js';

export interface GetClinicPatientsQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface CreateInvitationInput {
  email: string;
  expiresInDays?: number;
}

export interface InvitationResponse {
  id: string;
  email: string;
  inviteCode: string;
  expiresAt: Date;
  clinicName: string;
}

export interface ITenantService {
  // Clinic admin methods
  getMyClinic(tenantId: string): Promise<TenantWithCounts | null>;
  updateMyClinic(tenantId: string, data: UpdateTenantInput): Promise<Tenant>;
  getClinicPatients(tenantId: string, query: GetClinicPatientsQuery): Promise<PaginatedResponse<Patient>>;
  createInvitation(tenantId: string, input: CreateInvitationInput): Promise<InvitationResponse>;
  getInvitations(tenantId: string): Promise<ClinicInvitation[]>;

  // Super admin methods
  getAllTenants(page?: number, limit?: number): Promise<PaginatedResponse<TenantWithCounts>>;
  createTenant(data: CreateTenantInput): Promise<Tenant>;
  getTenantById(id: string): Promise<TenantWithCounts | null>;
  getTenantWithUsers(id: string): Promise<(Tenant & { users: Array<{ id: string; email: string; firstName: string | null; lastName: string | null; role: string; isActive: boolean }> }) | null>;
}
