import { Vial, Prisma } from "@biostak/shared/prisma";
import { IBaseRepository, FindManyOptions } from "./IBaseRepository.js";
import { PaginatedResponse } from "../../types/index.js";

export interface CreateVialInput {
  patientId: string;
  productId: string;
  vialAmountMcg?: Prisma.Decimal | number;
  lotNumber?: string;
  manufacturerExpDate?: Date;
  storageLocation?: string;
  requiresRefrigeration?: boolean;
  notes?: string;
}

export interface UpdateVialInput {
  lotNumber?: string;
  manufacturerExpDate?: Date;
  storageLocation?: string;
  requiresRefrigeration?: boolean;
  notes?: string;
  status?: "active" | "depleted" | "expired" | "disposed";
}

export interface ReconstitutionInput {
  diluentType: "bacteriostatic_water" | "saline" | "sterile_water";
  diluentVolumeMl: Prisma.Decimal | number;
}

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
  _count?: {
    doses: number;
  };
}

export interface FindVialsOptions extends FindManyOptions {
  patientId: string;
  productId?: string;
  status?: string;
  substanceId?: string;
}

export interface IVialRepository
  extends IBaseRepository<Vial, CreateVialInput, UpdateVialInput> {
  findByIdWithProduct(id: string): Promise<VialWithProduct | null>;

  findByPatient(
    options: FindVialsOptions,
  ): Promise<PaginatedResponse<VialWithProduct>>;

  findActiveByPatient(patientId: string): Promise<VialWithProduct[]>;

  findActiveByProduct(
    patientId: string,
    productId: string,
  ): Promise<VialWithProduct[]>;

  reconstitute(
    id: string,
    input: ReconstitutionInput,
    calculatedExpDate: Date,
    concentrationMcgMl: Prisma.Decimal,
  ): Promise<Vial>;

  decrementRemaining(id: string, amountMcg: Prisma.Decimal): Promise<Vial>;

  markDepleted(id: string): Promise<Vial>;
}
