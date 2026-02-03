import { ExportJob } from "@biostak/shared/prisma";
import { IBaseRepository } from "./IBaseRepository.js";

export interface CreateExportJobInput {
  patientId: string;
  startDate: Date;
  endDate: Date;
  expiresAt: Date;
}

export interface UpdateExportJobStatusInput {
  status: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  error?: string;
  attempts?: number;
}

export interface IExportJobRepository
  extends IBaseRepository<
    ExportJob,
    CreateExportJobInput,
    Partial<ExportJob>
  > {
  findByPatient(
    patientId: string,
    status?: string,
  ): Promise<ExportJob[]>;
  updateStatus(
    id: string,
    data: UpdateExportJobStatusInput,
  ): Promise<ExportJob>;
  findExpired(): Promise<ExportJob[]>;
}
