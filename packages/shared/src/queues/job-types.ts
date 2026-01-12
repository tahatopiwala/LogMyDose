export const EMAIL_JOB_TYPES = {
  WELCOME: 'email:welcome',
  VERIFY_EMAIL: 'email:verify',
  PASSWORD_RESET: 'email:password-reset',
  DOSE_REMINDER: 'email:dose-reminder',
  WEEKLY_SUMMARY: 'email:weekly-summary',
} as const;

export type EmailJobType = (typeof EMAIL_JOB_TYPES)[keyof typeof EMAIL_JOB_TYPES];

export const NOTIFICATION_JOB_TYPES = {
  PUSH: 'notification:push',
  SMS: 'notification:sms',
} as const;

export type NotificationJobType =
  (typeof NOTIFICATION_JOB_TYPES)[keyof typeof NOTIFICATION_JOB_TYPES];

export const AI_REPORT_JOB_TYPES = {
  WEEKLY: 'ai-report:weekly',
  MONTHLY: 'ai-report:monthly',
} as const;

export type AiReportJobType = (typeof AI_REPORT_JOB_TYPES)[keyof typeof AI_REPORT_JOB_TYPES];
