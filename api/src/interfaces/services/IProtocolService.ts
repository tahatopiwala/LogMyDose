import { Protocol } from '@logmydose/shared/prisma';
import {
  ProtocolWithDetails,
  TemplateWithRelations,
  UpdateProtocolInput,
} from '../repositories/IProtocolRepository.js';
import { PaginatedResponse } from '../../types/index.js';
import { CurrentUser } from './IAuthService.js';

export interface GetTemplatesQuery {
  page?: number;
  limit?: number;
  categoryId?: string;
  substanceId?: string;
  difficulty?: string;
  search?: string;
}

export interface CreateProtocolSubstanceInput {
  substanceId: string;
  dose: number;
  doseUnit?: string;
  frequency?: string;
  schedule?: Record<string, unknown>;
  titrationPlan?: Record<string, unknown>;
  cycleOnWeeks?: number;
  cycleOffWeeks?: number;
  notes?: string;
}

export interface CreateProtocolInput {
  source: 'template' | 'custom';
  templateId?: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
  substances: CreateProtocolSubstanceInput[];
}

export interface ProtocolScheduleItem {
  substanceId: string;
  substanceName: string;
  dose: number | string;
  doseUnit: string | null;
  frequency: string | null;
}

export interface ProtocolSchedule {
  schedule: ProtocolScheduleItem[];
  startDate: Date;
  endDate: Date;
}

export interface IProtocolService {
  getTemplates(query: GetTemplatesQuery): Promise<PaginatedResponse<TemplateWithRelations>>;
  getTemplateById(id: string): Promise<TemplateWithRelations | null>;
  createProtocol(patientId: string, input: CreateProtocolInput): Promise<ProtocolWithDetails>;
  getProtocolById(id: string, currentUser: CurrentUser): Promise<ProtocolWithDetails | null>;
  updateProtocol(id: string, data: UpdateProtocolInput, currentUser: CurrentUser): Promise<Protocol>;
  getProtocolSchedule(id: string, currentUser: CurrentUser, startDate?: string, endDate?: string): Promise<ProtocolSchedule>;
}
