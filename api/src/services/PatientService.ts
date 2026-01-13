import { Patient, Dose, Alert } from "@logmydose/shared/prisma";
import {
  IPatientService,
  PatientDosesQuery,
} from "../interfaces/services/IPatientService.js";
import {
  IPatientRepository,
  PatientWithClinic,
  UpdatePatientInput,
} from "../interfaces/repositories/IPatientRepository.js";
import { ITenantRepository } from "../interfaces/repositories/ITenantRepository.js";
import {
  IProtocolRepository,
  ProtocolWithDetails,
} from "../interfaces/repositories/IProtocolRepository.js";
import { IDoseRepository } from "../interfaces/repositories/IDoseRepository.js";
import { PaginatedResponse } from "../types/index.js";
import { AppError } from "../middleware/errorHandler.js";

export class PatientService implements IPatientService {
  constructor(
    private readonly patientRepository: IPatientRepository,
    private readonly tenantRepository: ITenantRepository,
    private readonly protocolRepository: IProtocolRepository,
    private readonly doseRepository: IDoseRepository,
  ) {}

  async getProfile(patientId: string): Promise<PatientWithClinic | null> {
    return this.patientRepository.findByIdWithClinic(patientId);
  }

  async updateProfile(
    patientId: string,
    data: UpdatePatientInput,
  ): Promise<Patient> {
    return this.patientRepository.update(patientId, data);
  }

  async linkToClinic(
    patientId: string,
    inviteCode: string,
  ): Promise<PatientWithClinic> {
    const invitation =
      await this.tenantRepository.findInvitationByCode(inviteCode);

    if (!invitation) {
      throw new AppError(404, "Invalid invite code", "INVALID_INVITE_CODE");
    }

    if (invitation.status !== "pending") {
      throw new AppError(
        400,
        "This invitation has already been used or expired",
        "INVITATION_USED",
      );
    }

    if (new Date() > invitation.expiresAt) {
      throw new AppError(
        400,
        "This invitation has expired",
        "INVITATION_EXPIRED",
      );
    }

    await this.patientRepository.linkToClinic(
      patientId,
      invitation.clinicId,
      "view_only",
    );
    await this.tenantRepository.updateInvitationStatus(
      invitation.id,
      "accepted",
    );

    const patient = await this.patientRepository.findByIdWithClinic(patientId);
    if (!patient) {
      throw new AppError(404, "Patient not found", "NOT_FOUND");
    }

    return patient;
  }

  async unlinkFromClinic(patientId: string): Promise<Patient> {
    const patient = await this.patientRepository.findById(patientId);

    if (!patient?.clinicId) {
      throw new AppError(400, "Not linked to any clinic", "NOT_LINKED");
    }

    return this.patientRepository.unlinkFromClinic(patientId);
  }

  async getProtocols(patientId: string): Promise<ProtocolWithDetails[]> {
    return this.protocolRepository.findByPatientId(patientId);
  }

  async getDoses(
    patientId: string,
    query: PatientDosesQuery,
  ): Promise<PaginatedResponse<Dose>> {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 20, 100);

    const result = await this.doseRepository.findManyByPatient({
      patientId,
      page,
      limit,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
    });

    return result as unknown as PaginatedResponse<Dose>;
  }

  async getAlerts(patientId: string): Promise<Alert[]> {
    return this.doseRepository.findActiveAlerts(patientId);
  }
}
