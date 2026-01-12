import { PrismaClient, Substance, SubstanceCategory } from '@peptiderx/shared/prisma';
import {
  ISubstanceRepository,
  CreateSubstanceInput,
  UpdateSubstanceInput,
  SubstanceWithCategory,
  FindSubstancesOptions,
  FindManyOptions,
} from '../interfaces/repositories/index.js';
import { PaginatedResponse } from '../types/index.js';

export class SubstanceRepository implements ISubstanceRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Substance | null> {
    return this.prisma.substance.findUnique({ where: { id } });
  }

  async findByIdWithCategory(id: string): Promise<SubstanceWithCategory | null> {
    return this.prisma.substance.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            displayName: true,
          },
        },
      },
    });
  }

  async findMany(options?: FindManyOptions): Promise<PaginatedResponse<Substance>> {
    const page = options?.page || 1;
    const limit = options?.limit || 20;

    const [data, total] = await Promise.all([
      this.prisma.substance.findMany({
        where: { isActive: true },
        orderBy: options?.orderBy || { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.substance.count({ where: { isActive: true } }),
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

  async findManyWithCategory(
    options?: FindSubstancesOptions
  ): Promise<PaginatedResponse<SubstanceWithCategory>> {
    const page = options?.page || 1;
    const limit = options?.limit || 20;

    const where: Record<string, unknown> = {
      isActive: options?.isActive ?? true,
    };

    if (options?.categoryId) {
      where.categoryId = options.categoryId;
    }

    if (options?.subcategory) {
      where.subcategory = options.subcategory;
    }

    if (options?.search) {
      where.OR = [
        { name: { contains: options.search, mode: 'insensitive' } },
        { aliases: { has: options.search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.substance.findMany({
        where: where as never,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              displayName: true,
            },
          },
        },
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.substance.count({ where: where as never }),
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

  async findByIds(ids: string[]): Promise<Substance[]> {
    return this.prisma.substance.findMany({
      where: { id: { in: ids } },
    });
  }

  async findCategories(): Promise<SubstanceCategory[]> {
    return this.prisma.substanceCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findCategoryById(id: string): Promise<SubstanceCategory | null> {
    return this.prisma.substanceCategory.findUnique({ where: { id } });
  }

  async create(data: CreateSubstanceInput): Promise<Substance> {
    return this.prisma.substance.create({
      data: {
        ...data,
        aliases: data.aliases || [],
        requiresCycling: data.requiresCycling || false,
        contraindications: data.contraindications || [],
        commonSideEffects: data.commonSideEffects || [],
        interactions: data.interactions || [],
        isPrescriptionRequired: data.isPrescriptionRequired || false,
      },
    });
  }

  async update(id: string, data: UpdateSubstanceInput): Promise<Substance> {
    return this.prisma.substance.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.substance.delete({ where: { id } });
  }

  async count(where?: Record<string, unknown>): Promise<number> {
    return this.prisma.substance.count({ where: where as never });
  }
}
