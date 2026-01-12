import { Decimal } from '../types/database.js';

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
