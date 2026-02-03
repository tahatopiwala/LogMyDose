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
  status: "draft" | "active" | "paused" | "completed";
  startDate: string | null;
  endDate: string | null;
  notes: string | null;
  createdAt: string;
  template?: { id: string; name: string } | null;
  substances: ProtocolSubstance[];
}

// Active protocol substance for dose logging
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
  };
}

// Dose types
export interface Dose {
  id: string;
  patientId: string;
  substanceId: string;
  protocolSubstanceId: string | null; // Nullable for ad-hoc logging
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
