import { PrismaClient, Protocol, ProtocolSubstance } from '@peptiderx/shared/prisma';
import {
  IProtocolRepository,
  CreateProtocolInput,
  UpdateProtocolInput,
  ProtocolWithDetails,
  FindTemplatesOptions,
  TemplateWithRelations,
  FindManyOptions,
} from '../interfaces/repositories/index.js';
import { PaginatedResponse } from '../types/index.js';

export class ProtocolRepository implements IProtocolRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Protocol | null> {
    return this.prisma.protocol.findUnique({ where: { id } });
  }

  async findByIdWithDetails(id: string): Promise<ProtocolWithDetails | null> {
    return this.prisma.protocol.findUnique({
      where: { id },
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        template: {
          select: { id: true, name: true },
        },
        provider: {
          select: { id: true, firstName: true, lastName: true, credentials: true },
        },
        substances: {
          include: {
            substance: {
              select: { id: true, name: true, doseUnit: true, administrationRoute: true },
            },
          },
        },
      },
    });
  }

  async findByPatientId(patientId: string): Promise<ProtocolWithDetails[]> {
    return this.prisma.protocol.findMany({
      where: { patientId },
      include: {
        template: {
          select: { id: true, name: true },
        },
        substances: {
          include: {
            substance: {
              select: { id: true, name: true, doseUnit: true, administrationRoute: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findMany(options?: FindManyOptions): Promise<PaginatedResponse<Protocol>> {
    const page = options?.page || 1;
    const limit = options?.limit || 20;

    const [data, total] = await Promise.all([
      this.prisma.protocol.findMany({
        orderBy: options?.orderBy || { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.protocol.count(),
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

  async create(data: CreateProtocolInput): Promise<Protocol> {
    return this.prisma.protocol.create({
      data: {
        patientId: data.patientId,
        source: data.source,
        templateId: data.templateId,
        clinicId: data.clinicId,
        providerId: data.providerId,
        startDate: data.startDate,
        endDate: data.endDate,
        notes: data.notes,
        status: data.status || 'active',
        substances: {
          create: data.substances.map((s) => ({
            substanceId: s.substanceId,
            dose: s.dose,
            doseUnit: s.doseUnit,
            frequency: s.frequency,
            schedule: s.schedule,
            titrationPlan: s.titrationPlan,
            cycleOnWeeks: s.cycleOnWeeks,
            cycleOffWeeks: s.cycleOffWeeks,
            notes: s.notes,
          })),
        },
      },
      include: {
        template: {
          select: { id: true, name: true },
        },
        substances: {
          include: {
            substance: {
              select: { id: true, name: true, doseUnit: true, administrationRoute: true },
            },
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateProtocolInput): Promise<Protocol> {
    return this.prisma.protocol.update({
      where: { id },
      data,
      include: {
        substances: {
          include: {
            substance: {
              select: { id: true, name: true, doseUnit: true },
            },
          },
        },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.protocol.delete({ where: { id } });
  }

  async count(where?: Record<string, unknown>): Promise<number> {
    return this.prisma.protocol.count({ where: where as never });
  }

  async findProtocolSubstanceById(
    id: string
  ): Promise<(ProtocolSubstance & { protocol: Protocol }) | null> {
    return this.prisma.protocolSubstance.findUnique({
      where: { id },
      include: { protocol: true },
    });
  }

  // Template methods
  async findTemplates(
    options?: FindTemplatesOptions
  ): Promise<PaginatedResponse<TemplateWithRelations>> {
    const page = options?.page || 1;
    const limit = options?.limit || 20;

    const where: Record<string, unknown> = {
      isPublic: options?.isPublic ?? true,
    };

    if (options?.categoryId) where.categoryId = options.categoryId;
    if (options?.substanceId) where.substanceId = options.substanceId;
    if (options?.difficulty) where.difficultyLevel = options.difficulty;

    if (options?.search) {
      where.OR = [
        { name: { contains: options.search, mode: 'insensitive' } },
        { description: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.protocolTemplate.findMany({
        where: where as never,
        include: {
          category: {
            select: { id: true, name: true, displayName: true },
          },
          substance: {
            select: { id: true, name: true, doseUnit: true },
          },
        },
        orderBy: [{ useCount: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.protocolTemplate.count({ where: where as never }),
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

  async findTemplateById(id: string): Promise<TemplateWithRelations | null> {
    return this.prisma.protocolTemplate.findUnique({
      where: { id },
      include: {
        category: true,
        substance: true,
      },
    });
  }

  async incrementTemplateUseCount(id: string): Promise<void> {
    await this.prisma.protocolTemplate.update({
      where: { id },
      data: { useCount: { increment: 1 } },
    });
  }
}
