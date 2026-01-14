import { Product } from "@logmydose/shared/prisma";
import {
  IProductService,
  GetProductsQuery,
  CreateCustomProductInput,
} from "../interfaces/services/IProductService.js";
import {
  IProductRepository,
  ProductWithSubstance,
  UpdateProductInput,
  CreateProductInput,
} from "../interfaces/repositories/IProductRepository.js";
import { ISubstanceRepository } from "../interfaces/repositories/ISubstanceRepository.js";
import { PaginatedResponse } from "../types/index.js";
import { AppError } from "../middleware/errorHandler.js";

export class ProductService implements IProductService {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly substanceRepository: ISubstanceRepository,
  ) {}

  async getProductsForPatient(
    patientId: string,
    query?: GetProductsQuery,
  ): Promise<PaginatedResponse<ProductWithSubstance>> {
    return this.productRepository.findVisibleToPatient(patientId, {
      page: query?.page,
      limit: query?.limit,
      substanceId: query?.substanceId,
      search: query?.search,
      isActive: true,
    });
  }

  async getProductsBySubstanceForPatient(
    substanceId: string,
    patientId: string,
  ): Promise<ProductWithSubstance[]> {
    // Verify substance exists
    const substance = await this.substanceRepository.findById(substanceId);
    if (!substance) {
      throw new AppError(404, "Substance not found", "SUBSTANCE_NOT_FOUND");
    }

    return this.productRepository.findBySubstanceForPatient(
      substanceId,
      patientId,
    );
  }

  async getProductById(id: string): Promise<ProductWithSubstance | null> {
    const product = await this.productRepository.findByIdWithSubstance(id);
    if (!product) {
      throw new AppError(404, "Product not found", "PRODUCT_NOT_FOUND");
    }
    return product;
  }

  async createCustomProduct(
    patientId: string,
    data: CreateCustomProductInput,
  ): Promise<Product> {
    // Verify substance exists
    const substance = await this.substanceRepository.findById(data.substanceId);
    if (!substance) {
      throw new AppError(404, "Substance not found", "SUBSTANCE_NOT_FOUND");
    }

    return this.productRepository.create({
      substanceId: data.substanceId,
      name: data.name,
      defaultDose: data.defaultDose,
      doseUnit: data.doseUnit,
      isGlobal: false,
      patientId,
    });
  }

  async updateCustomProduct(
    productId: string,
    patientId: string,
    data: UpdateProductInput,
  ): Promise<Product> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new AppError(404, "Product not found", "PRODUCT_NOT_FOUND");
    }

    // Verify the product belongs to this patient
    if (product.patientId !== patientId) {
      throw new AppError(
        403,
        "You can only update your own custom products",
        "FORBIDDEN",
      );
    }

    // Cannot update global products via this method
    if (product.isGlobal) {
      throw new AppError(
        403,
        "Cannot update global products",
        "FORBIDDEN",
      );
    }

    return this.productRepository.update(productId, data);
  }

  async deleteCustomProduct(productId: string, patientId: string): Promise<void> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new AppError(404, "Product not found", "PRODUCT_NOT_FOUND");
    }

    // Verify the product belongs to this patient
    if (product.patientId !== patientId) {
      throw new AppError(
        403,
        "You can only delete your own custom products",
        "FORBIDDEN",
      );
    }

    // Cannot delete global products via this method
    if (product.isGlobal) {
      throw new AppError(
        403,
        "Cannot delete global products",
        "FORBIDDEN",
      );
    }

    await this.productRepository.delete(productId);
  }

  // Admin methods
  async getGlobalProducts(
    query?: GetProductsQuery,
  ): Promise<PaginatedResponse<ProductWithSubstance>> {
    return this.productRepository.findGlobalProducts({
      page: query?.page,
      limit: query?.limit,
      substanceId: query?.substanceId,
      search: query?.search,
    });
  }

  async createGlobalProduct(data: CreateProductInput): Promise<Product> {
    // Verify substance exists
    const substance = await this.substanceRepository.findById(data.substanceId);
    if (!substance) {
      throw new AppError(404, "Substance not found", "SUBSTANCE_NOT_FOUND");
    }

    return this.productRepository.create({
      ...data,
      isGlobal: true,
      patientId: undefined, // Global products have no patient
    });
  }

  async updateGlobalProduct(
    productId: string,
    data: UpdateProductInput,
  ): Promise<Product> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new AppError(404, "Product not found", "PRODUCT_NOT_FOUND");
    }

    if (!product.isGlobal) {
      throw new AppError(
        400,
        "This product is not a global product",
        "NOT_GLOBAL_PRODUCT",
      );
    }

    return this.productRepository.update(productId, data);
  }

  async deleteGlobalProduct(productId: string): Promise<void> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new AppError(404, "Product not found", "PRODUCT_NOT_FOUND");
    }

    if (!product.isGlobal) {
      throw new AppError(
        400,
        "This product is not a global product",
        "NOT_GLOBAL_PRODUCT",
      );
    }

    await this.productRepository.delete(productId);
  }
}
