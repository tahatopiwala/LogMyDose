import { Dose } from "@logmydose/shared/prisma";
import {
  IDoseService,
  LogDoseInput,
  UpdateDoseInput,
  LogSideEffectInput,
  GetDosesQuery,
  GetSideEffectsQuery,
  GetStatsQuery,
} from "../interfaces/services/IDoseService.js";
import {
  IDoseRepository,
  DoseWithSubstance,
  DoseWithDetails,
  SideEffectWithRelations,
  DoseStats,
} from "../interfaces/repositories/IDoseRepository.js";
import { ISubstanceRepository } from "../interfaces/repositories/ISubstanceRepository.js";
import { IProtocolRepository } from "../interfaces/repositories/IProtocolRepository.js";
import { PaginatedResponse } from "../types/index.js";
import { AppError } from "../middleware/errorHandler.js";

export class DoseService implements IDoseService {
  constructor(
    private readonly doseRepository: IDoseRepository,
    private readonly substanceRepository: ISubstanceRepository,
    private readonly protocolRepository: IProtocolRepository,
  ) {}

  async logDose(patientId: string, input: LogDoseInput): Promise<Dose> {
    // Verify substance exists
    const substance = await this.substanceRepository.findById(
      input.substanceId,
    );

    if (!substance) {
      throw new AppError(404, "Substance not found", "SUBSTANCE_NOT_FOUND");
    }

    // If protocolSubstanceId provided, verify it belongs to patient's protocol
    if (input.protocolSubstanceId) {
      const protocolSubstance =
        await this.protocolRepository.findProtocolSubstanceById(
          input.protocolSubstanceId,
        );

      if (
        !protocolSubstance ||
        protocolSubstance.protocol.patientId !== patientId
      ) {
        throw new AppError(
          400,
          "Invalid protocol substance",
          "INVALID_PROTOCOL_SUBSTANCE",
        );
      }
    }

    return this.doseRepository.create({
      patientId,
      protocolSubstanceId: input.protocolSubstanceId,
      substanceId: input.substanceId,
      dose: input.dose,
      doseUnit: input.doseUnit || substance.doseUnit || undefined,
      scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : undefined,
      status: input.status || "taken",
      administrationSite: input.administrationSite,
      notes: input.notes,
      photoUrl: input.photoUrl,
    });
  }

  async getDoses(
    patientId: string,
    query: GetDosesQuery,
  ): Promise<PaginatedResponse<DoseWithSubstance>> {
    return this.doseRepository.findManyByPatient({
      patientId,
      page: query.page,
      limit: Math.min(query.limit || 20, 100),
      substanceId: query.substanceId,
      status: query.status,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
    });
  }

  async getTodayDoses(patientId: string): Promise<DoseWithSubstance[]> {
    return this.doseRepository.findTodayByPatient(patientId);
  }

  async getDoseById(
    id: string,
    patientId: string,
  ): Promise<DoseWithDetails | null> {
    const dose = await this.doseRepository.findByIdWithDetails(id);

    if (!dose) {
      throw new AppError(404, "Dose not found", "NOT_FOUND");
    }

    if (dose.patientId !== patientId) {
      throw new AppError(403, "Access denied", "FORBIDDEN");
    }

    return dose;
  }

  async updateDose(
    id: string,
    patientId: string,
    data: UpdateDoseInput,
  ): Promise<Dose> {
    const existingDose = await this.doseRepository.findById(id);

    if (!existingDose) {
      throw new AppError(404, "Dose not found", "NOT_FOUND");
    }

    if (existingDose.patientId !== patientId) {
      throw new AppError(403, "Access denied", "FORBIDDEN");
    }

    return this.doseRepository.update(id, data);
  }

  async logSideEffect(
    patientId: string,
    input: LogSideEffectInput,
  ): Promise<SideEffectWithRelations> {
    // Verify dose belongs to patient if provided
    if (input.doseId) {
      const dose = await this.doseRepository.findDoseById(input.doseId);

      if (!dose || dose.patientId !== patientId) {
        throw new AppError(400, "Invalid dose", "INVALID_DOSE");
      }
    }

    return this.doseRepository.createSideEffect({
      patientId,
      doseId: input.doseId,
      substanceId: input.substanceId,
      symptom: input.symptom,
      severity: input.severity,
      durationHours: input.durationHours,
      notes: input.notes,
    });
  }

  async getSideEffects(
    patientId: string,
    query: GetSideEffectsQuery,
  ): Promise<PaginatedResponse<SideEffectWithRelations>> {
    return this.doseRepository.findSideEffects({
      patientId,
      page: query.page,
      limit: Math.min(query.limit || 20, 100),
      substanceId: query.substanceId,
      minSeverity: query.minSeverity,
    });
  }

  async getStats(patientId: string, query: GetStatsQuery): Promise<DoseStats> {
    const startDate = query.startDate
      ? new Date(query.startDate)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = query.endDate ? new Date(query.endDate) : new Date();

    return this.doseRepository.getStats(patientId, startDate, endDate);
  }
}
