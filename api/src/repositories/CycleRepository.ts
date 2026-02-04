import { PrismaClient, Cycle, Prisma } from "@biostak/shared/prisma";
import {
  ICycleRepository,
  CreateCycleInput,
  UpdateCycleInput,
  CycleWithSubstance,
  FindCyclesOptions,
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

export class CycleRepository implements ICycleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Cycle | null> {
    return this.prisma.cycle.findUnique({ where: { id } });
  }

  async findMany(options?: { page?: number; limit?: number }): Promise<PaginatedResponse<Cycle>> {
    const page = options?.page || 1;
    const limit = options?.limit || 20;

    const [data, total] = await Promise.all([
      this.prisma.cycle.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.cycle.count(),
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

  async findByPatient(options: FindCyclesOptions): Promise<CycleWithSubstance[]> {
    const where: Prisma.CycleWhereInput = {
      patientId: options.patientId,
    };

    if (options.protocolSubstanceId) {
      where.protocolSubstanceId = options.protocolSubstanceId;
    }

    if (options.status) {
      where.status = options.status;
    }

    const cycles = await this.prisma.cycle.findMany({
      where,
      include: substanceInclude,
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      skip: options.page ? (options.page - 1) * (options.limit || 20) : undefined,
      take: options.limit || 20,
    });

    return cycles as CycleWithSubstance[];
  }

  async findByProtocolSubstance(protocolSubstanceId: string): Promise<CycleWithSubstance[]> {
    const cycles = await this.prisma.cycle.findMany({
      where: { protocolSubstanceId },
      include: substanceInclude,
      orderBy: { cycleNumber: "desc" },
    });

    return cycles as CycleWithSubstance[];
  }

  async findActiveCycle(protocolSubstanceId: string): Promise<CycleWithSubstance | null> {
    const cycle = await this.prisma.cycle.findFirst({
      where: {
        protocolSubstanceId,
        status: { in: ["on", "off"] },
      },
      include: substanceInclude,
      orderBy: { createdAt: "desc" },
    });

    return cycle as CycleWithSubstance | null;
  }

  async findLatestCycle(protocolSubstanceId: string): Promise<Cycle | null> {
    return this.prisma.cycle.findFirst({
      where: { protocolSubstanceId },
      orderBy: { cycleNumber: "desc" },
    });
  }

  async create(data: CreateCycleInput): Promise<Cycle> {
    return this.prisma.cycle.create({
      data: {
        patientId: data.patientId,
        protocolSubstanceId: data.protocolSubstanceId,
        cycleNumber: data.cycleNumber,
        startDate: data.startDate,
        onWeeks: data.onWeeks,
        offWeeks: data.offWeeks,
        notes: data.notes,
        status: "on",
        currentWeek: 1,
      },
    });
  }

  async update(id: string, data: UpdateCycleInput): Promise<Cycle> {
    return this.prisma.cycle.update({
      where: { id },
      data: {
        endDate: data.endDate,
        onWeeks: data.onWeeks,
        offWeeks: data.offWeeks,
        status: data.status,
        currentWeek: data.currentWeek,
        notes: data.notes,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.cycle.delete({ where: { id } });
  }

  async count(where?: Record<string, unknown>): Promise<number> {
    return this.prisma.cycle.count({
      where: where as Prisma.CycleWhereInput,
    });
  }

  async countByProtocolSubstance(protocolSubstanceId: string): Promise<number> {
    return this.prisma.cycle.count({
      where: { protocolSubstanceId },
    });
  }
}
