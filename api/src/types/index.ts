import { z } from 'zod';

// Common pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

// Common response types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// UUID validation
export const uuidSchema = z.string().uuid();

// Date validation
export const dateSchema = z.string().refine(
  (val) => !isNaN(Date.parse(val)),
  { message: 'Invalid date format' }
);

// Common enums matching Prisma schema
export const accountTypeSchema = z.enum(['d2c', 'clinic_managed', 'hybrid']);
export const subscriptionTierSchema = z.enum(['free', 'pro']);
export const subscriptionStatusSchema = z.enum(['active', 'past_due', 'cancelled', 'trialing']);
export const userRoleSchema = z.enum(['super_admin', 'clinic_admin', 'provider']);
export const clinicControlLevelSchema = z.enum(['view_only', 'can_modify', 'full_control']);
export const protocolStatusSchema = z.enum(['draft', 'active', 'paused', 'completed']);
export const protocolSourceSchema = z.enum(['template', 'clinic_assigned', 'custom']);
export const doseStatusSchema = z.enum(['taken', 'missed', 'skipped']);
export const alertTypeSchema = z.enum(['refill', 'expiration', 'storage', 'dose_reminder']);
export const alertStatusSchema = z.enum(['pending', 'sent', 'dismissed']);
export const administrationRouteSchema = z.enum([
  'injection_subq',
  'injection_im',
  'oral',
  'topical',
  'sublingual',
  'transdermal',
  'nasal',
  'iv',
]);
