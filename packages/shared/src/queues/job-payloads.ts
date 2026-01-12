import { z } from 'zod';

// Base email payload schema
const baseEmailPayloadSchema = z.object({
  to: z.string().email(),
  patientId: z.string().uuid(),
});

// Welcome email payload
export const welcomeEmailPayloadSchema = baseEmailPayloadSchema.extend({
  firstName: z.string().optional(),
});
export type WelcomeEmailPayload = z.infer<typeof welcomeEmailPayloadSchema>;

// Email verification payload
export const verifyEmailPayloadSchema = baseEmailPayloadSchema.extend({
  verificationToken: z.string(),
  verificationUrl: z.string().url(),
  firstName: z.string().optional(),
  expiresAt: z.string().datetime(),
});
export type VerifyEmailPayload = z.infer<typeof verifyEmailPayloadSchema>;

// Password reset payload
export const passwordResetEmailPayloadSchema = baseEmailPayloadSchema.extend({
  resetToken: z.string(),
  resetUrl: z.string().url(),
  firstName: z.string().optional(),
  expiresAt: z.string().datetime(),
});
export type PasswordResetEmailPayload = z.infer<typeof passwordResetEmailPayloadSchema>;

// Dose reminder payload
export const doseReminderEmailPayloadSchema = baseEmailPayloadSchema.extend({
  firstName: z.string().optional(),
  substanceName: z.string(),
  dose: z.string(),
  scheduledTime: z.string(),
});
export type DoseReminderEmailPayload = z.infer<typeof doseReminderEmailPayloadSchema>;

// Weekly summary payload
export const weeklySummaryEmailPayloadSchema = baseEmailPayloadSchema.extend({
  firstName: z.string().optional(),
  weekStartDate: z.string(),
  weekEndDate: z.string(),
  totalDoses: z.number(),
  missedDoses: z.number(),
  adherenceRate: z.number(),
});
export type WeeklySummaryEmailPayload = z.infer<typeof weeklySummaryEmailPayloadSchema>;

// All email payload schemas for validation
export const emailPayloadSchemas = {
  'email:welcome': welcomeEmailPayloadSchema,
  'email:verify': verifyEmailPayloadSchema,
  'email:password-reset': passwordResetEmailPayloadSchema,
  'email:dose-reminder': doseReminderEmailPayloadSchema,
  'email:weekly-summary': weeklySummaryEmailPayloadSchema,
} as const;

// Union type for all email payloads
export type EmailPayload =
  | { type: 'email:welcome'; data: WelcomeEmailPayload }
  | { type: 'email:verify'; data: VerifyEmailPayload }
  | { type: 'email:password-reset'; data: PasswordResetEmailPayload }
  | { type: 'email:dose-reminder'; data: DoseReminderEmailPayload }
  | { type: 'email:weekly-summary'; data: WeeklySummaryEmailPayload };
