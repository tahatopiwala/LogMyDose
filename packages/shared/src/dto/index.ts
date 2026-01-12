// DTOs are exported through interfaces - this file is a placeholder for future API-specific DTOs
// Re-export service inputs as DTOs for API consumers
export {
  RegisterPatientInput,
  RegisterUserInput,
  LoginInput,
  RefreshInput,
} from '../interfaces/services/IAuthService.js';

export { PatientDosesQuery } from '../interfaces/services/IPatientService.js';

export {
  GetClinicPatientsQuery,
  CreateClinicInvitationInput,
} from '../interfaces/services/ITenantService.js';

export { GetSubstancesQuery } from '../interfaces/services/ISubstanceService.js';

export {
  GetTemplatesQuery,
  CreateProtocolSubstanceServiceInput,
  CreateProtocolServiceInput,
} from '../interfaces/services/IProtocolService.js';

export {
  LogDoseInput,
  UpdateDoseServiceInput,
  LogSideEffectInput,
  GetDosesQuery,
  GetSideEffectsQuery,
  GetStatsQuery,
} from '../interfaces/services/IDoseService.js';
