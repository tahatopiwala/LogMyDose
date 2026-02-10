// Protocol types
export interface ProtocolSubstance {
  id: string;
  protocolId: string;
  substanceId: string;
  productId: string | null;
  dose: number | string;
  doseUnit: string | null;
  frequency: string | null;
  schedule: unknown | null;
  cycleOnWeeks: number | null;
  cycleOffWeeks: number | null;
  notes: string | null;
  substance: {
    id: string;
    name: string;
    doseUnit: string | null;
    administrationRoute: string | null;
  };
  product?: {
    id: string;
    name: string;
    defaultDose: number | string | null;
    doseUnit: string | null;
  } | null;
}

export interface Protocol {
  id: string;
  patientId: string;
  name: string | null;
  description: string | null;
  source: string;
  templateId: string | null;
  status: "draft" | "active" | "paused" | "completed" | "archived";
  startDate: string | null;
  endDate: string | null;
  notes: string | null;
  createdAt: string;
  template?: { id: string; name: string } | null;
  substances: ProtocolSubstance[];
}

// Protocol template types
export interface ProtocolTemplate {
  id: string;
  name: string;
  description: string | null;
  categoryId: string | null;
  substanceId: string | null;
  defaultDose: number | string | null;
  doseUnit: string | null;
  frequency: string | null;
  cycleOnWeeks: number | null;
  cycleOffWeeks: number | null;
  difficultyLevel: string | null;
  tags: string[];
  useCount: number;
  category?: { id: string; name: string; displayName: string } | null;
  substance?: { id: string; name: string; doseUnit: string | null } | null;
}

// Active protocol substance for dose logging (from GET /protocols/my-substances)
export interface ActiveProtocolSubstance {
  id: string;
  protocolId: string;
  substanceId: string;
  productId: string | null;
  dose: number | string;
  doseUnit: string | null;
  frequency: string | null;
  schedule: unknown | null;
  cycleOnWeeks: number | null;
  cycleOffWeeks: number | null;
  notes: string | null;
  substance: {
    id: string;
    name: string;
    doseUnit: string | null;
    administrationRoute: string | null;
  };
  product?: {
    id: string;
    name: string;
    defaultDose: number | string | null;
    doseUnit: string | null;
  } | null;
  protocol: {
    id: string;
    name: string | null;
    status: string;
    startDate: string | null;
    endDate: string | null;
    source: string;
    template?: { id: string; name: string } | null;
  };
}

// Vial types
export type VialStatus = "active" | "depleted" | "expired" | "disposed";
export type DiluentType = "bacteriostatic_water" | "saline" | "sterile_water";

export interface Vial {
  id: string;
  patientId: string;
  productId: string;
  reconstitutedAt: string | null;
  diluentType: DiluentType | null;
  diluentVolumeMl: number | string | null;
  concentrationMcgMl: number | string | null;
  vialAmountMcg: number | string | null;
  remainingAmountMcg: number | string | null;
  lotNumber: string | null;
  manufacturerExpDate: string | null;
  calculatedExpDate: string | null;
  storageLocation: string | null;
  requiresRefrigeration: boolean;
  status: VialStatus;
  depletedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  product?: {
    id: string;
    name: string;
    substanceId: string;
    doseUnit: string | null;
    substance?: {
      id: string;
      name: string;
      doseUnit: string | null;
    };
  };
}

// Dose types
export interface Dose {
  id: string;
  patientId: string;
  substanceId: string;
  protocolSubstanceId: string | null; // Nullable for ad-hoc logging
  productId: string | null;
  vialId: string | null;
  dose: number | string;
  doseUnit: string | null;
  scheduledAt: string | null;
  loggedAt: string;
  status: "taken" | "missed" | "skipped";
  administrationSite: string | null;
  notes: string | null;
  // Dose context fields
  fastingState: "fasted" | "fed" | "unknown" | null;
  takenWithFood: boolean | null;
  mealFatContent: "none" | "low" | "medium" | "high" | null;
  timeOfDay: "morning" | "afternoon" | "evening" | "night" | null;
  needleGauge: "25g" | "27g" | "29g" | "30g" | "31g" | null;
  injectionDepth: "subcutaneous" | "intramuscular" | null;
  substance: {
    id: string;
    name: string;
    doseUnit: string | null;
  };
  product?: {
    id: string;
    name: string;
  } | null;
  vial?: {
    id: string;
    lotNumber: string | null;
  } | null;
}

export interface DoseStats {
  totalDoses: number;
  takenDoses: number;
  missedDoses: number;
  skippedDoses: number;
  sideEffectCount: number;
  adherenceRate: number;
  period: { start: string; end: string };
}

// Substance types
export type FdaStatus = "approved" | "research" | "supplement" | "withdrawn";

export interface SubstanceReference {
  title: string;
  url: string;
  type: "fda_label" | "study" | "guideline" | "nih_resource" | "fda_document";
}

export interface Substance {
  id: string;
  categoryId: string;
  name: string;
  aliases: string[];
  subcategory: string | null;
  defaultDose: number | string | null;
  doseUnit: string | null;
  defaultFrequency: string | null;
  administrationRoute: string | null;
  preparationInstructions: string | null;
  storageTemp: string | null;
  storageNotes: string | null;
  shelfLifeDays: number | null;
  shelfLifeReconstitutedDays: number | null;
  requiresCycling: boolean;
  commonCycleOnWeeks: number | null;
  commonCycleOffWeeks: number | null;
  contraindications: string[];
  commonSideEffects: string[];
  interactions: string[];
  onsetTimeline: string | null;
  isPrescriptionRequired: boolean;
  // FDA & Regulatory Info
  fdaStatus: FdaStatus | null;
  fdaApprovedFor: string[];
  fdaLabelUrl: string | null;
  references: SubstanceReference[] | null;
  // Metadata
  isActive: boolean;
  createdAt: string;
  category?: { id: string; name: string; displayName: string };
}

export interface SubstanceCategory {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  icon: string | null;
}

// Product types (branded versions of substances)
export interface Product {
  id: string;
  substanceId: string;
  name: string;
  defaultDose: number | string | null;
  doseUnit: string | null;
  isGlobal: boolean;
  patientId: string | null;
  isActive: boolean;
  createdAt: string;
  substance?: {
    id: string;
    name: string;
    categoryId: string;
    doseUnit: string | null;
  };
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Biometric types
export type MetricType =
  | "weight"
  | "blood_glucose"
  | "blood_pressure_systolic"
  | "blood_pressure_diastolic"
  | "heart_rate"
  | "body_fat_percentage"
  | "sleep_quality"
  | "energy_level"
  | "appetite_level"
  | "pain_level"
  | "mood"
  | "stress_level"
  | "hydration"
  | "steps"
  | "calories_burned";

export interface BiometricEntry {
  id: string;
  patientId: string;
  doseId: string | null;
  metricType: MetricType;
  value: number | string;
  unit: string | null;
  notes: string | null;
  recordedAt: string;
  createdAt: string;
  dose?: {
    id: string;
    dose: number | string;
    loggedAt: string;
    substance: {
      id: string;
      name: string;
    };
  } | null;
}

export interface BiometricStats {
  metricType: string;
  count: number;
  min: number;
  max: number;
  avg: number;
  latest: number;
  latestRecordedAt: string;
}

export interface BiometricTrend {
  date: string;
  value: number;
}

// Cycle types
export type CycleStatus = "on" | "off" | "completed";

export interface Cycle {
  id: string;
  patientId: string;
  protocolSubstanceId: string;
  cycleNumber: number;
  startDate: string;
  endDate: string | null;
  onWeeks: number;
  offWeeks: number;
  status: CycleStatus;
  currentWeek: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

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

export interface CyclePhaseInfo {
  cycleId: string;
  status: CycleStatus;
  currentWeek: number;
  totalWeeks: number;
  weeksRemaining: number;
  phaseEndDate: string;
  nextPhaseDate: string | null;
  isLastWeekOfPhase: boolean;
}

export interface CycleSummary {
  activeCycles: number;
  onPhase: number;
  offPhase: number;
  completedCycles: number;
}

// Titration types
export type TitrationPhaseStatus = "active" | "completed" | "skipped";
export type TitrationReason =
  | "scheduled"
  | "tolerability"
  | "side_effects"
  | "plateau"
  | "custom";

export interface TitrationPhase {
  id: string;
  patientId: string;
  protocolSubstanceId: string;
  phaseNumber: number;
  doseAmount: number | string;
  doseUnit: string;
  startDate: string;
  endDate: string | null;
  weeksAtDose: number;
  reason: TitrationReason;
  status: TitrationPhaseStatus;
  targetDose: number | string | null;
  isMaintenancePhase: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

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
  nextPhaseDate: string | null;
  isAtMaintenance: boolean;
}

export interface TitrationSummary {
  activeTitrations: number;
  atMaintenance: number;
  completed: number;
}

export interface TitrationPlan {
  name: string;
  targetDose: number;
  doseUnit: string;
  steps: number;
}
