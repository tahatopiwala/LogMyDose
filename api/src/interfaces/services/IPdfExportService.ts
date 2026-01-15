import { PatientExportData } from "../repositories/IPatientRepository.js";

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface IPdfExportService {
  generatePatientReport(
    exportData: PatientExportData,
    dateRange: DateRange,
  ): Promise<Buffer>;
}
