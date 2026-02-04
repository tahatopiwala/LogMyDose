import { Dose } from "@biostak/shared/prisma";
import {
  DoseWithSubstance,
  DoseWithDetails,
  SideEffectWithRelations,
  DoseStats,
} from "../repositories/IDoseRepository.js";
import { PaginatedResponse } from "../../types/index.js";

export interface LogDoseInput {
  protocolSubstanceId?: string; // Optional for ad-hoc logging
  substanceId: string;
  productId?: string; // Optional product reference
  vialId?: string; // Optional vial reference for injectable substances
  dose: number;
  doseUnit?: string;
  scheduledAt?: string;
  status?: "taken" | "missed" | "skipped";
  administrationSite?: string;
  notes?: string;
  photoUrl?: string;
  // Dose context fields
  fastingState?: "fasted" | "fed" | "unknown";
  takenWithFood?: boolean;
  mealFatContent?: "none" | "low" | "medium" | "high";
  timeOfDay?: "morning" | "afternoon" | "evening" | "night";
  needleGauge?: "25g" | "27g" | "29g" | "30g" | "31g";
  injectionDepth?: "subcutaneous" | "intramuscular";
}

export interface UpdateDoseInput {
  status?: "taken" | "missed" | "skipped";
  administrationSite?: string;
  notes?: string;
  // Dose context fields
  fastingState?: "fasted" | "fed" | "unknown";
  takenWithFood?: boolean;
  mealFatContent?: "none" | "low" | "medium" | "high";
  timeOfDay?: "morning" | "afternoon" | "evening" | "night";
  needleGauge?: "25g" | "27g" | "29g" | "30g" | "31g";
  injectionDepth?: "subcutaneous" | "intramuscular";
}

export interface LogSideEffectInput {
  doseId?: string;
  substanceId?: string;
  symptom: string;
  severity: number;
  durationHours?: number;
  notes?: string;
}

export interface GetDosesQuery {
  page?: number;
  limit?: number;
  substanceId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface GetSideEffectsQuery {
  page?: number;
  limit?: number;
  substanceId?: string;
  minSeverity?: number;
}

export interface GetStatsQuery {
  startDate?: string;
  endDate?: string;
}

export interface IDoseService {
  logDose(patientId: string, input: LogDoseInput): Promise<Dose>;
  getDoses(
    patientId: string,
    query: GetDosesQuery,
  ): Promise<PaginatedResponse<DoseWithSubstance>>;
  getTodayDoses(patientId: string): Promise<DoseWithSubstance[]>;
  getDoseById(id: string, patientId: string): Promise<DoseWithDetails | null>;
  updateDose(
    id: string,
    patientId: string,
    data: UpdateDoseInput,
  ): Promise<Dose>;
  logSideEffect(
    patientId: string,
    input: LogSideEffectInput,
  ): Promise<SideEffectWithRelations>;
  getSideEffects(
    patientId: string,
    query: GetSideEffectsQuery,
  ): Promise<PaginatedResponse<SideEffectWithRelations>>;
  getStats(patientId: string, query: GetStatsQuery): Promise<DoseStats>;
}
