import { JsonValue } from '../types/database.js';

/**
 * Tenant entity - Clinic/white-label instances
 * Maps to: tenants table
 */
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  branding: JsonValue | null;
  subscriptionTier: string | null;
  subscriptionStatus: string | null;
  stripeCustomerId: string | null;
  settings: JsonValue | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Tenant with aggregated counts
 */
export interface TenantWithCounts extends Tenant {
  _count: {
    users: number;
    patients: number;
    protocols?: number;
  };
}

/**
 * Tenant with users relation
 */
export interface TenantWithUsers extends Tenant {
  users: Array<{
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: string;
    isActive: boolean;
  }>;
}
