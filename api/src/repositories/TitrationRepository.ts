import { PrismaClient, TitrationPhase, Prisma } from "@biostak/shared/prisma";
import {
  ITitrationRepository,
  CreateTitrationPhaseInput,
  UpdateTitrationPhaseInput,
  TitrationPhaseWithSubstance,
  FindTitrationPhasesOptions,
} from "../interfaces/repositories/index.js";
import { PaginatedResponse } from "../types/index.js";

const substanceInclude = {
  protocolSubstance: {
    select: {
      id: true,
      dose: true,
      doseUnit: true,
      frequency: true,
      substance: {
        select: {
          id: true,
          name: true,
        },
      },
      protocol: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
};

export class TitrationRepository implements ITitrationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<TitrationPhase | null> {
    return this.prisma.titrationPhase.findUnique({ where: { id } });
  }

  async findMany(options?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<TitrationPhase>> {
    const page = options?.page || 1;
    const limit = options?.limit || 20;

    const [data, total] = await Promise.all([
      this.prisma.titrationPhase.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.titrationPhase.count(),
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
    options: FindTitrationPhasesOptions
  ): Promise<TitrationPhaseWithSubstance[]> {
    const where: Prisma.TitrationPhaseWhereInput = {
      patientId: options.patientId,
    };

    if (options.protocolSubstanceId) {
      where.protocolSubstanceId = options.protocolSubstanceId;
    }

    if (options.status) {
      where.status = options.status;
    }

    const phases = await this.prisma.titrationPhase.findMany({
      where,
      include: substanceInclude,
      orderBy: [{ protocolSubstanceId: "asc" }, { phaseNumber: "asc" }],
      skip: options.page ? (options.page - 1) * (options.limit || 20) : undefined,
      take: options.limit || 100,
    });

    return phases as TitrationPhaseWithSubstance[];
  }

  async findByProtocolSubstance(
    protocolSubstanceId: string
  ): Promise<TitrationPhaseWithSubstance[]> {
    const phases = await this.prisma.titrationPhase.findMany({
      where: { protocolSubstanceId },
      include: substanceInclude,
      orderBy: { phaseNumber: "asc" },
    });

    return phases as TitrationPhaseWithSubstance[];
  }

  async findActivePhase(
    protocolSubstanceId: string
  ): Promise<TitrationPhaseWithSubstance | null> {
    const phase = await this.prisma.titrationPhase.findFirst({
      where: {
        protocolSubstanceId,
        status: "active",
      },
      include: substanceInclude,
      orderBy: { phaseNumber: "desc" },
    });

    return phase as TitrationPhaseWithSubstance | null;
  }

  async findLatestPhase(protocolSubstanceId: string): Promise<TitrationPhase | null> {
    return this.prisma.titrationPhase.findFirst({
      where: { protocolSubstanceId },
      orderBy: { phaseNumber: "desc" },
    });
  }

  async create(data: CreateTitrationPhaseInput): Promise<TitrationPhase> {
    return this.prisma.titrationPhase.create({
      data: {
        patientId: data.patientId,
        protocolSubstanceId: data.protocolSubstanceId,
        phaseNumber: data.phaseNumber,
        doseAmount: data.doseAmount,
        doseUnit: data.doseUnit,
        startDate: data.startDate,
        weeksAtDose: data.weeksAtDose,
        reason: data.reason,
        targetDose: data.targetDose,
        isMaintenancePhase: data.isMaintenancePhase || false,
        notes: data.notes,
        status: "active",
      },
    });
  }

  async update(id: string, data: UpdateTitrationPhaseInput): Promise<TitrationPhase> {
    return this.prisma.titrationPhase.update({
      where: { id },
      data: {
        endDate: data.endDate,
        weeksAtDose: data.weeksAtDose,
        reason: data.reason,
        status: data.status,
        notes: data.notes,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.titrationPhase.delete({ where: { id } });
  }

  async count(where?: Record<string, unknown>): Promise<number> {
    return this.prisma.titrationPhase.count({
      where: where as Prisma.TitrationPhaseWhereInput,
    });
  }

  async countByProtocolSubstance(protocolSubstanceId: string): Promise<number> {
    return this.prisma.titrationPhase.count({
      where: { protocolSubstanceId },
    });
  }
}
