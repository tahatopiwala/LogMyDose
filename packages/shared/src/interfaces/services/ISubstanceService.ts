import { Substance, SubstanceCategory, SubstanceWithCategory } from '../../entities/index.js';
import {
  CreateSubstanceInput,
  UpdateSubstanceInput,
} from '../repositories/ISubstanceRepository.js';
import { PaginatedResponse } from '../../types/index.js';

export interface GetSubstancesQuery {
  page?: number;
  limit?: number;
  categoryId?: string;
  subcategory?: string;
  search?: string;
}

export interface ISubstanceService {
  getCategories(): Promise<SubstanceCategory[]>;
  getSubstances(query: GetSubstancesQuery): Promise<PaginatedResponse<SubstanceWithCategory>>;
  getSubstanceById(id: string): Promise<SubstanceWithCategory | null>;
  createSubstance(data: CreateSubstanceInput): Promise<Substance>;
  updateSubstance(id: string, data: UpdateSubstanceInput): Promise<Substance>;
}
