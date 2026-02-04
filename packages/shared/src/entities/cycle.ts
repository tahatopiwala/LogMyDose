// Cycle status types
export type CycleStatus = "on" | "off" | "completed";

// Cycle entity interface
export interface Cycle {
  id: string;
  patientId: string;
  protocolSubstanceId: string;
  cycleNumber: number;
  startDate: Date;
  endDate: Date | null;
  onWeeks: number;
  offWeeks: number;
  status: CycleStatus;
  currentWeek: number;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Cycle with related data
export interface CycleWithSubstance extends Cycle {
  protocolSubstance: {
    id: string;
    dose: number | string;
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

// Input for creating a new cycle
export interface CreateCycleInput {
  protocolSubstanceId: string;
  cycleNumber?: number;
  startDate?: string;
  onWeeks: number;
  offWeeks: number;
  notes?: string;
}

// Input for updating a cycle
export interface UpdateCycleInput {
  endDate?: string;
  onWeeks?: number;
  offWeeks?: number;
  status?: CycleStatus;
  notes?: string;
}

// Cycle phase info (calculated)
export interface CyclePhaseInfo {
  cycleId: string;
  status: CycleStatus;
  currentWeek: number;
  totalWeeks: number;
  weeksRemaining: number;
  phaseEndDate: Date;
  nextPhaseDate: Date | null;
  isLastWeekOfPhase: boolean;
}

// Cycle summary for dashboard
export interface CycleSummary {
  activeCycles: number;
  onPhase: number;
  offPhase: number;
  completedCycles: number;
}
