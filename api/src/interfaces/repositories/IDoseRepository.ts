import { Dose, SideEffect, Alert, Prisma } from '@logmydose/shared/prisma';
import { IBaseRepository, FindManyOptions } from './IBaseRepository.js';
import { PaginatedResponse } from '../../types/index.js';

export interface CreateDoseInput {
  patientId: string;
  protocolSubstanceId?: string;
  substanceId: string;
  dose: Prisma.Decimal | number;
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
  durationHours?: Prisma.Decimal | number;
  notes?: string;
}

export interface DoseWithSubstance extends Dose {
  substance: {
    id: string;
    name: string;
    doseUnit: string | null;
  };
  sideEffects?: Array<{ id: string; symptom: string; severity: number }>;
}

export interface DoseWithDetails extends Dose {
  substance: {
    id: string;
    name: string;
    doseUnit: string | null;
  };
  protocolSubstance?: {
    protocol: { id: string; status: string };
  } | null;
  sideEffects: SideEffect[];
}

export interface SideEffectWithRelations extends SideEffect {
  substance?: { id: string; name: string } | null;
  dose?: { id: string; dose: Prisma.Decimal; loggedAt: Date } | null;
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

export interface DoseStats {
  totalDoses: number;
  takenDoses: number;
  missedDoses: number;
  skippedDoses: number;
  sideEffectCount: number;
  adherenceRate: number;
  period: { start: Date; end: Date };
}

export interface IDoseRepository extends IBaseRepository<Dose, CreateDoseInput, UpdateDoseInput> {
  findManyByPatient(options: FindDosesOptions): Promise<PaginatedResponse<DoseWithSubstance>>;
  findByIdWithDetails(id: string): Promise<DoseWithDetails | null>;
  findTodayByPatient(patientId: string): Promise<DoseWithSubstance[]>;
  getStats(patientId: string, startDate: Date, endDate: Date): Promise<DoseStats>;

  // Side effect methods
  createSideEffect(data: CreateSideEffectInput): Promise<SideEffectWithRelations>;
  findSideEffects(options: FindSideEffectsOptions): Promise<PaginatedResponse<SideEffectWithRelations>>;
  findDoseById(id: string): Promise<Dose | null>;

  // Alert methods
  findActiveAlerts(patientId: string): Promise<Alert[]>;
}
