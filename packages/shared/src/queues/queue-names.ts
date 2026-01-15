export const QUEUE_NAMES = {
  EMAIL: "email",
  NOTIFICATION: "notification",
  AI_REPORT: "ai-report",
  PDF_EXPORT: "pdf-export",
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];
