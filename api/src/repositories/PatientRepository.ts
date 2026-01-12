import { PrismaClient, Patient } from '@peptiderx/shared/prisma';
import {
  IPatientRepository,
  CreatePatientInput,
  UpdatePatientInput,
  PatientWithClinic,
  FindClinicPatientsOptions,
  FindManyOptions,
} from '../interfaces/repositories/index.js';
import { PaginatedResponse } from '../types/index.js';

export class PatientRepository implements IPatientRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Patient | null> {
    return this.prisma.patient.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<Patient | null> {
    return this.prisma.patient.findUnique({ where: { email } });
  }

  async findByIdWithClinic(id: string): Promise<PatientWithClinic | null> {
    return this.prisma.patient.findUnique({
      where: { id },
      include: {
        clinic: {
          select: {
            id: true,
            name: true,
            branding: true,
          },
        },
      },
    });
  }

  async findMany(options?: FindManyOptions): Promise<PaginatedResponse<Patient>> {
    const page = options?.page || 1;
    const limit = options?.limit || 20;

    const [data, total] = await Promise.all([
      this.prisma.patient.findMany({
        orderBy: options?.orderBy || { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.patient.count(),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByClinicId(options: FindClinicPatientsOptions): Promise<PaginatedResponse<Patient>> {
    const page = options.page || 1;
    const limit = options.limit || 20;

    const where: Record<string, unknown> = { clinicId: options.clinicId };

    if (options.search) {
      where.OR = [
        { firstName: { contains: options.search, mode: 'insensitive' } },
        { lastName: { contains: options.search, mode: 'insensitive' } },
        { email: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    if (options.status) {
      where.subscriptionStatus = options.status;
    }

    const [data, total] = await Promise.all([
      this.prisma.patient.findMany({
        where: where as never,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          dateOfBirth: true,
          phone: true,
          accountType: true,
          subscriptionTier: true,
          subscriptionStatus: true,
          stripeCustomerId: true,
          clinicId: true,
          clinicLinkedAt: true,
          clinicControlLevel: true,
          consentSignedAt: true,
          settings: true,
          tokenVersion: true,
          createdAt: true,
          passwordHash: true,
          _count: {
            select: {
              protocols: true,
              doses: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.patient.count({ where: where as never }),
    ]);

    return {
      data: data as unknown as Patient[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(data: CreatePatientInput): Promise<Patient> {
    return this.prisma.patient.create({ data });
  }

  async update(id: string, data: UpdatePatientInput): Promise<Patient> {
    return this.prisma.patient.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.patient.delete({ where: { id } });
  }

  async count(where?: Record<string, unknown>): Promise<number> {
    return this.prisma.patient.count({ where: where as never });
  }

  async incrementTokenVersion(id: string): Promise<void> {
    await this.prisma.patient.update({
      where: { id },
      data: { tokenVersion: { increment: 1 } },
    });
  }

  async linkToClinic(patientId: string, clinicId: string, controlLevel: string): Promise<Patient> {
    return this.prisma.patient.update({
      where: { id: patientId },
      data: {
        clinicId,
        clinicLinkedAt: new Date(),
        clinicControlLevel: controlLevel,
        accountType: 'clinic_managed',
      },
    });
  }

  async unlinkFromClinic(patientId: string): Promise<Patient> {
    return this.prisma.patient.update({
      where: { id: patientId },
      data: {
        clinicId: null,
        clinicLinkedAt: null,
        clinicControlLevel: null,
        accountType: 'd2c',
      },
    });
  }
}
