import { Cycle, Prisma } from "@biostak/shared/prisma";
import { IBaseRepository } from "./IBaseRepository.js";

export interface CreateCycleInput {
  patientId: string;
  protocolSubstanceId: string;
  cycleNumber: number;
  startDate: Date;
  onWeeks: number;
  offWeeks: number;
  notes?: string;
}

export interface UpdateCycleInput {
  endDate?: Date;
  onWeeks?: number;
  offWeeks?: number;
  status?: "on" | "off" | "completed";
  currentWeek?: number;
  notes?: string;
}

export interface CycleWithSubstance extends Cycle {
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

export interface FindCyclesOptions {
  patientId: string;
  protocolSubstanceId?: string;
  status?: "on" | "off" | "completed";
  page?: number;
  limit?: number;
}

export interface ICycleRepository extends IBaseRepository<Cycle, CreateCycleInput, UpdateCycleInput> {
  findByPatient(options: FindCyclesOptions): Promise<CycleWithSubstance[]>;
  findByProtocolSubstance(protocolSubstanceId: string): Promise<CycleWithSubstance[]>;
  findActiveCycle(protocolSubstanceId: string): Promise<CycleWithSubstance | null>;
  findLatestCycle(protocolSubstanceId: string): Promise<Cycle | null>;
  create(data: CreateCycleInput): Promise<Cycle>;
  update(id: string, data: UpdateCycleInput): Promise<Cycle>;
  countByProtocolSubstance(protocolSubstanceId: string): Promise<number>;
}
