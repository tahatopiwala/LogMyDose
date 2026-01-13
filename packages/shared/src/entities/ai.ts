import { JsonValue } from "../types/database.js";

/**
 * AiInsight entity - Pre-generated insights
 * Maps to: ai_insights table
 */
export interface AiInsight {
  id: string;
  patientId: string;
  type: string;
  title: string;
  content: string;
  actions: JsonValue | null;
  priority: number;
  contextData: JsonValue | null;
  expiresAt: Date | null;
  dismissedAt: Date | null;
  actedOnAt: Date | null;
  createdAt: Date;
}

/**
 * AiAnnotation entity - Cached annotations
 * Maps to: ai_annotations table
 */
export interface AiAnnotation {
  id: string;
  patientId: string;
  entityType: string;
  entityId: string;
  annotation: string;
  createdAt: Date;
}

/**
 * AiReport entity - Generated reports
 * Maps to: ai_reports table
 */
export interface AiReport {
  id: string;
  patientId: string;
  type: string;
  periodStart: Date;
  periodEnd: Date;
  content: string;
  sections: JsonValue | null;
  createdAt: Date;
}
