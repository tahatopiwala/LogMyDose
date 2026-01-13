import { Worker, Job } from "bullmq";
import {
  QUEUE_NAMES,
  EMAIL_JOB_TYPES,
  welcomeEmailPayloadSchema,
  verifyEmailPayloadSchema,
} from "@logmydose/shared/queues";
import { redis } from "../lib/redis.js";
import { env } from "../config/env.js";
import { ResendEmailService } from "../services/EmailService.js";
import {
  renderWelcomeEmail,
  renderVerifyEmail,
  type EmailContent,
} from "../templates/index.js";

const emailService = new ResendEmailService();

async function processEmailJob(job: Job): Promise<void> {
  console.log(`[Email Worker] Processing job: ${job.name} (${job.id})`);

  let emailContent: EmailContent;
  let toEmail: string;

  switch (job.name) {
    case EMAIL_JOB_TYPES.WELCOME: {
      const payload = welcomeEmailPayloadSchema.parse(job.data);
      emailContent = renderWelcomeEmail(payload);
      toEmail = payload.to;
      break;
    }

    case EMAIL_JOB_TYPES.VERIFY_EMAIL: {
      const payload = verifyEmailPayloadSchema.parse(job.data);
      emailContent = renderVerifyEmail(payload);
      toEmail = payload.to;
      break;
    }

    default:
      throw new Error(`Unknown email job type: ${job.name}`);
  }

  const result = await emailService.send({
    to: toEmail,
    subject: emailContent.subject,
    html: emailContent.html,
    text: emailContent.text,
  });

  console.log(
    `[Email Worker] Email sent successfully: ${job.name} to ${toEmail} (id: ${result.id})`,
  );
}

export function createEmailWorker(): Worker {
  const worker = new Worker(QUEUE_NAMES.EMAIL, processEmailJob, {
    connection: redis,
    concurrency: env.WORKER_CONCURRENCY,
  });

  worker.on("completed", (job) => {
    console.log(`[Email Worker] Job ${job.id} completed successfully`);
  });

  worker.on("failed", (job, err) => {
    console.error(`[Email Worker] Job ${job?.id} failed:`, err.message);
  });

  worker.on("error", (err) => {
    console.error("[Email Worker] Worker error:", err.message);
  });

  return worker;
}
