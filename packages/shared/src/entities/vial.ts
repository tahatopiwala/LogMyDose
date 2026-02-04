import { Decimal } from "../types/database.js";

// Vial status types
export type VialStatus = "active" | "depleted" | "expired" | "disposed";
export type DiluentType = "bacteriostatic_water" | "saline" | "sterile_water";

/**
 * Vial entity - Track individual vials with reconstitution and inventory
 * Maps to: vials table
 */
export interface Vial {
  id: string;
  patientId: string;
  productId: string;

  // Reconstitution details
  reconstitutedAt: Date | null;
  diluentType: DiluentType | null;
  diluentVolumeMl: Decimal | null;
  concentrationMcgMl: Decimal | null;

  // Vial contents
  vialAmountMcg: Decimal | null;
  remainingAmountMcg: Decimal | null;

  // Lot/batch tracking
  lotNumber: string | null;
  manufacturerExpDate: Date | null;
  calculatedExpDate: Date | null;

  // Storage
  storageLocation: string | null;
  requiresRefrigeration: boolean;

  // Status
  status: VialStatus;
  depletedAt: Date | null;

  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Vial with product details
 */
export interface VialWithProduct extends Vial {
  product: {
    id: string;
    name: string;
    substanceId: string;
    doseUnit: string | null;
    substance: {
      id: string;
      name: string;
      doseUnit: string | null;
      shelfLifeReconstitutedDays: number | null;
    };
  };
}

/**
 * Vial with dose count
 */
export interface VialWithStats extends VialWithProduct {
  _count?: {
    doses: number;
  };
  doseCount?: number;
}

/**
 * Input for creating a new vial
 */
export interface CreateVialInput {
  productId: string;
  vialAmountMcg?: number;
  lotNumber?: string;
  manufacturerExpDate?: string; // ISO date
  storageLocation?: string;
  requiresRefrigeration?: boolean;
  notes?: string;
}

/**
 * Input for updating a vial
 */
export interface UpdateVialInput {
  lotNumber?: string;
  manufacturerExpDate?: string;
  storageLocation?: string;
  requiresRefrigeration?: boolean;
  notes?: string;
  status?: VialStatus;
}

/**
 * Input for reconstituting a vial
 */
export interface ReconstitutionInput {
  diluentType: DiluentType;
  diluentVolumeMl: number;
}
