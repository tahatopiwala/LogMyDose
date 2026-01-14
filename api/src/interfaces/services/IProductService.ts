import { Product } from "@logmydose/shared/prisma";
import {
  ProductWithSubstance,
  CreateProductInput,
  UpdateProductInput,
} from "../repositories/IProductRepository.js";
import { PaginatedResponse } from "../../types/index.js";

export interface GetProductsQuery {
  page?: number;
  limit?: number;
  substanceId?: string;
  search?: string;
}

export interface CreateCustomProductInput {
  substanceId: string;
  name: string;
  defaultDose?: number;
  doseUnit?: string;
}

export interface IProductService {
  // Patient methods - view products visible to them
  getProductsForPatient(
    patientId: string,
    query?: GetProductsQuery,
  ): Promise<PaginatedResponse<ProductWithSubstance>>;

  getProductsBySubstanceForPatient(
    substanceId: string,
    patientId: string,
  ): Promise<ProductWithSubstance[]>;

  getProductById(id: string): Promise<ProductWithSubstance | null>;

  // Patient methods - manage their custom products
  createCustomProduct(
    patientId: string,
    data: CreateCustomProductInput,
  ): Promise<Product>;

  updateCustomProduct(
    productId: string,
    patientId: string,
    data: UpdateProductInput,
  ): Promise<Product>;

  deleteCustomProduct(productId: string, patientId: string): Promise<void>;

  // Admin methods - manage global products
  getGlobalProducts(
    query?: GetProductsQuery,
  ): Promise<PaginatedResponse<ProductWithSubstance>>;

  createGlobalProduct(data: CreateProductInput): Promise<Product>;

  updateGlobalProduct(
    productId: string,
    data: UpdateProductInput,
  ): Promise<Product>;

  deleteGlobalProduct(productId: string): Promise<void>;
}
