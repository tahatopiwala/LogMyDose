import { Product, Prisma } from "@biostak/shared/prisma";
import { IBaseRepository, FindManyOptions } from "./IBaseRepository.js";
import { PaginatedResponse } from "../../types/index.js";

export interface CreateProductInput {
  substanceId: string;
  name: string;
  defaultDose?: Prisma.Decimal | number;
  doseUnit?: string;
  isGlobal?: boolean;
  patientId?: string;
}

export interface UpdateProductInput {
  name?: string;
  defaultDose?: Prisma.Decimal | number;
  doseUnit?: string;
  isActive?: boolean;
}

export interface ProductWithSubstance extends Product {
  substance: {
    id: string;
    name: string;
    categoryId: string;
    doseUnit: string | null;
  };
}

export interface FindProductsOptions extends FindManyOptions {
  substanceId?: string;
  patientId?: string;
  includeGlobal?: boolean;
  search?: string;
  isActive?: boolean;
}

export interface IProductRepository
  extends IBaseRepository<Product, CreateProductInput, UpdateProductInput> {
  findByIdWithSubstance(id: string): Promise<ProductWithSubstance | null>;

  // Find products visible to a patient (global + their custom)
  findVisibleToPatient(
    patientId: string,
    options?: FindProductsOptions,
  ): Promise<PaginatedResponse<ProductWithSubstance>>;

  // Find products by substance for a patient (for dropdown filtering)
  findBySubstanceForPatient(
    substanceId: string,
    patientId: string,
  ): Promise<ProductWithSubstance[]>;

  // Global product operations (admin only)
  findGlobalProducts(
    options?: FindProductsOptions,
  ): Promise<PaginatedResponse<ProductWithSubstance>>;
}
