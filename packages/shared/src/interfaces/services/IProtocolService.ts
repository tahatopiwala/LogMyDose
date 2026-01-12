import { Protocol, ProtocolWithDetails, TemplateWithRelations } from '../../entities/index.js';
import { UpdateProtocolInput } from '../repositories/IProtocolRepository.js';
import { CurrentUser } from './IAuthService.js';
import { PaginatedResponse, InputJsonValue } from '../../types/index.js';

export interface GetTemplatesQuery {
  page?: number;
  limit?: number;
  categoryId?: string;
  substanceId?: string;
  difficulty?: string;
  search?: string;
}

export interface CreateProtocolSubstanceServiceInput {
  substanceId: string;
  dose: number;
  doseUnit?: string;
  frequency?: string;
  schedule?: InputJsonValue;
  titrationPlan?: InputJsonValue;
  cycleOnWeeks?: number;
  cycleOffWeeks?: number;
  notes?: string;
}

export interface CreateProtocolServiceInput {
  source: 'template' | 'custom';
  templateId?: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
  substances: CreateProtocolSubstanceServiceInput[];
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
  createProtocol(
    patientId: string,
    input: CreateProtocolServiceInput
  ): Promise<ProtocolWithDetails>;
  getProtocolById(id: string, currentUser: CurrentUser): Promise<ProtocolWithDetails | null>;
  updateProtocol(
    id: string,
    data: UpdateProtocolInput,
    currentUser: CurrentUser
  ): Promise<Protocol>;
  getProtocolSchedule(
    id: string,
    currentUser: CurrentUser,
    startDate?: string,
    endDate?: string
  ): Promise<ProtocolSchedule>;
}
