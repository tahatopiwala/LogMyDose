import { PrismaClient, ExportJob } from "@logmydose/shared/prisma";
import {
  IExportJobRepository,
  CreateExportJobInput,
  UpdateExportJobStatusInput,
  FindManyOptions,
} from "../interfaces/repositories/index.js";
import { PaginatedResponse } from "../types/index.js";

export class ExportJobRepository implements IExportJobRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<ExportJob | null> {
    return this.prisma.exportJob.findUnique({ where: { id } });
  }

  async findMany(
    options?: FindManyOptions,
  ): Promise<PaginatedResponse<ExportJob>> {
    const page = options?.page || 1;
    const limit = options?.limit || 20;

    const [data, total] = await Promise.all([
      this.prisma.exportJob.findMany({
        orderBy: options?.orderBy || { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.exportJob.count(),
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

  async create(data: CreateExportJobInput): Promise<ExportJob> {
    return this.prisma.exportJob.create({
      data: {
        patientId: data.patientId,
        startDate: data.startDate,
        endDate: data.endDate,
        expiresAt: data.expiresAt,
        status: "pending",
      },
    });
  }

  async update(id: string, data: Partial<ExportJob>): Promise<ExportJob> {
    return this.prisma.exportJob.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.exportJob.delete({ where: { id } });
  }

  async count(where?: Record<string, unknown>): Promise<number> {
    return this.prisma.exportJob.count({ where: where as never });
  }

  async findByPatient(
    patientId: string,
    status?: string,
  ): Promise<ExportJob[]> {
    const where: Record<string, unknown> = { patientId };
    if (status) {
      where.status = status;
    }
    return this.prisma.exportJob.findMany({
      where: where as never,
      orderBy: { createdAt: "desc" },
    });
  }

  async updateStatus(
    id: string,
    data: UpdateExportJobStatusInput,
  ): Promise<ExportJob> {
    return this.prisma.exportJob.update({
      where: { id },
      data: {
        status: data.status,
        ...(data.fileUrl && { fileUrl: data.fileUrl }),
        ...(data.fileName && { fileName: data.fileName }),
        ...(data.fileSize !== undefined && { fileSize: data.fileSize }),
        ...(data.error && { error: data.error }),
        ...(data.attempts !== undefined && { attempts: data.attempts }),
      },
    });
  }

  async findExpired(): Promise<ExportJob[]> {
    return this.prisma.exportJob.findMany({
      where: {
        expiresAt: { lt: new Date() },
        status: "completed",
      },
    });
  }
}
