import { Vial } from "@biostak/shared/prisma";
import { VialWithProduct } from "../repositories/IVialRepository.js";
import { PaginatedResponse } from "../../types/index.js";

export interface CreateVialInput {
  productId: string;
  vialAmountMcg?: number;
  lotNumber?: string;
  manufacturerExpDate?: string; // ISO date
  storageLocation?: string;
  requiresRefrigeration?: boolean;
  notes?: string;
}

export interface UpdateVialInput {
  lotNumber?: string;
  manufacturerExpDate?: string;
  storageLocation?: string;
  requiresRefrigeration?: boolean;
  notes?: string;
  status?: "active" | "depleted" | "expired" | "disposed";
}

export interface ReconstitutionInput {
  diluentType: "bacteriostatic_water" | "saline" | "sterile_water";
  diluentVolumeMl: number;
}

export interface GetVialsQuery {
  page?: number;
  limit?: number;
  productId?: string;
  status?: string;
  substanceId?: string;
}

export interface IVialService {
  createVial(patientId: string, input: CreateVialInput): Promise<VialWithProduct>;

  getVials(
    patientId: string,
    query: GetVialsQuery,
  ): Promise<PaginatedResponse<VialWithProduct>>;

  getVialById(id: string, patientId: string): Promise<VialWithProduct>;

  getActiveVials(patientId: string): Promise<VialWithProduct[]>;

  getActiveVialsByProduct(
    patientId: string,
    productId: string,
  ): Promise<VialWithProduct[]>;

  updateVial(
    id: string,
    patientId: string,
    input: UpdateVialInput,
  ): Promise<Vial>;

  reconstitute(
    id: string,
    patientId: string,
    input: ReconstitutionInput,
  ): Promise<VialWithProduct>;

  markDepleted(id: string, patientId: string): Promise<Vial>;

  // Called when logging a dose from this vial
  decrementForDose(
    id: string,
    patientId: string,
    doseMcg: number,
  ): Promise<Vial>;
}
