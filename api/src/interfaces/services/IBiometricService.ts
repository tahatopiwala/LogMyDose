import { BiometricEntry } from "@biostak/shared/prisma";
import {
  BiometricEntryWithDose,
  BiometricStats,
} from "../repositories/IBiometricRepository.js";
import { PaginatedResponse } from "../../types/index.js";

export interface LogBiometricInput {
  metricType: string;
  value: number;
  unit?: string;
  doseId?: string;
  notes?: string;
  recordedAt?: string;
}

export interface BatchLogBiometricInput {
  entries: LogBiometricInput[];
}

export interface GetBiometricsQuery {
  page?: number;
  limit?: number;
  metricType?: string;
  startDate?: string;
  endDate?: string;
  doseId?: string;
}

export interface GetStatsQuery {
  metricType?: string;
  startDate?: string;
  endDate?: string;
}

export interface BiometricTrend {
  date: string;
  value: number;
}

export interface IBiometricService {
  logEntry(
    patientId: string,
    input: LogBiometricInput,
  ): Promise<BiometricEntry>;

  logBatch(
    patientId: string,
    input: BatchLogBiometricInput,
  ): Promise<number>;

  getEntries(
    patientId: string,
    query: GetBiometricsQuery,
  ): Promise<PaginatedResponse<BiometricEntryWithDose>>;

  getEntryById(
    id: string,
    patientId: string,
  ): Promise<BiometricEntryWithDose | null>;

  getEntriesByDose(
    doseId: string,
    patientId: string,
  ): Promise<BiometricEntry[]>;

  deleteEntry(id: string, patientId: string): Promise<void>;

  getStats(
    patientId: string,
    query: GetStatsQuery,
  ): Promise<BiometricStats[]>;

  getStatsByMetric(
    patientId: string,
    metricType: string,
    query: GetStatsQuery,
  ): Promise<BiometricStats | null>;

  getTrend(
    patientId: string,
    metricType: string,
    days?: number,
  ): Promise<BiometricTrend[]>;
}
