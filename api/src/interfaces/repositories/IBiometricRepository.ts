import { BiometricEntry, Prisma } from "@biostak/shared/prisma";
import { IBaseRepository, FindManyOptions } from "./IBaseRepository.js";
import { PaginatedResponse } from "../../types/index.js";

export interface CreateBiometricInput {
  patientId: string;
  metricType: string;
  value: Prisma.Decimal | number;
  unit?: string;
  doseId?: string;
  notes?: string;
  recordedAt?: Date;
}

export interface BiometricEntryWithDose extends BiometricEntry {
  dose?: {
    id: string;
    dose: Prisma.Decimal;
    loggedAt: Date;
    substance: {
      id: string;
      name: string;
    };
  } | null;
}

export interface FindBiometricsOptions extends FindManyOptions {
  patientId: string;
  metricType?: string;
  startDate?: Date;
  endDate?: Date;
  doseId?: string;
}

export interface BiometricStats {
  metricType: string;
  count: number;
  min: number;
  max: number;
  avg: number;
  latest: number;
  latestRecordedAt: Date;
}

export interface IBiometricRepository
  extends IBaseRepository<BiometricEntry, CreateBiometricInput, Partial<CreateBiometricInput>> {
  findByPatient(
    options: FindBiometricsOptions,
  ): Promise<PaginatedResponse<BiometricEntryWithDose>>;

  findByMetricType(
    patientId: string,
    metricType: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<BiometricEntry[]>;

  findLatestByMetricType(
    patientId: string,
    metricType: string,
  ): Promise<BiometricEntry | null>;

  findByDose(doseId: string): Promise<BiometricEntry[]>;

  createMany(data: CreateBiometricInput[]): Promise<number>;

  getStats(
    patientId: string,
    metricType: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<BiometricStats | null>;

  getStatsByPatient(
    patientId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<BiometricStats[]>;
}
