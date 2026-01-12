import { JsonValue } from '../types/database.js';

/**
 * ProgressEntry entity
 * Maps to: progress_entries table
 */
export interface ProgressEntry {
  id: string;
  patientId: string;
  type: string;
  data: JsonValue | null;
  fileUrls: string[];
  notes: string | null;
  sharedWithClinic: boolean;
  recordedAt: Date;
}
