import { Cycle } from "@biostak/shared/prisma";
import { CycleWithSubstance } from "../repositories/ICycleRepository.js";

export interface StartCycleInput {
  protocolSubstanceId: string;
  startDate?: string;
  onWeeks: number;
  offWeeks: number;
  notes?: string;
}

export interface UpdateCycleInput {
  onWeeks?: number;
  offWeeks?: number;
  notes?: string;
}

export interface CyclePhaseInfo {
  cycleId: string;
  status: "on" | "off" | "completed";
  currentWeek: number;
  totalWeeks: number;
  weeksRemaining: number;
  phaseEndDate: Date;
  nextPhaseDate: Date | null;
  isLastWeekOfPhase: boolean;
}

export interface CycleSummary {
  activeCycles: number;
  onPhase: number;
  offPhase: number;
  completedCycles: number;
}

export interface ICycleService {
  // Start a new cycle for a protocol substance
  startCycle(patientId: string, input: StartCycleInput): Promise<Cycle>;

  // Get all cycles for a patient
  getCycles(patientId: string, protocolSubstanceId?: string): Promise<CycleWithSubstance[]>;

  // Get a specific cycle by ID
  getCycleById(id: string, patientId: string): Promise<CycleWithSubstance | null>;

  // Get the active cycle for a protocol substance
  getActiveCycle(protocolSubstanceId: string, patientId: string): Promise<CycleWithSubstance | null>;

  // Update a cycle
  updateCycle(id: string, patientId: string, input: UpdateCycleInput): Promise<Cycle>;

  // Complete/end a cycle
  completeCycle(id: string, patientId: string): Promise<Cycle>;

  // Calculate current phase info for a cycle
  calculatePhaseInfo(cycle: Cycle): CyclePhaseInfo;

  // Refresh cycle status based on current date
  refreshCycleStatus(id: string): Promise<Cycle>;

  // Get summary of all cycles for a patient
  getCycleSummary(patientId: string): Promise<CycleSummary>;
}
