import { Protocol, Prisma } from '@peptiderx/shared/prisma';
import {
  IProtocolService,
  GetTemplatesQuery,
  CreateProtocolInput,
  ProtocolSchedule,
} from '../interfaces/services/IProtocolService.js';
import { CurrentUser } from '../interfaces/services/IAuthService.js';
import {
  IProtocolRepository,
  ProtocolWithDetails,
  TemplateWithRelations,
  UpdateProtocolInput,
} from '../interfaces/repositories/IProtocolRepository.js';
import { ISubstanceRepository } from '../interfaces/repositories/ISubstanceRepository.js';
import { PaginatedResponse } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';

export class ProtocolService implements IProtocolService {
  constructor(
    private readonly protocolRepository: IProtocolRepository,
    private readonly substanceRepository: ISubstanceRepository
  ) {}

  async getTemplates(
    query: GetTemplatesQuery
  ): Promise<PaginatedResponse<TemplateWithRelations>> {
    return this.protocolRepository.findTemplates({
      page: query.page,
      limit: query.limit,
      categoryId: query.categoryId,
      substanceId: query.substanceId,
      difficulty: query.difficulty,
      search: query.search,
      isPublic: true,
    });
  }

  async getTemplateById(id: string): Promise<TemplateWithRelations | null> {
    const template = await this.protocolRepository.findTemplateById(id);

    if (!template) {
      throw new AppError(404, 'Template not found', 'NOT_FOUND');
    }

    return template;
  }

  async createProtocol(
    patientId: string,
    input: CreateProtocolInput
  ): Promise<ProtocolWithDetails> {
    // If using template, verify it exists and increment use count
    if (input.source === 'template' && input.templateId) {
      const template = await this.protocolRepository.findTemplateById(input.templateId);

      if (!template) {
        throw new AppError(404, 'Template not found', 'TEMPLATE_NOT_FOUND');
      }

      await this.protocolRepository.incrementTemplateUseCount(input.templateId);
    }

    // Verify all substances exist
    const substanceIds = input.substances.map((s) => s.substanceId);
    const substances = await this.substanceRepository.findByIds(substanceIds);

    if (substances.length !== substanceIds.length) {
      throw new AppError(400, 'One or more substances not found', 'SUBSTANCE_NOT_FOUND');
    }

    const protocol = await this.protocolRepository.create({
      patientId,
      source: input.source,
      templateId: input.templateId,
      startDate: input.startDate ? new Date(input.startDate) : undefined,
      endDate: input.endDate ? new Date(input.endDate) : undefined,
      notes: input.notes,
      status: 'active',
      substances: input.substances.map((s) => ({
        substanceId: s.substanceId,
        dose: s.dose,
        doseUnit: s.doseUnit,
        frequency: s.frequency,
        schedule: s.schedule as Prisma.InputJsonValue,
        titrationPlan: s.titrationPlan as Prisma.InputJsonValue,
        cycleOnWeeks: s.cycleOnWeeks,
        cycleOffWeeks: s.cycleOffWeeks,
        notes: s.notes,
      })),
    });

    const result = await this.protocolRepository.findByIdWithDetails(protocol.id);
    if (!result) {
      throw new AppError(500, 'Failed to retrieve created protocol', 'INTERNAL_ERROR');
    }

    return result;
  }

  async getProtocolById(id: string, currentUser: CurrentUser): Promise<ProtocolWithDetails | null> {
    const protocol = await this.protocolRepository.findByIdWithDetails(id);

    if (!protocol) {
      throw new AppError(404, 'Protocol not found', 'NOT_FOUND');
    }

    // Verify access
    if (currentUser.role === 'patient' && protocol.patientId !== currentUser.id) {
      throw new AppError(403, 'Access denied', 'FORBIDDEN');
    }

    // For providers, check tenant access
    if (['provider', 'clinic_admin'].includes(currentUser.role)) {
      if (protocol.clinicId !== currentUser.tenantId) {
        throw new AppError(403, 'Access denied', 'FORBIDDEN');
      }
    }

    return protocol;
  }

  async updateProtocol(
    id: string,
    data: UpdateProtocolInput,
    currentUser: CurrentUser
  ): Promise<Protocol> {
    const existingProtocol = await this.protocolRepository.findById(id);

    if (!existingProtocol) {
      throw new AppError(404, 'Protocol not found', 'NOT_FOUND');
    }

    // Verify access
    if (currentUser.role === 'patient' && existingProtocol.patientId !== currentUser.id) {
      throw new AppError(403, 'Access denied', 'FORBIDDEN');
    }

    return this.protocolRepository.update(id, data);
  }

  async getProtocolSchedule(
    id: string,
    currentUser: CurrentUser,
    startDate?: string,
    endDate?: string
  ): Promise<ProtocolSchedule> {
    const protocol = await this.protocolRepository.findByIdWithDetails(id);

    if (!protocol) {
      throw new AppError(404, 'Protocol not found', 'NOT_FOUND');
    }

    // Verify access
    if (currentUser.role === 'patient' && protocol.patientId !== currentUser.id) {
      throw new AppError(403, 'Access denied', 'FORBIDDEN');
    }

    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);

    const schedule = protocol.substances.map((ps) => ({
      substanceId: ps.substanceId,
      substanceName: ps.substance.name,
      dose: ps.dose.toString(),
      doseUnit: ps.doseUnit || ps.substance.doseUnit,
      frequency: ps.frequency,
    }));

    return { schedule, startDate: start, endDate: end };
  }
}
