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
  source: string;
  templateId: string | null;
  status: "draft" | "active" | "paused" | "completed";
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
    status: string;
    startDate: string | null;
    endDate: string | null;
    source: string;
  };
}

// Dose types
export interface Dose {
  id: string;
  patientId: string;
  substanceId: string;
  protocolSubstanceId: string;
  productId: string | null;
  dose: number | string;
  doseUnit: string | null;
  scheduledAt: string | null;
  loggedAt: string;
  status: "taken" | "missed" | "skipped";
  administrationSite: string | null;
  notes: string | null;
  substance: {
    id: string;
    name: string;
    doseUnit: string | null;
  };
  product?: {
    id: string;
    name: string;
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
