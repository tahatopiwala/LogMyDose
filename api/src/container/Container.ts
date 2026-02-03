import { PrismaClient } from "@logmydose/shared/prisma";

// Repository interfaces
import {
  IPatientRepository,
  ISubstanceRepository,
  IProtocolRepository,
  IDoseRepository,
  IProductRepository,
  IExportJobRepository,
} from "../interfaces/repositories/index.js";

// Repository implementations
import {
  PatientRepository,
  SubstanceRepository,
  ProtocolRepository,
  DoseRepository,
  ProductRepository,
  ExportJobRepository,
} from "../repositories/index.js";

// Service interfaces
import {
  IAuthService,
  IPatientService,
  ISubstanceService,
  IProtocolService,
  IDoseService,
  IQueueService,
  IProductService,
  IPdfExportService,
  IStorageService,
  IExportJobService,
} from "../interfaces/services/index.js";

// Service implementations
import {
  AuthService,
  PatientService,
  SubstanceService,
  ProtocolService,
  DoseService,
  QueueService,
  ProductService,
  StorageService,
  ExportJobService,
} from "../services/index.js";
import { PdfExportService } from "../services/pdf/PdfExportService.js";
import { createRequireProTier } from "../middleware/subscription.js";
import { RequestHandler } from "express";

import { env } from "../lib/env.js";

export class Container {
  private static instance: Container;

  // Repositories
  readonly patientRepository: IPatientRepository;
  readonly substanceRepository: ISubstanceRepository;
  readonly protocolRepository: IProtocolRepository;
  readonly doseRepository: IDoseRepository;
  readonly productRepository: IProductRepository;
  readonly exportJobRepository: IExportJobRepository;

  // Services
  readonly authService: IAuthService;
  readonly patientService: IPatientService;
  readonly substanceService: ISubstanceService;
  readonly protocolService: IProtocolService;
  readonly doseService: IDoseService;
  readonly queueService: IQueueService;
  readonly productService: IProductService;
  readonly pdfExportService: IPdfExportService;
  readonly storageService: IStorageService;
  readonly exportJobService: IExportJobService;

  // Middleware
  readonly requireProTierMiddleware: RequestHandler;

  private constructor(prisma: PrismaClient) {
    // Initialize repositories
    this.patientRepository = new PatientRepository(prisma);
    this.substanceRepository = new SubstanceRepository(prisma);
    this.protocolRepository = new ProtocolRepository(prisma);
    this.doseRepository = new DoseRepository(prisma);
    this.productRepository = new ProductRepository(prisma);
    this.exportJobRepository = new ExportJobRepository(prisma);

    // Initialize queue service
    this.queueService = new QueueService({
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      password: env.REDIS_PASSWORD,
    });

    // Initialize storage service (for S3/MinIO)
    this.storageService = new StorageService({
      endpoint: env.S3_ENDPOINT,
      region: env.S3_REGION,
      bucket: env.S3_BUCKET,
      accessKeyId: env.S3_ACCESS_KEY_ID || "",
      secretAccessKey: env.S3_SECRET_ACCESS_KEY || "",
      forcePathStyle: true,
    });

    // Initialize services with repository dependencies
    this.authService = new AuthService(
      this.patientRepository,
      this.queueService,
    );

    this.patientService = new PatientService(
      this.patientRepository,
      this.protocolRepository,
      this.doseRepository,
    );

    this.substanceService = new SubstanceService(this.substanceRepository);

    this.protocolService = new ProtocolService(
      this.protocolRepository,
      this.substanceRepository,
    );

    this.doseService = new DoseService(
      this.doseRepository,
      this.substanceRepository,
      this.protocolRepository,
    );

    this.productService = new ProductService(
      this.productRepository,
      this.substanceRepository,
    );

    this.pdfExportService = new PdfExportService();

    this.exportJobService = new ExportJobService(
      this.exportJobRepository,
      this.storageService,
      this.queueService,
    );

    // Initialize middleware
    this.requireProTierMiddleware = createRequireProTier(this.patientRepository);
  }

  static getInstance(prisma?: PrismaClient): Container {
    if (!Container.instance) {
      if (!prisma) {
        throw new Error(
          "Prisma client required for initial Container instantiation",
        );
      }
      Container.instance = new Container(prisma);
    }
    return Container.instance;
  }

  static resetInstance(): void {
    // Useful for testing
    Container.instance = undefined as unknown as Container;
  }
}

// Export a function to get the container instance
export function getContainer(): Container {
  return Container.getInstance();
}
