import { PrismaClient, Dose, Alert } from '@logmydose/shared/prisma';
import {
  IDoseRepository,
  CreateDoseInput,
  UpdateDoseInput,
  CreateSideEffectInput,
  DoseWithSubstance,
  DoseWithDetails,
  SideEffectWithRelations,
  FindDosesOptions,
  FindSideEffectsOptions,
  DoseStats,
  FindManyOptions,
} from '../interfaces/repositories/index.js';
import { PaginatedResponse } from '../types/index.js';

export class DoseRepository implements IDoseRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Dose | null> {
    return this.prisma.dose.findUnique({ where: { id } });
  }

  async findDoseById(id: string): Promise<Dose | null> {
    return this.prisma.dose.findUnique({ where: { id } });
  }

  async findByIdWithDetails(id: string): Promise<DoseWithDetails | null> {
    return this.prisma.dose.findUnique({
      where: { id },
      include: {
        substance: {
          select: { id: true, name: true, doseUnit: true },
        },
        protocolSubstance: {
          include: {
            protocol: {
              select: { id: true, status: true },
            },
          },
        },
        sideEffects: true,
      },
    });
  }

  async findMany(options?: FindManyOptions): Promise<PaginatedResponse<Dose>> {
    const page = options?.page || 1;
    const limit = options?.limit || 20;

    const [data, total] = await Promise.all([
      this.prisma.dose.findMany({
        orderBy: options?.orderBy || { loggedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.dose.count(),
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

  async findManyByPatient(options: FindDosesOptions): Promise<PaginatedResponse<DoseWithSubstance>> {
    const page = options.page || 1;
    const limit = options.limit || 20;

    const where: Record<string, unknown> = { patientId: options.patientId };

    if (options.substanceId) where.substanceId = options.substanceId;
    if (options.status) where.status = options.status;

    if (options.startDate || options.endDate) {
      where.loggedAt = {};
      if (options.startDate) (where.loggedAt as Record<string, Date>).gte = options.startDate;
      if (options.endDate) (where.loggedAt as Record<string, Date>).lte = options.endDate;
    }

    const [data, total] = await Promise.all([
      this.prisma.dose.findMany({
        where: where as never,
        include: {
          substance: {
            select: { id: true, name: true, doseUnit: true },
          },
          sideEffects: {
            select: { id: true, symptom: true, severity: true },
          },
        },
        orderBy: { loggedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.dose.count({ where: where as never }),
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

  async findTodayByPatient(patientId: string): Promise<DoseWithSubstance[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.prisma.dose.findMany({
      where: {
        patientId,
        loggedAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        substance: {
          select: { id: true, name: true, doseUnit: true },
        },
        sideEffects: {
          select: { id: true, symptom: true, severity: true },
        },
      },
      orderBy: { loggedAt: 'asc' },
    });
  }

  async create(data: CreateDoseInput): Promise<Dose> {
    return this.prisma.dose.create({
      data,
      include: {
        substance: {
          select: { id: true, name: true, doseUnit: true },
        },
      },
    });
  }

  async update(id: string, data: UpdateDoseInput): Promise<Dose> {
    return this.prisma.dose.update({
      where: { id },
      data,
      include: {
        substance: {
          select: { id: true, name: true, doseUnit: true },
        },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.dose.delete({ where: { id } });
  }

  async count(where?: Record<string, unknown>): Promise<number> {
    return this.prisma.dose.count({ where: where as never });
  }

  async getStats(patientId: string, startDate: Date, endDate: Date): Promise<DoseStats> {
    const [totalDoses, takenDoses, missedDoses, sideEffectCount] = await Promise.all([
      this.prisma.dose.count({
        where: {
          patientId,
          loggedAt: { gte: startDate, lte: endDate },
        },
      }),
      this.prisma.dose.count({
        where: {
          patientId,
          status: 'taken',
          loggedAt: { gte: startDate, lte: endDate },
        },
      }),
      this.prisma.dose.count({
        where: {
          patientId,
          status: 'missed',
          loggedAt: { gte: startDate, lte: endDate },
        },
      }),
      this.prisma.sideEffect.count({
        where: {
          patientId,
          reportedAt: { gte: startDate, lte: endDate },
        },
      }),
    ]);

    const adherenceRate = totalDoses > 0 ? (takenDoses / totalDoses) * 100 : 0;

    return {
      totalDoses,
      takenDoses,
      missedDoses,
      skippedDoses: totalDoses - takenDoses - missedDoses,
      sideEffectCount,
      adherenceRate: Math.round(adherenceRate * 100) / 100,
      period: { start: startDate, end: endDate },
    };
  }

  // Side effect methods
  async createSideEffect(data: CreateSideEffectInput): Promise<SideEffectWithRelations> {
    return this.prisma.sideEffect.create({
      data,
      include: {
        substance: {
          select: { id: true, name: true },
        },
        dose: {
          select: { id: true, dose: true, loggedAt: true },
        },
      },
    });
  }

  async findSideEffects(
    options: FindSideEffectsOptions
  ): Promise<PaginatedResponse<SideEffectWithRelations>> {
    const page = options.page || 1;
    const limit = options.limit || 20;

    const where: Record<string, unknown> = { patientId: options.patientId };

    if (options.substanceId) where.substanceId = options.substanceId;
    if (options.minSeverity) where.severity = { gte: options.minSeverity };

    const [data, total] = await Promise.all([
      this.prisma.sideEffect.findMany({
        where: where as never,
        include: {
          substance: {
            select: { id: true, name: true },
          },
          dose: {
            select: { id: true, dose: true, loggedAt: true },
          },
        },
        orderBy: { reportedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.sideEffect.count({ where: where as never }),
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

  // Alert methods
  async findActiveAlerts(patientId: string): Promise<Alert[]> {
    return this.prisma.alert.findMany({
      where: {
        patientId,
        dismissedAt: null,
      },
      orderBy: { scheduledFor: 'asc' },
    });
  }
}
