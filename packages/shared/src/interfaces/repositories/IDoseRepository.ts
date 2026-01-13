import { IBaseRepository, FindManyOptions } from "./IBaseRepository.js";
import {
  Dose,
  Alert,
  DoseWithSubstance,
  DoseWithDetails,
  SideEffectWithRelations,
  DoseStats,
} from "../../entities/index.js";
import { PaginatedResponse, Decimal } from "../../types/index.js";

export interface CreateDoseInput {
  patientId: string;
  protocolSubstanceId?: string;
  substanceId: string;
  dose: Decimal;
  doseUnit?: string;
  scheduledAt?: Date;
  status?: string;
  administrationSite?: string;
  notes?: string;
  photoUrl?: string;
}

export interface UpdateDoseInput {
  status?: string;
  administrationSite?: string;
  notes?: string;
}

export interface CreateSideEffectInput {
  patientId: string;
  doseId?: string;
  substanceId?: string;
  symptom: string;
  severity: number;
  durationHours?: Decimal;
  notes?: string;
}

export interface FindDosesOptions extends FindManyOptions {
  patientId: string;
  substanceId?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface FindSideEffectsOptions extends FindManyOptions {
  patientId: string;
  substanceId?: string;
  minSeverity?: number;
}

export interface IDoseRepository extends IBaseRepository<
  Dose,
  CreateDoseInput,
  UpdateDoseInput
> {
  findManyByPatient(
    options: FindDosesOptions,
  ): Promise<PaginatedResponse<DoseWithSubstance>>;
  findByIdWithDetails(id: string): Promise<DoseWithDetails | null>;
  findTodayByPatient(patientId: string): Promise<DoseWithSubstance[]>;
  getStats(
    patientId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<DoseStats>;

  // Side effect methods
  createSideEffect(
    data: CreateSideEffectInput,
  ): Promise<SideEffectWithRelations>;
  findSideEffects(
    options: FindSideEffectsOptions,
  ): Promise<PaginatedResponse<SideEffectWithRelations>>;
  findDoseById(id: string): Promise<Dose | null>;

  // Alert methods
  findActiveAlerts(patientId: string): Promise<Alert[]>;
}
