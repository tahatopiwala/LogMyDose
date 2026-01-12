export const QUEUE_NAMES = {
  EMAIL: 'email',
  NOTIFICATION: 'notification',
  AI_REPORT: 'ai-report',
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];
