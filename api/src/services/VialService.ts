import { Vial, Prisma } from "@biostak/shared/prisma";
import {
  IVialService,
  CreateVialInput,
  UpdateVialInput,
  ReconstitutionInput,
  GetVialsQuery,
} from "../interfaces/services/IVialService.js";
import {
  IVialRepository,
  VialWithProduct,
} from "../interfaces/repositories/IVialRepository.js";
import { IProductRepository } from "../interfaces/repositories/IProductRepository.js";
import { PaginatedResponse } from "../types/index.js";
import { AppError } from "../middleware/errorHandler.js";

export class VialService implements IVialService {
  constructor(
    private readonly vialRepository: IVialRepository,
    private readonly productRepository: IProductRepository,
  ) {}

  async createVial(
    patientId: string,
    input: CreateVialInput,
  ): Promise<VialWithProduct> {
    // Verify product exists
    const product = await this.productRepository.findByIdWithSubstance(
      input.productId,
    );

    if (!product) {
      throw new AppError(404, "Product not found", "PRODUCT_NOT_FOUND");
    }

    // Create the vial
    const vial = await this.vialRepository.create({
      patientId,
      productId: input.productId,
      vialAmountMcg: input.vialAmountMcg,
      lotNumber: input.lotNumber,
      manufacturerExpDate: input.manufacturerExpDate
        ? new Date(input.manufacturerExpDate)
        : undefined,
      storageLocation: input.storageLocation,
      requiresRefrigeration: input.requiresRefrigeration,
      notes: input.notes,
    });

    // Return with product details
    const result = await this.vialRepository.findByIdWithProduct(vial.id);
    if (!result) {
      throw new AppError(500, "Failed to retrieve created vial", "INTERNAL_ERROR");
    }

    return result;
  }

  async getVials(
    patientId: string,
    query: GetVialsQuery,
  ): Promise<PaginatedResponse<VialWithProduct>> {
    return this.vialRepository.findByPatient({
      patientId,
      page: query.page,
      limit: Math.min(query.limit || 20, 100),
      productId: query.productId,
      status: query.status,
      substanceId: query.substanceId,
    });
  }

  async getVialById(id: string, patientId: string): Promise<VialWithProduct> {
    const vial = await this.vialRepository.findByIdWithProduct(id);

    if (!vial) {
      throw new AppError(404, "Vial not found", "NOT_FOUND");
    }

    if (vial.patientId !== patientId) {
      throw new AppError(403, "Access denied", "FORBIDDEN");
    }

    return vial;
  }

  async getActiveVials(patientId: string): Promise<VialWithProduct[]> {
    return this.vialRepository.findActiveByPatient(patientId);
  }

  async getActiveVialsByProduct(
    patientId: string,
    productId: string,
  ): Promise<VialWithProduct[]> {
    return this.vialRepository.findActiveByProduct(patientId, productId);
  }

  async updateVial(
    id: string,
    patientId: string,
    input: UpdateVialInput,
  ): Promise<Vial> {
    const existingVial = await this.vialRepository.findById(id);

    if (!existingVial) {
      throw new AppError(404, "Vial not found", "NOT_FOUND");
    }

    if (existingVial.patientId !== patientId) {
      throw new AppError(403, "Access denied", "FORBIDDEN");
    }

    return this.vialRepository.update(id, {
      lotNumber: input.lotNumber,
      manufacturerExpDate: input.manufacturerExpDate
        ? new Date(input.manufacturerExpDate)
        : undefined,
      storageLocation: input.storageLocation,
      requiresRefrigeration: input.requiresRefrigeration,
      notes: input.notes,
      status: input.status,
    });
  }

  async reconstitute(
    id: string,
    patientId: string,
    input: ReconstitutionInput,
  ): Promise<VialWithProduct> {
    const vial = await this.vialRepository.findByIdWithProduct(id);

    if (!vial) {
      throw new AppError(404, "Vial not found", "NOT_FOUND");
    }

    if (vial.patientId !== patientId) {
      throw new AppError(403, "Access denied", "FORBIDDEN");
    }

    if (vial.reconstitutedAt) {
      throw new AppError(
        400,
        "Vial has already been reconstituted",
        "ALREADY_RECONSTITUTED",
      );
    }

    if (!vial.vialAmountMcg) {
      throw new AppError(
        400,
        "Vial amount must be set before reconstitution",
        "VIAL_AMOUNT_REQUIRED",
      );
    }

    // Calculate concentration (mcg per ml)
    const vialAmountMcg = new Prisma.Decimal(vial.vialAmountMcg.toString());
    const diluentVolumeMl = new Prisma.Decimal(input.diluentVolumeMl);
    const concentrationMcgMl = vialAmountMcg.div(diluentVolumeMl);

    // Calculate expiration date based on substance's shelf life when reconstituted
    const shelfLifeDays = vial.product.substance.shelfLifeReconstitutedDays || 28;
    const calculatedExpDate = new Date();
    calculatedExpDate.setDate(calculatedExpDate.getDate() + shelfLifeDays);

    await this.vialRepository.reconstitute(
      id,
      input,
      calculatedExpDate,
      concentrationMcgMl,
    );

    // Return updated vial with product
    const result = await this.vialRepository.findByIdWithProduct(id);
    if (!result) {
      throw new AppError(500, "Failed to retrieve updated vial", "INTERNAL_ERROR");
    }

    return result;
  }

  async markDepleted(id: string, patientId: string): Promise<Vial> {
    const existingVial = await this.vialRepository.findById(id);

    if (!existingVial) {
      throw new AppError(404, "Vial not found", "NOT_FOUND");
    }

    if (existingVial.patientId !== patientId) {
      throw new AppError(403, "Access denied", "FORBIDDEN");
    }

    return this.vialRepository.markDepleted(id);
  }

  async decrementForDose(
    id: string,
    patientId: string,
    doseMcg: number,
  ): Promise<Vial> {
    const vial = await this.vialRepository.findById(id);

    if (!vial) {
      throw new AppError(404, "Vial not found", "NOT_FOUND");
    }

    if (vial.patientId !== patientId) {
      throw new AppError(403, "Access denied", "FORBIDDEN");
    }

    if (vial.status !== "active") {
      throw new AppError(400, "Vial is not active", "VIAL_NOT_ACTIVE");
    }

    const amountMcg = new Prisma.Decimal(doseMcg);
    const updatedVial = await this.vialRepository.decrementRemaining(id, amountMcg);

    // Check if vial should be marked as depleted
    if (
      updatedVial.remainingAmountMcg &&
      new Prisma.Decimal(updatedVial.remainingAmountMcg.toString()).lte(0)
    ) {
      return this.vialRepository.markDepleted(id);
    }

    return updatedVial;
  }
}
