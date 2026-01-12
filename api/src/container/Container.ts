import { PrismaClient } from '@peptiderx/shared/prisma';

// Repository interfaces
import {
  IUserRepository,
  IPatientRepository,
  ITenantRepository,
  ISubstanceRepository,
  IProtocolRepository,
  IDoseRepository,
} from '../interfaces/repositories/index.js';

// Repository implementations
import {
  UserRepository,
  PatientRepository,
  TenantRepository,
  SubstanceRepository,
  ProtocolRepository,
  DoseRepository,
} from '../repositories/index.js';

// Service interfaces
import {
  IAuthService,
  IPatientService,
  ITenantService,
  ISubstanceService,
  IProtocolService,
  IDoseService,
} from '../interfaces/services/index.js';

// Service implementations
import {
  AuthService,
  PatientService,
  TenantService,
  SubstanceService,
  ProtocolService,
  DoseService,
} from '../services/index.js';

export class Container {
  private static instance: Container;

  // Repositories
  readonly userRepository: IUserRepository;
  readonly patientRepository: IPatientRepository;
  readonly tenantRepository: ITenantRepository;
  readonly substanceRepository: ISubstanceRepository;
  readonly protocolRepository: IProtocolRepository;
  readonly doseRepository: IDoseRepository;

  // Services
  readonly authService: IAuthService;
  readonly patientService: IPatientService;
  readonly tenantService: ITenantService;
  readonly substanceService: ISubstanceService;
  readonly protocolService: IProtocolService;
  readonly doseService: IDoseService;

  private constructor(prisma: PrismaClient) {
    // Initialize repositories
    this.userRepository = new UserRepository(prisma);
    this.patientRepository = new PatientRepository(prisma);
    this.tenantRepository = new TenantRepository(prisma);
    this.substanceRepository = new SubstanceRepository(prisma);
    this.protocolRepository = new ProtocolRepository(prisma);
    this.doseRepository = new DoseRepository(prisma);

    // Initialize services with repository dependencies
    this.authService = new AuthService(this.userRepository, this.patientRepository);

    this.patientService = new PatientService(
      this.patientRepository,
      this.tenantRepository,
      this.protocolRepository,
      this.doseRepository
    );

    this.tenantService = new TenantService(this.tenantRepository, this.patientRepository);

    this.substanceService = new SubstanceService(this.substanceRepository);

    this.protocolService = new ProtocolService(this.protocolRepository, this.substanceRepository);

    this.doseService = new DoseService(
      this.doseRepository,
      this.substanceRepository,
      this.protocolRepository
    );
  }

  static getInstance(prisma?: PrismaClient): Container {
    if (!Container.instance) {
      if (!prisma) {
        throw new Error('Prisma client required for initial Container instantiation');
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
