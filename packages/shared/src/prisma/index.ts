// Re-export Prisma Client and Prisma namespace from @prisma/client
// Model types are exported from entities to avoid conflicts
export { PrismaClient, Prisma } from "@prisma/client";

// Re-export all model types from @prisma/client for consumers who need the raw Prisma types
export type {
  Patient,
  EmailVerificationToken,
  SubstanceCategory,
  Substance,
  Product,
  ProtocolTemplate,
  Protocol,
  ProtocolSubstance,
  Dose,
  SideEffect,
  BiometricEntry,
  ProgressEntry,
  Alert,
  AiInsight,
  AiAnnotation,
  AiReport,
  Content,
  AuditLog,
  ExportJob,
  Vial,
  Cycle,
  TitrationPhase,
} from "@prisma/client";
