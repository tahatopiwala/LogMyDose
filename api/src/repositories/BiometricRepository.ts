import { PrismaClient, BiometricEntry, Prisma } from "@biostak/shared/prisma";
import {
  IBiometricRepository,
  CreateBiometricInput,
  BiometricEntryWithDose,
  FindBiometricsOptions,
  BiometricStats,
  FindManyOptions,
} from "../interfaces/repositories/index.js";
import { PaginatedResponse } from "../types/index.js";

const doseInclude = {
  dose: {
    select: {
      id: true,
      dose: true,
      loggedAt: true,
      substance: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
};

export class BiometricRepository implements IBiometricRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<BiometricEntry | null> {
    return this.prisma.biometricEntry.findUnique({ where: { id } });
  }

  async findMany(options?: FindManyOptions): Promise<PaginatedResponse<BiometricEntry>> {
    const page = options?.page || 1;
    const limit = options?.limit || 20;

    const [data, total] = await Promise.all([
      this.prisma.biometricEntry.findMany({
        orderBy: options?.orderBy || { recordedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.biometricEntry.count(),
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
    options: FindBiometricsOptions,
  ): Promise<PaginatedResponse<BiometricEntryWithDose>> {
    const page = options.page || 1;
    const limit = options.limit || 20;

    const where: Prisma.BiometricEntryWhereInput = {
      patientId: options.patientId,
    };

    if (options.metricType) where.metricType = options.metricType;
    if (options.doseId) where.doseId = options.doseId;

    if (options.startDate || options.endDate) {
      where.recordedAt = {};
      if (options.startDate) where.recordedAt.gte = options.startDate;
      if (options.endDate) where.recordedAt.lte = options.endDate;
    }

    const [data, total] = await Promise.all([
      this.prisma.biometricEntry.findMany({
        where,
        include: doseInclude,
        orderBy: { recordedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.biometricEntry.count({ where }),
    ]);

    return {
      data: data as BiometricEntryWithDose[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByMetricType(
    patientId: string,
    metricType: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<BiometricEntry[]> {
    const where: Prisma.BiometricEntryWhereInput = {
      patientId,
      metricType,
    };

    if (startDate || endDate) {
      where.recordedAt = {};
      if (startDate) where.recordedAt.gte = startDate;
      if (endDate) where.recordedAt.lte = endDate;
    }

    return this.prisma.biometricEntry.findMany({
      where,
      orderBy: { recordedAt: "asc" },
    });
  }

  async findLatestByMetricType(
    patientId: string,
    metricType: string,
  ): Promise<BiometricEntry | null> {
    return this.prisma.biometricEntry.findFirst({
      where: { patientId, metricType },
      orderBy: { recordedAt: "desc" },
    });
  }

  async findByDose(doseId: string): Promise<BiometricEntry[]> {
    return this.prisma.biometricEntry.findMany({
      where: { doseId },
      orderBy: { recordedAt: "desc" },
    });
  }

  async create(data: CreateBiometricInput): Promise<BiometricEntry> {
    return this.prisma.biometricEntry.create({
      data: {
        patientId: data.patientId,
        metricType: data.metricType,
        value: data.value,
        unit: data.unit,
        doseId: data.doseId,
        notes: data.notes,
        recordedAt: data.recordedAt || new Date(),
      },
    });
  }

  async createMany(data: CreateBiometricInput[]): Promise<number> {
    const result = await this.prisma.biometricEntry.createMany({
      data: data.map((entry) => ({
        patientId: entry.patientId,
        metricType: entry.metricType,
        value: entry.value,
        unit: entry.unit,
        doseId: entry.doseId,
        notes: entry.notes,
        recordedAt: entry.recordedAt || new Date(),
      })),
    });

    return result.count;
  }

  async update(
    id: string,
    data: Partial<CreateBiometricInput>,
  ): Promise<BiometricEntry> {
    return this.prisma.biometricEntry.update({
      where: { id },
      data: {
        metricType: data.metricType,
        value: data.value,
        unit: data.unit,
        notes: data.notes,
        recordedAt: data.recordedAt,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.biometricEntry.delete({ where: { id } });
  }

  async count(where?: Record<string, unknown>): Promise<number> {
    return this.prisma.biometricEntry.count({
      where: where as Prisma.BiometricEntryWhereInput,
    });
  }

  async getStats(
    patientId: string,
    metricType: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<BiometricStats | null> {
    const where: Prisma.BiometricEntryWhereInput = {
      patientId,
      metricType,
    };

    if (startDate || endDate) {
      where.recordedAt = {};
      if (startDate) where.recordedAt.gte = startDate;
      if (endDate) where.recordedAt.lte = endDate;
    }

    const aggregation = await this.prisma.biometricEntry.aggregate({
      where,
      _count: true,
      _min: { value: true },
      _max: { value: true },
      _avg: { value: true },
    });

    if (aggregation._count === 0) {
      return null;
    }

    const latest = await this.findLatestByMetricType(patientId, metricType);

    return {
      metricType,
      count: aggregation._count,
      min: aggregation._min.value?.toNumber() || 0,
      max: aggregation._max.value?.toNumber() || 0,
      avg: aggregation._avg.value?.toNumber() || 0,
      latest: latest?.value ? Number(latest.value) : 0,
      latestRecordedAt: latest?.recordedAt || new Date(),
    };
  }

  async getStatsByPatient(
    patientId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<BiometricStats[]> {
    // Get distinct metric types for this patient
    const metricTypes = await this.prisma.biometricEntry.findMany({
      where: { patientId },
      select: { metricType: true },
      distinct: ["metricType"],
    });

    const stats = await Promise.all(
      metricTypes.map((m) =>
        this.getStats(patientId, m.metricType, startDate, endDate),
      ),
    );

    return stats.filter((s): s is BiometricStats => s !== null);
  }
}
