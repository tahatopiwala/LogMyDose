import { PatientExportData } from "../../../interfaces/repositories/IPatientRepository.js";
import { DateRange } from "../../../interfaces/services/IPdfExportService.js";

export function renderHeader(
  doc: PDFKit.PDFDocument,
  data: PatientExportData,
  dateRange: DateRange,
): void {
  // Title
  doc.fontSize(20).text("Medical Report - LogMyDose", { align: "center" });
  doc.moveDown(0.5);

  // Subtitle
  doc
    .fontSize(10)
    .fillColor("#666666")
    .text("Patient Health Data Export", { align: "center" });
  doc.fillColor("#000000");
  doc.moveDown(2);

  // Patient Information
  doc.fontSize(14).text("Patient Information", { underline: true });
  doc.moveDown(0.5);

  const fullName =
    `${data.patient.firstName || ""} ${data.patient.lastName || ""}`.trim() ||
    "Patient Export";
  doc.fontSize(10).text(`Name: ${fullName}`);
  doc.text(`Email: ${data.patient.email}`);

  if (data.patient.dateOfBirth) {
    const dob = new Date(data.patient.dateOfBirth).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc.text(`Date of Birth: ${dob}`);
  }

  doc.moveDown(1);

  // Report Information
  doc.fontSize(14).text("Report Information", { underline: true });
  doc.moveDown(0.5);

  doc.fontSize(10).text(
    `Report Period: ${dateRange.startDate.toLocaleDateString("en-US")} - ${dateRange.endDate.toLocaleDateString("en-US")}`,
  );
  doc.text(
    `Generated: ${new Date().toLocaleDateString("en-US")} at ${new Date().toLocaleTimeString("en-US")}`,
  );

  doc.moveDown(2);
}
