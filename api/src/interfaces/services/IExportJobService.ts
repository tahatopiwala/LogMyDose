import { ExportJob } from "@logmydose/shared/prisma";

export interface CreateExportJobInput {
  patientId: string;
  startDate: Date;
  endDate: Date;
}

export interface IExportJobService {
  /**
   * Create a new export job and queue it for processing
   * @param patientId - Patient ID
   * @param startDate - Export start date
   * @param endDate - Export end date
   * @returns Created export job
   */
  createExportJob(
    patientId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<ExportJob>;

  /**
   * Get export job status with authorization check
   * @param jobId - Export job ID
   * @param patientId - Patient ID for authorization
   * @returns Export job with signed download URL if completed
   */
  getJobStatus(jobId: string, patientId: string): Promise<ExportJob & { downloadUrl?: string }>;

  /**
   * Get all export jobs for a patient
   * @param patientId - Patient ID
   * @param status - Optional status filter
   * @returns Array of export jobs
   */
  getActiveJobs(patientId: string, status?: string): Promise<ExportJob[]>;

  /**
   * Clean up expired export jobs
   * Deletes job records and S3 files for expired exports
   * @returns Number of jobs cleaned up
   */
  cleanupExpiredJobs(): Promise<number>;
}
