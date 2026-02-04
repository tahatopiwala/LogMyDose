import { BiometricEntry } from "@biostak/shared/prisma";
import {
  IBiometricService,
  LogBiometricInput,
  BatchLogBiometricInput,
  GetBiometricsQuery,
  GetStatsQuery,
  BiometricTrend,
} from "../interfaces/services/IBiometricService.js";
import {
  IBiometricRepository,
  BiometricEntryWithDose,
  BiometricStats,
} from "../interfaces/repositories/IBiometricRepository.js";
import { IDoseRepository } from "../interfaces/repositories/IDoseRepository.js";
import { PaginatedResponse } from "../types/index.js";
import { AppError } from "../middleware/errorHandler.js";

export class BiometricService implements IBiometricService {
  constructor(
    private readonly biometricRepository: IBiometricRepository,
    private readonly doseRepository?: IDoseRepository,
  ) {}

  async logEntry(
    patientId: string,
    input: LogBiometricInput,
  ): Promise<BiometricEntry> {
    // If doseId is provided, verify it belongs to the patient
    if (input.doseId && this.doseRepository) {
      const dose = await this.doseRepository.findById(input.doseId);

      if (!dose) {
        throw new AppError(404, "Dose not found", "DOSE_NOT_FOUND");
      }

      if (dose.patientId !== patientId) {
        throw new AppError(403, "Dose does not belong to this patient", "FORBIDDEN");
      }
    }

    return this.biometricRepository.create({
      patientId,
      metricType: input.metricType,
      value: input.value,
      unit: input.unit,
      doseId: input.doseId,
      notes: input.notes,
      recordedAt: input.recordedAt ? new Date(input.recordedAt) : undefined,
    });
  }

  async logBatch(
    patientId: string,
    input: BatchLogBiometricInput,
  ): Promise<number> {
    // Validate all doseIds if provided
    if (this.doseRepository) {
      const doseIds = input.entries
        .filter((e) => e.doseId)
        .map((e) => e.doseId as string);

      if (doseIds.length > 0) {
        // Check each dose exists and belongs to patient
        for (const doseId of doseIds) {
          const dose = await this.doseRepository.findById(doseId);
          if (!dose || dose.patientId !== patientId) {
            throw new AppError(
              400,
              `Invalid dose ID: ${doseId}`,
              "INVALID_DOSE",
            );
          }
        }
      }
    }

    return this.biometricRepository.createMany(
      input.entries.map((entry) => ({
        patientId,
        metricType: entry.metricType,
        value: entry.value,
        unit: entry.unit,
        doseId: entry.doseId,
        notes: entry.notes,
        recordedAt: entry.recordedAt ? new Date(entry.recordedAt) : undefined,
      })),
    );
  }

  async getEntries(
    patientId: string,
    query: GetBiometricsQuery,
  ): Promise<PaginatedResponse<BiometricEntryWithDose>> {
    return this.biometricRepository.findByPatient({
      patientId,
      page: query.page,
      limit: Math.min(query.limit || 20, 100),
      metricType: query.metricType,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      doseId: query.doseId,
    });
  }

  async getEntryById(
    id: string,
    patientId: string,
  ): Promise<BiometricEntryWithDose | null> {
    const entry = await this.biometricRepository.findById(id);

    if (!entry) {
      throw new AppError(404, "Biometric entry not found", "NOT_FOUND");
    }

    if (entry.patientId !== patientId) {
      throw new AppError(403, "Access denied", "FORBIDDEN");
    }

    // Return with dose info if available
    const result = await this.biometricRepository.findByPatient({
      patientId,
      page: 1,
      limit: 1,
    });

    return result.data.find((e) => e.id === id) || null;
  }

  async getEntriesByDose(
    doseId: string,
    patientId: string,
  ): Promise<BiometricEntry[]> {
    // Verify dose belongs to patient
    if (this.doseRepository) {
      const dose = await this.doseRepository.findById(doseId);

      if (!dose) {
        throw new AppError(404, "Dose not found", "DOSE_NOT_FOUND");
      }

      if (dose.patientId !== patientId) {
        throw new AppError(403, "Access denied", "FORBIDDEN");
      }
    }

    return this.biometricRepository.findByDose(doseId);
  }

  async deleteEntry(id: string, patientId: string): Promise<void> {
    const entry = await this.biometricRepository.findById(id);

    if (!entry) {
      throw new AppError(404, "Biometric entry not found", "NOT_FOUND");
    }

    if (entry.patientId !== patientId) {
      throw new AppError(403, "Access denied", "FORBIDDEN");
    }

    await this.biometricRepository.delete(id);
  }

  async getStats(
    patientId: string,
    query: GetStatsQuery,
  ): Promise<BiometricStats[]> {
    const startDate = query.startDate ? new Date(query.startDate) : undefined;
    const endDate = query.endDate ? new Date(query.endDate) : undefined;

    if (query.metricType) {
      const stats = await this.biometricRepository.getStats(
        patientId,
        query.metricType,
        startDate,
        endDate,
      );

      return stats ? [stats] : [];
    }

    return this.biometricRepository.getStatsByPatient(
      patientId,
      startDate,
      endDate,
    );
  }

  async getStatsByMetric(
    patientId: string,
    metricType: string,
    query: GetStatsQuery,
  ): Promise<BiometricStats | null> {
    const startDate = query.startDate ? new Date(query.startDate) : undefined;
    const endDate = query.endDate ? new Date(query.endDate) : undefined;

    return this.biometricRepository.getStats(
      patientId,
      metricType,
      startDate,
      endDate,
    );
  }

  async getTrend(
    patientId: string,
    metricType: string,
    days: number = 30,
  ): Promise<BiometricTrend[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const entries = await this.biometricRepository.findByMetricType(
      patientId,
      metricType,
      startDate,
      endDate,
    );

    return entries.map((entry) => ({
      date: entry.recordedAt.toISOString().split("T")[0],
      value: Number(entry.value),
    }));
  }
}
