import { TitrationPhase } from "@biostak/shared/prisma";
import { TitrationPhaseWithSubstance } from "../repositories/ITitrationRepository.js";

export interface StartTitrationInput {
  protocolSubstanceId: string;
  planName?: string; // Use standard plan (e.g., "Semaglutide", "Tirzepatide")
  customSteps?: TitrationStepInput[]; // Or provide custom steps
  startDate?: string;
  notes?: string;
}

export interface TitrationStepInput {
  doseAmount: number;
  doseUnit: string;
  weeksAtDose: number;
  isMaintenance?: boolean;
}

export interface AdvancePhaseInput {
  reason?: "scheduled" | "tolerability" | "side_effects" | "plateau" | "custom";
  notes?: string;
  customDose?: number;
  customWeeks?: number;
}

export interface UpdateTitrationInput {
  weeksAtDose?: number;
  notes?: string;
}

export interface TitrationProgress {
  currentPhase: TitrationPhaseWithSubstance | null;
  phases: TitrationPhaseWithSubstance[];
  totalPhases: number;
  completedPhases: number;
  currentDose: number;
  targetDose: number;
  doseUnit: string;
  progressPercent: number;
  weeksInCurrentPhase: number;
  weeksRemainingInPhase: number;
  nextPhaseDate: Date | null;
  isAtMaintenance: boolean;
}

export interface TitrationSummary {
  activeTitrations: number;
  atMaintenance: number;
  completed: number;
}

export interface ITitrationService {
  // Start a new titration for a protocol substance
  startTitration(patientId: string, input: StartTitrationInput): Promise<TitrationPhase[]>;

  // Get all titration phases for a patient
  getTitrationPhases(
    patientId: string,
    protocolSubstanceId?: string
  ): Promise<TitrationPhaseWithSubstance[]>;

  // Get a specific titration phase by ID
  getTitrationPhaseById(
    id: string,
    patientId: string
  ): Promise<TitrationPhaseWithSubstance | null>;

  // Get the active titration phase for a protocol substance
  getActivePhase(
    protocolSubstanceId: string,
    patientId: string
  ): Promise<TitrationPhaseWithSubstance | null>;

  // Get full titration progress for a protocol substance
  getTitrationProgress(
    protocolSubstanceId: string,
    patientId: string
  ): Promise<TitrationProgress | null>;

  // Update a titration phase
  updatePhase(
    id: string,
    patientId: string,
    input: UpdateTitrationInput
  ): Promise<TitrationPhase>;

  // Advance to the next phase
  advanceToNextPhase(
    protocolSubstanceId: string,
    patientId: string,
    input?: AdvancePhaseInput
  ): Promise<TitrationPhase>;

  // Skip a phase (move to next without completing weeks)
  skipPhase(
    id: string,
    patientId: string,
    notes?: string
  ): Promise<TitrationPhase>;

  // Refresh phase status based on current date
  refreshPhaseStatus(id: string): Promise<TitrationPhase>;

  // Get titration summary for a patient
  getTitrationSummary(patientId: string): Promise<TitrationSummary>;

  // Get available standard titration plans
  getAvailablePlans(): { name: string; targetDose: number; doseUnit: string; steps: number }[];
}
