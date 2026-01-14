import { Decimal, JsonValue } from "../types/database.js";

/**
 * SubstanceCategory entity
 * Maps to: substance_categories table
 */
export interface SubstanceCategory {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  icon: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
}

/**
 * FDA status for substances
 */
export type FdaStatus = "approved" | "research" | "supplement" | "withdrawn";

/**
 * Reference for a substance (study, FDA document, etc.)
 */
export interface SubstanceReference {
  title: string;
  url: string;
  type: "fda_label" | "study" | "guideline" | "nih_resource" | "fda_document";
}

/**
 * Substance entity - Peptides, hormones, supplements, etc.
 * Maps to: substances table
 */
export interface Substance {
  id: string;
  categoryId: string;
  name: string;
  aliases: string[];
  subcategory: string | null;
  defaultDose: Decimal | null;
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
  references: SubstanceReference[] | JsonValue | null;
  // Metadata
  isActive: boolean;
  createdAt: Date;
}

/**
 * Substance with category relation
 */
export interface SubstanceWithCategory extends Substance {
  category: {
    id: string;
    name: string;
    displayName: string;
  };
}
