import { Decimal, JsonValue } from "../types/database.js";

/**
 * ProtocolTemplate entity - Public protocol library
 * Maps to: protocol_templates table
 */
export interface ProtocolTemplate {
  id: string;
  name: string;
  description: string | null;
  categoryId: string | null;
  substanceId: string | null;
  defaultDose: Decimal | null;
  doseUnit: string | null;
  frequency: string | null;
  titrationPlan: JsonValue | null;
  cycleOnWeeks: number | null;
  cycleOffWeeks: number | null;
  difficultyLevel: string | null;
  tags: string[];
  useCount: number;
  isPublic: boolean;
  createdAt: Date;
}

/**
 * Protocol entity - Patient's active protocols
 * Maps to: protocols table
 */
export interface Protocol {
  id: string;
  patientId: string;
  name: string | null;
  description: string | null;
  source: string;
  templateId: string | null;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  notes: string | null;
  createdAt: Date;
}

/**
 * ProtocolSubstance entity - Many-to-many with dosing details
 * Maps to: protocol_substances table
 */
export interface ProtocolSubstance {
  id: string;
  protocolId: string;
  substanceId: string;
  productId: string | null;
  dose: Decimal;
  doseUnit: string | null;
  frequency: string | null;
  schedule: JsonValue | null;
  titrationPlan: JsonValue | null;
  cycleOnWeeks: number | null;
  cycleOffWeeks: number | null;
  currentSupplyAmount: Decimal | null;
  supplyUnit: string | null;
  supplyExpirationDate: Date | null;
  notes: string | null;
}

/**
 * Protocol with all relations
 */
export interface ProtocolWithDetails extends Protocol {
  template: { id: string; name: string } | null;
  patient: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  substances: Array<
    ProtocolSubstance & {
      substance: {
        id: string;
        name: string;
        doseUnit: string | null;
        administrationRoute: string | null;
      };
      product?: {
        id: string;
        name: string;
      } | null;
    }
  >;
}

/**
 * Template with category and substance relations
 */
export interface TemplateWithRelations extends ProtocolTemplate {
  category: { id: string; name: string; displayName: string } | null;
  substance: { id: string; name: string; doseUnit: string | null } | null;
}
