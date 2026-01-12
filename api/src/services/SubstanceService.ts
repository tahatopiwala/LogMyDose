import { Substance, SubstanceCategory } from '@logmydose/shared/prisma';
import {
  ISubstanceService,
  GetSubstancesQuery,
} from '../interfaces/services/ISubstanceService.js';
import {
  ISubstanceRepository,
  SubstanceWithCategory,
  CreateSubstanceInput,
  UpdateSubstanceInput,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../interfaces/repositories/ISubstanceRepository.js';
import { PaginatedResponse } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';

export class SubstanceService implements ISubstanceService {
  constructor(private readonly substanceRepository: ISubstanceRepository) {}

  async getCategories(): Promise<SubstanceCategory[]> {
    return this.substanceRepository.findCategories();
  }

  async createCategory(data: CreateCategoryInput): Promise<SubstanceCategory> {
    return this.substanceRepository.createCategory(data);
  }

  async updateCategory(id: string, data: UpdateCategoryInput): Promise<SubstanceCategory> {
    const existing = await this.substanceRepository.findCategoryById(id);

    if (!existing) {
      throw new AppError(404, 'Category not found', 'NOT_FOUND');
    }

    return this.substanceRepository.updateCategory(id, data);
  }

  async getSubstances(
    query: GetSubstancesQuery
  ): Promise<PaginatedResponse<SubstanceWithCategory>> {
    return this.substanceRepository.findManyWithCategory({
      page: query.page,
      limit: query.limit,
      categoryId: query.categoryId,
      subcategory: query.subcategory,
      search: query.search,
      isActive: true,
    });
  }

  async getSubstanceById(id: string): Promise<SubstanceWithCategory | null> {
    const substance = await this.substanceRepository.findByIdWithCategory(id);

    if (!substance) {
      throw new AppError(404, 'Substance not found', 'NOT_FOUND');
    }

    return substance;
  }

  async createSubstance(data: CreateSubstanceInput): Promise<Substance> {
    // Verify category exists
    const category = await this.substanceRepository.findCategoryById(data.categoryId);

    if (!category) {
      throw new AppError(404, 'Category not found', 'CATEGORY_NOT_FOUND');
    }

    return this.substanceRepository.create(data);
  }

  async updateSubstance(id: string, data: UpdateSubstanceInput): Promise<Substance> {
    const existing = await this.substanceRepository.findById(id);

    if (!existing) {
      throw new AppError(404, 'Substance not found', 'NOT_FOUND');
    }

    return this.substanceRepository.update(id, data);
  }
}
