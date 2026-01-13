// Protocol types
export interface ProtocolSubstance {
  id: string;
  protocolId: string;
  substanceId: string;
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

// Dose types
export interface Dose {
  id: string;
  patientId: string;
  substanceId: string;
  protocolSubstanceId: string | null;
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
export interface Substance {
  id: string;
  categoryId: string;
  name: string;
  aliases: string[];
  defaultDose: number | string | null;
  doseUnit: string | null;
  defaultFrequency: string | null;
  administrationRoute: string | null;
  category?: { id: string; name: string; displayName: string };
}

export interface SubstanceCategory {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  icon: string | null;
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
