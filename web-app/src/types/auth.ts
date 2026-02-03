export interface Patient {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  phone: string | null;
  subscriptionTier: string | null;
  subscriptionStatus: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  subscriptionPeriodEnd: string | null;
  subscriptionPriceId: string | null;
  trialEndsAt: string | null;
  cancelAtPeriodEnd: boolean;
  emailVerifiedAt: string | null;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  patient: Patient;
  accessToken: string;
  refreshToken: string;
}

export interface ApiError {
  error: string;
  code: string;
  details?: Array<{ path: string; message: string }>;
}
