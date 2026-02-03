import { Queue, type ConnectionOptions } from "bullmq";
import {
  QUEUE_NAMES,
  EMAIL_JOB_TYPES,
  PDF_EXPORT_JOB_TYPES,
  type EmailJobType,
  type WelcomeEmailPayload,
  type VerifyEmailPayload,
  type PdfExportPatientReportPayload,
} from "@biostak/shared/queues";
import type {
  IQueueService,
  JobOptions,
} from "../interfaces/services/IQueueService.js";

export class QueueService implements IQueueService {
  private emailQueue: Queue;
  private pdfExportQueue: Queue;

  constructor(connection: ConnectionOptions) {
    this.emailQueue = new Queue(QUEUE_NAMES.EMAIL, {
      connection,
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 1000,
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
      },
    });

    this.pdfExportQueue = new Queue(QUEUE_NAMES.PDF_EXPORT, {
      connection,
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 50,
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
      },
    });
  }

  async addWelcomeEmailJob(
    payload: WelcomeEmailPayload,
    options?: JobOptions,
  ): Promise<void> {
    await this.addEmailJob(EMAIL_JOB_TYPES.WELCOME, payload, options);
  }

  async addVerifyEmailJob(
    payload: VerifyEmailPayload,
    options?: JobOptions,
  ): Promise<void> {
    await this.addEmailJob(EMAIL_JOB_TYPES.VERIFY_EMAIL, payload, options);
  }

  async addEmailJob(
    type: EmailJobType,
    payload: unknown,
    options?: JobOptions,
  ): Promise<void> {
    await this.emailQueue.add(type, payload, {
      ...(options?.delay && { delay: options.delay }),
      ...(options?.priority && { priority: options.priority }),
    });
  }

  async addPdfExportJob(
    payload: PdfExportPatientReportPayload,
    options?: JobOptions,
  ): Promise<void> {
    await this.pdfExportQueue.add(
      PDF_EXPORT_JOB_TYPES.PATIENT_REPORT,
      payload,
      {
        ...(options?.delay && { delay: options.delay }),
        ...(options?.priority && { priority: options.priority }),
      },
    );
  }

  async close(): Promise<void> {
    await Promise.all([this.emailQueue.close(), this.pdfExportQueue.close()]);
  }
}
