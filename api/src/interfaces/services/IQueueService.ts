import type {
  EmailJobType,
  WelcomeEmailPayload,
  VerifyEmailPayload,
  PdfExportPatientReportPayload,
} from "@logmydose/shared/queues";

export interface JobOptions {
  delay?: number;
  priority?: number;
}

export interface IQueueService {
  addWelcomeEmailJob(
    payload: WelcomeEmailPayload,
    options?: JobOptions,
  ): Promise<void>;
  addVerifyEmailJob(
    payload: VerifyEmailPayload,
    options?: JobOptions,
  ): Promise<void>;
  addEmailJob(
    type: EmailJobType,
    payload: unknown,
    options?: JobOptions,
  ): Promise<void>;
  addPdfExportJob(
    payload: PdfExportPatientReportPayload,
    options?: JobOptions,
  ): Promise<void>;
  close(): Promise<void>;
}
