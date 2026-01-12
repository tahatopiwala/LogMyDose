/**
 * Alert entity
 * Maps to: alerts table
 */
export interface Alert {
  id: string;
  patientId: string;
  type: string;
  title: string | null;
  message: string | null;
  scheduledFor: Date | null;
  sentAt: Date | null;
  dismissedAt: Date | null;
  status: string;
}
