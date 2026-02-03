import { PrismaClient, Product } from "@biostak/shared/prisma";
import {
  IProductRepository,
  CreateProductInput,
  UpdateProductInput,
  ProductWithSubstance,
  FindProductsOptions,
  FindManyOptions,
} from "../interfaces/repositories/index.js";
import { PaginatedResponse } from "../types/index.js";

export class ProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async findByIdWithSubstance(id: string): Promise<ProductWithSubstance | null> {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        substance: {
          select: {
            id: true,
            name: true,
            categoryId: true,
            doseUnit: true,
          },
        },
      },
    });
  }

  async findMany(
    options?: FindManyOptions,
  ): Promise<PaginatedResponse<Product>> {
    const page = options?.page || 1;
    const limit = options?.limit || 20;

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where: { isActive: true },
        orderBy: options?.orderBy || { name: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where: { isActive: true } }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findVisibleToPatient(
    patientId: string,
    options?: FindProductsOptions,
  ): Promise<PaginatedResponse<ProductWithSubstance>> {
    const page = options?.page || 1;
    const limit = options?.limit || 20;

    // Products visible to patient: global products OR their own custom products
    const where: Record<string, unknown> = {
      isActive: options?.isActive ?? true,
      OR: [{ isGlobal: true }, { patientId }],
    };

    if (options?.substanceId) {
      where.substanceId = options.substanceId;
    }

    if (options?.search) {
      where.name = { contains: options.search, mode: "insensitive" };
    }

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where: where as never,
        include: {
          substance: {
            select: {
              id: true,
              name: true,
              categoryId: true,
              doseUnit: true,
            },
          },
        },
        orderBy: [{ isGlobal: "desc" }, { name: "asc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where: where as never }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySubstanceForPatient(
    substanceId: string,
    patientId: string,
  ): Promise<ProductWithSubstance[]> {
    return this.prisma.product.findMany({
      where: {
        substanceId,
        isActive: true,
        OR: [{ isGlobal: true }, { patientId }],
      },
      include: {
        substance: {
          select: {
            id: true,
            name: true,
            categoryId: true,
            doseUnit: true,
          },
        },
      },
      orderBy: [{ isGlobal: "desc" }, { name: "asc" }],
    });
  }

  async findGlobalProducts(
    options?: FindProductsOptions,
  ): Promise<PaginatedResponse<ProductWithSubstance>> {
    const page = options?.page || 1;
    const limit = options?.limit || 20;

    const where: Record<string, unknown> = {
      isGlobal: true,
      isActive: options?.isActive ?? true,
    };

    if (options?.substanceId) {
      where.substanceId = options.substanceId;
    }

    if (options?.search) {
      where.name = { contains: options.search, mode: "insensitive" };
    }

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where: where as never,
        include: {
          substance: {
            select: {
              id: true,
              name: true,
              categoryId: true,
              doseUnit: true,
            },
          },
        },
        orderBy: { name: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where: where as never }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(data: CreateProductInput): Promise<Product> {
    return this.prisma.product.create({
      data: {
        substanceId: data.substanceId,
        name: data.name,
        defaultDose: data.defaultDose,
        doseUnit: data.doseUnit,
        isGlobal: data.isGlobal ?? false,
        patientId: data.patientId,
      },
    });
  }

  async update(id: string, data: UpdateProductInput): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        defaultDose: data.defaultDose,
        doseUnit: data.doseUnit,
        isActive: data.isActive,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({ where: { id } });
  }

  async count(where?: Record<string, unknown>): Promise<number> {
    return this.prisma.product.count({ where: where as never });
  }
}
