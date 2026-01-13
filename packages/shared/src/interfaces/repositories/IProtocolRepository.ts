import { IBaseRepository, FindManyOptions } from "./IBaseRepository.js";
import {
  Protocol,
  ProtocolSubstance,
  ProtocolWithDetails,
  TemplateWithRelations,
} from "../../entities/index.js";
import {
  PaginatedResponse,
  Decimal,
  InputJsonValue,
} from "../../types/index.js";

export interface CreateProtocolSubstanceInput {
  substanceId: string;
  dose: Decimal;
  doseUnit?: string;
  frequency?: string;
  schedule?: InputJsonValue;
  titrationPlan?: InputJsonValue;
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

export interface FindTemplatesOptions extends FindManyOptions {
  categoryId?: string;
  substanceId?: string;
  difficulty?: string;
  search?: string;
  isPublic?: boolean;
}

export interface IProtocolRepository extends IBaseRepository<
  Protocol,
  CreateProtocolInput,
  UpdateProtocolInput
> {
  // Template methods
  findTemplates(
    options?: FindTemplatesOptions,
  ): Promise<PaginatedResponse<TemplateWithRelations>>;
  findTemplateById(id: string): Promise<TemplateWithRelations | null>;
  incrementTemplateUseCount(id: string): Promise<void>;

  // Protocol methods
  findByIdWithDetails(id: string): Promise<ProtocolWithDetails | null>;
  findByPatientId(patientId: string): Promise<ProtocolWithDetails[]>;
  findProtocolSubstanceById(
    id: string,
  ): Promise<(ProtocolSubstance & { protocol: Protocol }) | null>;
}
