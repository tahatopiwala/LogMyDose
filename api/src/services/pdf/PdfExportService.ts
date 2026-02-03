import PDFDocument from "pdfkit";
import { IPdfExportService, DateRange } from "../../interfaces/services/IPdfExportService.js";
import { PatientExportData } from "../../interfaces/repositories/IPatientRepository.js";
import {
  renderHeader,
  renderProtocolSection,
  renderDoseHistorySection,
  renderFooter,
} from "./sections/index.js";

export class PdfExportService implements IPdfExportService {
  async generatePatientReport(
    exportData: PatientExportData,
    dateRange: DateRange,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        // Create PDF document
        const doc = new PDFDocument({
          size: "LETTER",
          margins: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50,
          },
          info: {
            Title: "Medical Report - BioStak",
            Author: "BioStak",
            Subject: "Patient Health Data Export",
          },
        });

        // Collect PDF chunks
        const chunks: Buffer[] = [];
        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", (error) => reject(error));

        // Render sections
        renderHeader(doc, exportData, dateRange);
        renderProtocolSection(doc, exportData.protocols);
        renderDoseHistorySection(doc, exportData.doses);
        renderFooter(doc);

        // Finalize the PDF
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}
