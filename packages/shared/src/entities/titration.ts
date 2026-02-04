// Titration phase status
export type TitrationPhaseStatus = "active" | "completed" | "skipped";

// Reason for phase transition
export type TitrationReason =
  | "scheduled"
  | "tolerability"
  | "side_effects"
  | "plateau"
  | "custom";

// Titration phase entity
export interface TitrationPhase {
  id: string;
  patientId: string;
  protocolSubstanceId: string;
  phaseNumber: number;
  doseAmount: number | string;
  doseUnit: string;
  startDate: Date;
  endDate: Date | null;
  weeksAtDose: number;
  reason: TitrationReason;
  status: TitrationPhaseStatus;
  targetDose: number | string | null;
  isMaintenancePhase: boolean;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Titration phase with related substance data
export interface TitrationPhaseWithSubstance extends TitrationPhase {
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

// Input for creating a titration phase
export interface CreateTitrationPhaseInput {
  protocolSubstanceId: string;
  doseAmount: number;
  doseUnit: string;
  weeksAtDose: number;
  reason?: TitrationReason;
  targetDose?: number;
  isMaintenancePhase?: boolean;
  notes?: string;
  startDate?: string;
}

// Input for updating a titration phase
export interface UpdateTitrationPhaseInput {
  weeksAtDose?: number;
  reason?: TitrationReason;
  status?: TitrationPhaseStatus;
  notes?: string;
}

// Standard titration step definition
export interface TitrationStep {
  doseAmount: number;
  doseUnit: string;
  weeksAtDose: number;
  isMaintenance?: boolean;
}

// Standard titration plan template
export interface TitrationPlanTemplate {
  substanceName: string;
  substanceAliases: string[];
  targetDose: number;
  doseUnit: string;
  steps: TitrationStep[];
  notes?: string;
}

// Current titration progress info
export interface TitrationProgress {
  currentPhase: TitrationPhaseWithSubstance | null;
  totalPhases: number;
  completedPhases: number;
  currentDose: number;
  targetDose: number;
  doseUnit: string;
  progressPercent: number;
  weeksRemaining: number;
  nextPhaseDate: Date | null;
  isAtMaintenance: boolean;
}

// ============================================
// STANDARD TITRATION PLANS
// ============================================

export const SEMAGLUTIDE_TITRATION: TitrationPlanTemplate = {
  substanceName: "Semaglutide",
  substanceAliases: ["Ozempic", "Wegovy", "Rybelsus"],
  targetDose: 2.4,
  doseUnit: "mg",
  steps: [
    { doseAmount: 0.25, doseUnit: "mg", weeksAtDose: 4 },
    { doseAmount: 0.5, doseUnit: "mg", weeksAtDose: 4 },
    { doseAmount: 1.0, doseUnit: "mg", weeksAtDose: 4 },
    { doseAmount: 1.7, doseUnit: "mg", weeksAtDose: 4 },
    { doseAmount: 2.4, doseUnit: "mg", weeksAtDose: 4, isMaintenance: true },
  ],
  notes: "Standard FDA-approved titration schedule for weight management",
};

export const TIRZEPATIDE_TITRATION: TitrationPlanTemplate = {
  substanceName: "Tirzepatide",
  substanceAliases: ["Mounjaro", "Zepbound"],
  targetDose: 15,
  doseUnit: "mg",
  steps: [
    { doseAmount: 2.5, doseUnit: "mg", weeksAtDose: 4 },
    { doseAmount: 5, doseUnit: "mg", weeksAtDose: 4 },
    { doseAmount: 7.5, doseUnit: "mg", weeksAtDose: 4 },
    { doseAmount: 10, doseUnit: "mg", weeksAtDose: 4 },
    { doseAmount: 12.5, doseUnit: "mg", weeksAtDose: 4 },
    { doseAmount: 15, doseUnit: "mg", weeksAtDose: 4, isMaintenance: true },
  ],
  notes: "Standard FDA-approved titration schedule",
};

// All available titration plans
export const STANDARD_TITRATION_PLANS: TitrationPlanTemplate[] = [
  SEMAGLUTIDE_TITRATION,
  TIRZEPATIDE_TITRATION,
];

// Helper to find a titration plan by substance name
export function findTitrationPlan(
  substanceName: string
): TitrationPlanTemplate | undefined {
  const lowerName = substanceName.toLowerCase();
  return STANDARD_TITRATION_PLANS.find(
    (plan) =>
      plan.substanceName.toLowerCase() === lowerName ||
      plan.substanceAliases.some((alias) => alias.toLowerCase() === lowerName)
  );
}
