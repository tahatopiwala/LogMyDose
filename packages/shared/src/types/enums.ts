import { z } from 'zod';

// Account and subscription types
export const accountTypeSchema = z.enum(['d2c', 'clinic_managed', 'hybrid']);
export type AccountType = z.infer<typeof accountTypeSchema>;

export const subscriptionTierSchema = z.enum(['free', 'pro']);
export type SubscriptionTier = z.infer<typeof subscriptionTierSchema>;

export const subscriptionStatusSchema = z.enum(['active', 'past_due', 'cancelled', 'trialing']);
export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;

// User roles
export const userRoleSchema = z.enum(['super_admin', 'clinic_admin', 'provider']);
export type UserRole = z.infer<typeof userRoleSchema>;

// Clinic control levels
export const clinicControlLevelSchema = z.enum(['view_only', 'can_modify', 'full_control']);
export type ClinicControlLevel = z.infer<typeof clinicControlLevelSchema>;

// Protocol related enums
export const protocolStatusSchema = z.enum(['draft', 'active', 'paused', 'completed']);
export type ProtocolStatus = z.infer<typeof protocolStatusSchema>;

export const protocolSourceSchema = z.enum(['template', 'clinic_assigned', 'custom']);
export type ProtocolSource = z.infer<typeof protocolSourceSchema>;

// Dose related enums
export const doseStatusSchema = z.enum(['taken', 'missed', 'skipped']);
export type DoseStatus = z.infer<typeof doseStatusSchema>;

// Alert types
export const alertTypeSchema = z.enum(['refill', 'expiration', 'storage', 'dose_reminder']);
export type AlertType = z.infer<typeof alertTypeSchema>;

export const alertStatusSchema = z.enum(['pending', 'sent', 'dismissed']);
export type AlertStatus = z.infer<typeof alertStatusSchema>;

// Administration routes
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
export type AdministrationRoute = z.infer<typeof administrationRouteSchema>;

// User types for auth
export const userTypeSchema = z.enum(['patient', 'user']);
export type UserType = z.infer<typeof userTypeSchema>;

// Invitation status
export const invitationStatusSchema = z.enum(['pending', 'accepted', 'expired', 'cancelled']);
export type InvitationStatus = z.infer<typeof invitationStatusSchema>;
