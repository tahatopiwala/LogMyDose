import { PrismaClient, Vial, Prisma } from "@biostak/shared/prisma";
import {
  IVialRepository,
  CreateVialInput,
  UpdateVialInput,
  ReconstitutionInput,
  VialWithProduct,
  FindVialsOptions,
  FindManyOptions,
} from "../interfaces/repositories/index.js";
import { PaginatedResponse } from "../types/index.js";

const productInclude = {
  product: {
    select: {
      id: true,
      name: true,
      substanceId: true,
      doseUnit: true,
      substance: {
        select: {
          id: true,
          name: true,
          doseUnit: true,
          shelfLifeReconstitutedDays: true,
        },
      },
    },
  },
  _count: {
    select: { doses: true },
  },
};

export class VialRepository implements IVialRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Vial | null> {
    return this.prisma.vial.findUnique({ where: { id } });
  }

  async findByIdWithProduct(id: string): Promise<VialWithProduct | null> {
    return this.prisma.vial.findUnique({
      where: { id },
      include: productInclude,
    }) as Promise<VialWithProduct | null>;
  }

  async findMany(options?: FindManyOptions): Promise<PaginatedResponse<Vial>> {
    const page = options?.page || 1;
    const limit = options?.limit || 20;

    const [data, total] = await Promise.all([
      this.prisma.vial.findMany({
        orderBy: options?.orderBy || { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.vial.count(),
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

  async findByPatient(
    options: FindVialsOptions,
  ): Promise<PaginatedResponse<VialWithProduct>> {
    const page = options.page || 1;
    const limit = options.limit || 20;

    const where: Prisma.VialWhereInput = { patientId: options.patientId };

    if (options.productId) where.productId = options.productId;
    if (options.status) where.status = options.status;
    if (options.substanceId) {
      where.product = { substanceId: options.substanceId };
    }

    const [data, total] = await Promise.all([
      this.prisma.vial.findMany({
        where,
        include: productInclude,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.vial.count({ where }),
    ]);

    return {
      data: data as VialWithProduct[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findActiveByPatient(patientId: string): Promise<VialWithProduct[]> {
    return this.prisma.vial.findMany({
      where: {
        patientId,
        status: "active",
      },
      include: productInclude,
      orderBy: { createdAt: "desc" },
    }) as Promise<VialWithProduct[]>;
  }

  async findActiveByProduct(
    patientId: string,
    productId: string,
  ): Promise<VialWithProduct[]> {
    return this.prisma.vial.findMany({
      where: {
        patientId,
        productId,
        status: "active",
      },
      include: productInclude,
      orderBy: { createdAt: "desc" },
    }) as Promise<VialWithProduct[]>;
  }

  async create(data: CreateVialInput): Promise<Vial> {
    return this.prisma.vial.create({
      data: {
        patientId: data.patientId,
        productId: data.productId,
        vialAmountMcg: data.vialAmountMcg,
        remainingAmountMcg: data.vialAmountMcg, // Initially same as vial amount
        lotNumber: data.lotNumber,
        manufacturerExpDate: data.manufacturerExpDate,
        storageLocation: data.storageLocation,
        requiresRefrigeration: data.requiresRefrigeration ?? true,
        notes: data.notes,
        status: "active",
      },
    });
  }

  async update(id: string, data: UpdateVialInput): Promise<Vial> {
    const updateData: Prisma.VialUpdateInput = {};

    if (data.lotNumber !== undefined) updateData.lotNumber = data.lotNumber;
    if (data.manufacturerExpDate !== undefined)
      updateData.manufacturerExpDate = data.manufacturerExpDate;
    if (data.storageLocation !== undefined)
      updateData.storageLocation = data.storageLocation;
    if (data.requiresRefrigeration !== undefined)
      updateData.requiresRefrigeration = data.requiresRefrigeration;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.status !== undefined) {
      updateData.status = data.status;
      if (data.status === "depleted") {
        updateData.depletedAt = new Date();
      }
    }

    return this.prisma.vial.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.vial.delete({ where: { id } });
  }

  async count(where?: Record<string, unknown>): Promise<number> {
    return this.prisma.vial.count({ where: where as Prisma.VialWhereInput });
  }

  async reconstitute(
    id: string,
    input: ReconstitutionInput,
    calculatedExpDate: Date,
    concentrationMcgMl: Prisma.Decimal,
  ): Promise<Vial> {
    return this.prisma.vial.update({
      where: { id },
      data: {
        reconstitutedAt: new Date(),
        diluentType: input.diluentType,
        diluentVolumeMl: input.diluentVolumeMl,
        calculatedExpDate,
        concentrationMcgMl,
      },
    });
  }

  async decrementRemaining(id: string, amountMcg: Prisma.Decimal): Promise<Vial> {
    return this.prisma.vial.update({
      where: { id },
      data: {
        remainingAmountMcg: {
          decrement: amountMcg,
        },
      },
    });
  }

  async markDepleted(id: string): Promise<Vial> {
    return this.prisma.vial.update({
      where: { id },
      data: {
        status: "depleted",
        depletedAt: new Date(),
        remainingAmountMcg: 0,
      },
    });
  }
}
