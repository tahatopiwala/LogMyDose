import { IBaseRepository, FindManyOptions } from './IBaseRepository.js';
import { Substance, SubstanceCategory, SubstanceWithCategory } from '../../entities/index.js';
import { PaginatedResponse, Decimal } from '../../types/index.js';

export interface CreateSubstanceInput {
  categoryId: string;
  name: string;
  aliases?: string[];
  subcategory?: string;
  defaultDose?: Decimal;
  doseUnit?: string;
  defaultFrequency?: string;
  administrationRoute?: string;
  preparationInstructions?: string;
  storageTemp?: string;
  storageNotes?: string;
  shelfLifeDays?: number;
  shelfLifeReconstitutedDays?: number;
  requiresCycling?: boolean;
  commonCycleOnWeeks?: number;
  commonCycleOffWeeks?: number;
  contraindications?: string[];
  commonSideEffects?: string[];
  interactions?: string[];
  onsetTimeline?: string;
  isPrescriptionRequired?: boolean;
}

export interface UpdateSubstanceInput extends Partial<CreateSubstanceInput> {
  isActive?: boolean;
}

export interface FindSubstancesOptions extends FindManyOptions {
  categoryId?: string;
  subcategory?: string;
  search?: string;
  isActive?: boolean;
}

export interface ISubstanceRepository
  extends IBaseRepository<Substance, CreateSubstanceInput, UpdateSubstanceInput> {
  findCategories(): Promise<SubstanceCategory[]>;
  findCategoryById(id: string): Promise<SubstanceCategory | null>;
  findManyWithCategory(
    options?: FindSubstancesOptions
  ): Promise<PaginatedResponse<SubstanceWithCategory>>;
  findByIdWithCategory(id: string): Promise<SubstanceWithCategory | null>;
  findByIds(ids: string[]): Promise<Substance[]>;
}
