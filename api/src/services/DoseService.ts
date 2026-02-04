import { Dose, Prisma } from "@biostak/shared/prisma";
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
import { IVialRepository } from "../interfaces/repositories/IVialRepository.js";
import { PaginatedResponse } from "../types/index.js";
import { AppError } from "../middleware/errorHandler.js";

export class DoseService implements IDoseService {
  constructor(
    private readonly doseRepository: IDoseRepository,
    private readonly substanceRepository: ISubstanceRepository,
    private readonly protocolRepository: IProtocolRepository,
    private readonly vialRepository?: IVialRepository,
  ) {}

  async logDose(patientId: string, input: LogDoseInput): Promise<Dose> {
    // Verify substance exists
    const substance = await this.substanceRepository.findById(
      input.substanceId,
    );

    if (!substance) {
      throw new AppError(404, "Substance not found", "SUBSTANCE_NOT_FOUND");
    }

    // If protocolSubstanceId is provided, validate it belongs to patient's active protocol
    if (input.protocolSubstanceId) {
      const protocolSubstance =
        await this.protocolRepository.findProtocolSubstanceById(
          input.protocolSubstanceId,
        );

      if (!protocolSubstance) {
        throw new AppError(
          400,
          "Protocol substance not found",
          "PROTOCOL_SUBSTANCE_NOT_FOUND",
        );
      }

      if (protocolSubstance.protocol.patientId !== patientId) {
        throw new AppError(
          403,
          "Protocol substance does not belong to this patient",
          "FORBIDDEN",
        );
      }

      if (protocolSubstance.protocol.status !== "active") {
        throw new AppError(
          400,
          "Cannot log dose against inactive protocol",
          "PROTOCOL_NOT_ACTIVE",
        );
      }
    }
    // If no protocolSubstanceId, this is an ad-hoc dose - allowed

    // If vialId is provided, verify the vial belongs to the patient and is active
    let productId = input.productId;
    if (input.vialId && this.vialRepository) {
      const vial = await this.vialRepository.findById(input.vialId);

      if (!vial) {
        throw new AppError(404, "Vial not found", "VIAL_NOT_FOUND");
      }

      if (vial.patientId !== patientId) {
        throw new AppError(403, "Vial does not belong to this patient", "FORBIDDEN");
      }

      if (vial.status !== "active") {
        throw new AppError(400, "Vial is not active", "VIAL_NOT_ACTIVE");
      }

      // Use the vial's productId if not provided
      if (!productId) {
        productId = vial.productId;
      }
    }

    // Create the dose
    const dose = await this.doseRepository.create({
      patientId,
      protocolSubstanceId: input.protocolSubstanceId,
      substanceId: input.substanceId,
      productId,
      vialId: input.vialId,
      dose: input.dose,
      doseUnit: input.doseUnit || substance.doseUnit || undefined,
      scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : undefined,
      status: input.status || "taken",
      administrationSite: input.administrationSite,
      notes: input.notes,
      photoUrl: input.photoUrl,
      // Dose context fields
      fastingState: input.fastingState,
      takenWithFood: input.takenWithFood,
      mealFatContent: input.mealFatContent,
      timeOfDay: input.timeOfDay,
      needleGauge: input.needleGauge,
      injectionDepth: input.injectionDepth,
    });

    // If a vial was used and status is "taken", decrement the vial's remaining amount
    if (input.vialId && this.vialRepository && (input.status === "taken" || !input.status)) {
      // Convert dose to mcg for decrementing
      // Note: This assumes the dose is in mcg. For other units, conversion may be needed.
      const doseMcg = input.dose;
      await this.vialRepository.decrementRemaining(input.vialId, new Prisma.Decimal(doseMcg));
    }

    return dose;
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
