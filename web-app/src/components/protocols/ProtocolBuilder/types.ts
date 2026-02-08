import { Substance, Product } from "@/types/domain";

/**
 * Standard titration step definition
 */
export interface TitrationStep {
  doseAmount: number;
  doseUnit: string;
  weeksAtDose: number;
  isMaintenance?: boolean;
}

/**
 * Standard titration plan template
 */
export interface TitrationPlanTemplate {
  substanceName: string;
  substanceAliases: string[];
  targetDose: number;
  doseUnit: string;
  steps: TitrationStep[];
  notes?: string;
}

/**
 * Standard titration plans for known substances
 */
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

const STANDARD_TITRATION_PLANS: TitrationPlanTemplate[] = [
  SEMAGLUTIDE_TITRATION,
  TIRZEPATIDE_TITRATION,
];

/**
 * Find a titration plan by substance name
 */
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

/**
 * Configuration for a single substance in the protocol builder
 */
export interface SubstanceConfig {
  tempId: string; // React key (uuid)
  substanceId: string;
  substance: Substance; // Full data for display
  dose: number;
  doseUnit: string;
  frequency: string;
  // Cycling
  cyclingEnabled: boolean;
  cycleOnWeeks: number | null;
  cycleOffWeeks: number | null;
  cyclingAutoApplied: boolean; // Show badge if true
  // Titration
  titrationEnabled: boolean;
  titrationPlan: TitrationPlanTemplate | null;
  titrationAutoApplied: boolean;
  // Product (optional)
  productId: string | null;
  product: Product | null;
  // Notes
  notes: string;
}

/**
 * Main state for the protocol builder
 */
export interface ProtocolBuilderState {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  substances: SubstanceConfig[];
  // UI state
  editingSubstanceId: string | null;
  addDrawerOpen: boolean;
}

/**
 * Actions for the protocol builder reducer
 */
export type ProtocolBuilderAction =
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_DESCRIPTION"; payload: string }
  | { type: "SET_START_DATE"; payload: string }
  | { type: "SET_END_DATE"; payload: string }
  | { type: "ADD_SUBSTANCE"; payload: SubstanceConfig }
  | { type: "REMOVE_SUBSTANCE"; payload: string } // tempId
  | {
      type: "UPDATE_SUBSTANCE";
      payload: { tempId: string; updates: Partial<SubstanceConfig> };
    }
  | { type: "SET_EDITING_SUBSTANCE"; payload: string | null }
  | { type: "SET_ADD_DRAWER_OPEN"; payload: boolean }
  | { type: "RESET" };

/**
 * Frequency options for dose scheduling
 */
export const FREQUENCY_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "2x_daily", label: "2x Daily" },
  { value: "3x_weekly", label: "3x Weekly" },
  { value: "weekly", label: "Weekly" },
  { value: "as_needed", label: "As Needed" },
] as const;

/**
 * Dose unit options
 */
export const DOSE_UNIT_OPTIONS = [
  { value: "mcg", label: "mcg" },
  { value: "mg", label: "mg" },
  { value: "ml", label: "ml" },
  { value: "IU", label: "IU" },
  { value: "units", label: "units" },
] as const;

/**
 * Apply smart defaults to a substance
 */
export function applySmartDefaults(substance: Substance): SubstanceConfig {
  const config: SubstanceConfig = {
    tempId: crypto.randomUUID(),
    substanceId: substance.id,
    substance,
    dose: Number(substance.defaultDose) || 100,
    doseUnit: substance.doseUnit || "mcg",
    frequency: substance.defaultFrequency || "daily",
    cyclingEnabled: false,
    cycleOnWeeks: null,
    cycleOffWeeks: null,
    cyclingAutoApplied: false,
    titrationEnabled: false,
    titrationPlan: null,
    titrationAutoApplied: false,
    productId: null,
    product: null,
    notes: "",
  };

  // Auto-enable cycling if substance requires it
  if (substance.requiresCycling && substance.commonCycleOnWeeks) {
    config.cyclingEnabled = true;
    config.cycleOnWeeks = substance.commonCycleOnWeeks;
    config.cycleOffWeeks = substance.commonCycleOffWeeks || 0;
    config.cyclingAutoApplied = true;
  }

  // Auto-enable titration if standard plan exists
  const plan = findTitrationPlan(substance.name);
  if (plan) {
    config.titrationEnabled = true;
    config.titrationPlan = plan;
    config.dose = plan.steps[0].doseAmount;
    config.doseUnit = plan.steps[0].doseUnit;
    config.titrationAutoApplied = true;
  }

  return config;
}
