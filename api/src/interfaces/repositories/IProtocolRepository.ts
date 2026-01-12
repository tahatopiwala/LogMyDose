import { Protocol, ProtocolTemplate, ProtocolSubstance, Prisma } from '@logmydose/shared/prisma';
import { IBaseRepository, FindManyOptions } from './IBaseRepository.js';
import { PaginatedResponse } from '../../types/index.js';

export interface CreateProtocolSubstanceInput {
  substanceId: string;
  dose: Prisma.Decimal | number;
  doseUnit?: string;
  frequency?: string;
  schedule?: Prisma.InputJsonValue;
  titrationPlan?: Prisma.InputJsonValue;
  cycleOnWeeks?: number;
  cycleOffWeeks?: number;
  notes?: string;
}

export interface CreateProtocolInput {
  patientId: string;
  source: string;
  templateId?: string;
  clinicId?: string;
  providerId?: string;
  startDate?: Date;
  endDate?: Date;
  notes?: string;
  status?: string;
  substances: CreateProtocolSubstanceInput[];
}

export interface UpdateProtocolInput {
  status?: string;
  startDate?: Date;
  endDate?: Date;
  notes?: string;
}

export interface ProtocolWithDetails extends Protocol {
  template?: { id: string; name: string } | null;
  patient?: { id: string; firstName: string | null; lastName: string | null; email: string };
  provider?: { id: string; firstName: string | null; lastName: string | null; credentials: string | null } | null;
  substances: Array<ProtocolSubstance & {
    substance: {
      id: string;
      name: string;
      doseUnit: string | null;
      administrationRoute: string | null;
    };
  }>;
}

export interface FindTemplatesOptions extends FindManyOptions {
  categoryId?: string;
  substanceId?: string;
  difficulty?: string;
  search?: string;
  isPublic?: boolean;
}

export interface TemplateWithRelations extends ProtocolTemplate {
  category?: { id: string; name: string; displayName: string } | null;
  substance?: { id: string; name: string; doseUnit: string | null } | null;
}

export interface IProtocolRepository extends IBaseRepository<Protocol, CreateProtocolInput, UpdateProtocolInput> {
  // Template methods
  findTemplates(options?: FindTemplatesOptions): Promise<PaginatedResponse<TemplateWithRelations>>;
  findTemplateById(id: string): Promise<TemplateWithRelations | null>;
  incrementTemplateUseCount(id: string): Promise<void>;

  // Protocol methods
  findByIdWithDetails(id: string): Promise<ProtocolWithDetails | null>;
  findByPatientId(patientId: string): Promise<ProtocolWithDetails[]>;
  findProtocolSubstanceById(id: string): Promise<(ProtocolSubstance & { protocol: Protocol }) | null>;
}
