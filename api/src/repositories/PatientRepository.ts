import {
  PrismaClient,
  Patient,
  EmailVerificationToken,
} from "@biostak/shared/prisma";
import {
  IPatientRepository,
  CreatePatientInput,
  UpdatePatientInput,
  FindManyOptions,
  CreateVerificationTokenInput,
  PatientExportData,
} from "../interfaces/repositories/index.js";
import { PaginatedResponse } from "../types/index.js";

export class PatientRepository implements IPatientRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Patient | null> {
    return this.prisma.patient.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<Patient | null> {
    return this.prisma.patient.findUnique({ where: { email } });
  }

  async findMany(
    options?: FindManyOptions,
  ): Promise<PaginatedResponse<Patient>> {
    const page = options?.page || 1;
    const limit = options?.limit || 20;

    const [data, total] = await Promise.all([
      this.prisma.patient.findMany({
        orderBy: options?.orderBy || { createdAt: "desc" },
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

  // Email verification methods
  async createVerificationToken(
    input: CreateVerificationTokenInput,
  ): Promise<EmailVerificationToken> {
    return this.prisma.emailVerificationToken.create({
      data: {
        patientId: input.patientId,
        token: input.token,
        expiresAt: input.expiresAt,
      },
    });
  }

  async findVerificationToken(
    token: string,
  ): Promise<EmailVerificationToken | null> {
    return this.prisma.emailVerificationToken.findUnique({
      where: { token },
    });
  }

  async markVerificationTokenUsed(token: string): Promise<void> {
    await this.prisma.emailVerificationToken.update({
      where: { token },
      data: { usedAt: new Date() },
    });
  }

  async markEmailVerified(patientId: string): Promise<Patient> {
    return this.prisma.patient.update({
      where: { id: patientId },
      data: { emailVerifiedAt: new Date() },
    });
  }

  async deleteExpiredVerificationTokens(patientId: string): Promise<void> {
    await this.prisma.emailVerificationToken.deleteMany({
      where: {
        patientId,
        OR: [{ expiresAt: { lt: new Date() } }, { usedAt: { not: null } }],
      },
    });
  }

  // Settings methods
  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await this.prisma.patient.update({
      where: { id },
      data: { passwordHash },
    });
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.patient.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        // Anonymize PII
        email: `deleted_${id}@deleted.local`,
        firstName: null,
        lastName: null,
        phone: null,
      },
    });
  }

  async findByStripeCustomerId(customerId: string): Promise<Patient | null> {
    return this.prisma.patient.findFirst({
      where: { stripeCustomerId: customerId },
    });
  }

  async updateSubscription(
    id: string,
    data: {
      stripeCustomerId?: string;
      stripeSubscriptionId?: string | null;
      subscriptionTier?: string;
      subscriptionStatus?: string;
      subscriptionPeriodEnd?: Date | null;
      subscriptionPriceId?: string | null;
      trialEndsAt?: Date | null;
      cancelAtPeriodEnd?: boolean;
    },
  ): Promise<Patient> {
    return this.prisma.patient.update({
      where: { id },
      data,
    });
  }

  async getExportData(
    patientId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<PatientExportData> {
    // Fetch patient basic info
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        dateOfBirth: true,
      },
    });

    if (!patient) {
      throw new Error("Patient not found");
    }

    // Fetch protocols and their substances separately to avoid relation issues
    const protocols = await this.prisma.protocol.findMany({
      where: {
        patientId,
        OR: [
          {
            startDate: {
              lte: endDate,
            },
          },
          {
            startDate: null,
          },
        ],
      },
      orderBy: {
        startDate: "desc",
      },
    });

    // Fetch all protocol substances for these protocols
    const protocolIds = protocols.map((p) => p.id);
    const protocolSubstances = await this.prisma.protocolSubstance.findMany({
      where: {
        protocolId: { in: protocolIds },
      },
      include: {
        substance: {
          select: {
            name: true,
            doseUnit: true,
          },
        },
      },
    });

    // Group substances by protocol
    const substancesByProtocol = new Map<string, typeof protocolSubstances>();
    protocolSubstances.forEach((ps) => {
      if (!substancesByProtocol.has(ps.protocolId)) {
        substancesByProtocol.set(ps.protocolId, []);
      }
      substancesByProtocol.get(ps.protocolId)!.push(ps);
    });

    // Transform protocols to match interface
    const transformedProtocols = protocols.map((protocol) => ({
      id: protocol.id,
      status: protocol.status,
      startDate: protocol.startDate,
      endDate: protocol.endDate,
      source: protocol.source,
      notes: protocol.notes,
      substances: (substancesByProtocol.get(protocol.id) || []).map((ps) => ({
        substance: {
          name: ps.substance.name,
          doseUnit: ps.substance.doseUnit,
        },
        dose: ps.dose,
        doseUnit: ps.doseUnit,
        frequency: ps.frequency,
      })),
    }));

    // Fetch doses within the date range
    const doses = await this.prisma.dose.findMany({
      where: {
        patientId,
        loggedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        substance: {
          select: {
            name: true,
          },
        },
        product: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        loggedAt: "desc",
      },
      take: 5000, // Limit to prevent massive exports
    });

    return {
      patient: {
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        dateOfBirth: patient.dateOfBirth,
      },
      protocols: transformedProtocols,
      doses: doses.map((dose) => ({
        id: dose.id,
        loggedAt: dose.loggedAt,
        dose: dose.dose,
        doseUnit: dose.doseUnit,
        status: dose.status,
        administrationSite: dose.administrationSite,
        notes: dose.notes,
        substance: {
          name: dose.substance.name,
        },
        product: dose.product,
      })),
    };
  }
}
