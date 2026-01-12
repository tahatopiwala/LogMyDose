import { Decimal } from '../types/database.js';

/**
 * Dose entity - Individual dose logs
 * Maps to: doses table
 */
export interface Dose {
  id: string;
  patientId: string;
  protocolSubstanceId: string | null;
  substanceId: string;
  dose: Decimal;
  doseUnit: string | null;
  scheduledAt: Date | null;
  loggedAt: Date;
  status: string;
  administrationSite: string | null;
  notes: string | null;
  photoUrl: string | null;
}

/**
 * SideEffect entity
 * Maps to: side_effects table
 */
export interface SideEffect {
  id: string;
  patientId: string;
  doseId: string | null;
  substanceId: string | null;
  symptom: string;
  severity: number;
  durationHours: Decimal | null;
  notes: string | null;
  reportedAt: Date;
}

/**
 * Dose with substance relation
 */
export interface DoseWithSubstance extends Dose {
  substance: {
    id: string;
    name: string;
    doseUnit: string | null;
  };
  sideEffects?: Array<{
    id: string;
    symptom: string;
    severity: number;
  }>;
}

/**
 * Dose with all relations
 */
export interface DoseWithDetails extends Dose {
  substance: {
    id: string;
    name: string;
    doseUnit: string | null;
  };
  protocolSubstance: {
    protocol: {
      id: string;
      status: string;
    };
  } | null;
  sideEffects: SideEffect[];
}

/**
 * SideEffect with relations
 */
export interface SideEffectWithRelations extends SideEffect {
  substance: { id: string; name: string } | null;
  dose: { id: string; dose: Decimal; loggedAt: Date } | null;
}

/**
 * Aggregated dose statistics
 */
export interface DoseStats {
  totalDoses: number;
  takenDoses: number;
  missedDoses: number;
  skippedDoses: number;
  sideEffectCount: number;
  adherenceRate: number;
  period: {
    start: Date;
    end: Date;
  };
}
