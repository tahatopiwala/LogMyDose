import { ExportJob } from "@biostak/shared/prisma";
import { IExportJobService } from "../interfaces/services/index.js";
import { IExportJobRepository } from "../interfaces/repositories/index.js";
import { IStorageService } from "../interfaces/services/IStorageService.js";
import { IQueueService } from "../interfaces/services/IQueueService.js";

const EXPORT_EXPIRY_DAYS = 7;
const DOWNLOAD_URL_EXPIRY_SECONDS = 3600; // 1 hour

export class ExportJobService implements IExportJobService {
  constructor(
    private readonly exportJobRepository: IExportJobRepository,
    private readonly storageService: IStorageService,
    private readonly queueService: IQueueService,
  ) {}

  async createExportJob(
    patientId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<ExportJob> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + EXPORT_EXPIRY_DAYS);

    const job = await this.exportJobRepository.create({
      patientId,
      startDate,
      endDate,
      expiresAt,
    });

    await this.queueService.addPdfExportJob({
      exportJobId: job.id,
      patientId,
      startDate: this.formatDate(startDate),
      endDate: this.formatDate(endDate),
    });

    return job;
  }

  async getJobStatus(
    jobId: string,
    patientId: string,
  ): Promise<ExportJob & { downloadUrl?: string }> {
    const job = await this.exportJobRepository.findById(jobId);

    if (!job) {
      throw new Error("Export job not found");
    }

    if (job.patientId !== patientId) {
      throw new Error("Unauthorized access to export job");
    }

    if (job.status === "completed" && job.fileUrl) {
      const downloadUrl = await this.storageService.getSignedUrl(
        job.fileUrl,
        DOWNLOAD_URL_EXPIRY_SECONDS,
      );
      return { ...job, downloadUrl };
    }

    return job;
  }

  async getActiveJobs(patientId: string, status?: string): Promise<ExportJob[]> {
    return this.exportJobRepository.findByPatient(patientId, status);
  }

  async cleanupExpiredJobs(): Promise<number> {
    const expiredJobs = await this.exportJobRepository.findExpired();

    let deletedCount = 0;
    for (const job of expiredJobs) {
      try {
        if (job.fileUrl) {
          await this.storageService.deleteFile(job.fileUrl);
        }
        await this.exportJobRepository.delete(job.id);
        deletedCount++;
      } catch (error) {
        console.error(`Failed to cleanup export job ${job.id}:`, error);
      }
    }

    return deletedCount;
  }

  private formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
  }
}
