import { TitrationPhase, Prisma } from "@biostak/shared/prisma";
import { IBaseRepository } from "./IBaseRepository.js";

export interface CreateTitrationPhaseInput {
  patientId: string;
  protocolSubstanceId: string;
  phaseNumber: number;
  doseAmount: Prisma.Decimal | number;
  doseUnit: string;
  startDate: Date;
  weeksAtDose: number;
  reason: string;
  targetDose?: Prisma.Decimal | number;
  isMaintenancePhase?: boolean;
  notes?: string;
}

export interface UpdateTitrationPhaseInput {
  endDate?: Date;
  weeksAtDose?: number;
  reason?: string;
  status?: "active" | "completed" | "skipped";
  notes?: string;
}

export interface TitrationPhaseWithSubstance extends TitrationPhase {
  protocolSubstance: {
    id: string;
    dose: Prisma.Decimal;
    doseUnit: string | null;
    frequency: string | null;
    substance: {
      id: string;
      name: string;
    };
    protocol: {
      id: string;
      name: string | null;
    };
  };
}

export interface FindTitrationPhasesOptions {
  patientId: string;
  protocolSubstanceId?: string;
  status?: "active" | "completed" | "skipped";
  page?: number;
  limit?: number;
}

export interface ITitrationRepository
  extends IBaseRepository<TitrationPhase, CreateTitrationPhaseInput, UpdateTitrationPhaseInput> {
  findByPatient(options: FindTitrationPhasesOptions): Promise<TitrationPhaseWithSubstance[]>;
  findByProtocolSubstance(protocolSubstanceId: string): Promise<TitrationPhaseWithSubstance[]>;
  findActivePhase(protocolSubstanceId: string): Promise<TitrationPhaseWithSubstance | null>;
  findLatestPhase(protocolSubstanceId: string): Promise<TitrationPhase | null>;
  countByProtocolSubstance(protocolSubstanceId: string): Promise<number>;
}
