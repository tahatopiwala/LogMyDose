import { PatientExportData } from "../../../interfaces/repositories/IPatientRepository.js";

export function renderDoseHistorySection(
  doc: PDFKit.PDFDocument,
  doses: PatientExportData["doses"],
): void {
  doc.fontSize(16).text("Dose History", { underline: true });
  doc.moveDown(1);

  if (doses.length === 0) {
    doc
      .fontSize(10)
      .fillColor("#666666")
      .text("No doses logged during this period.");
    doc.fillColor("#000000");
    doc.moveDown(2);
    return;
  }

  // Show truncation notice if at limit
  if (doses.length >= 5000) {
    doc
      .fontSize(9)
      .fillColor("#cc0000")
      .text("Note: Showing first 5000 doses. Please use a shorter date range for complete history.");
    doc.fillColor("#000000");
    doc.moveDown(0.5);
  }

  doc.fontSize(10).text(`Total Doses: ${doses.length}`);
  doc.moveDown(1);

  // Table header
  const tableTop = doc.y;
  const colWidths = {
    date: 70,
    time: 50,
    substance: 100,
    dose: 60,
    site: 60,
    status: 50,
  };

  doc.fontSize(9).fillColor("#000000");
  let xPos = 50;

  // Draw header
  doc.text("Date", xPos, tableTop, { width: colWidths.date, continued: false });
  xPos += colWidths.date;
  doc.text("Time", xPos, tableTop, { width: colWidths.time, continued: false });
  xPos += colWidths.time;
  doc.text("Substance", xPos, tableTop, {
    width: colWidths.substance,
    continued: false,
  });
  xPos += colWidths.substance;
  doc.text("Dose", xPos, tableTop, { width: colWidths.dose, continued: false });
  xPos += colWidths.dose;
  doc.text("Site", xPos, tableTop, { width: colWidths.site, continued: false });
  xPos += colWidths.site;
  doc.text("Status", xPos, tableTop, {
    width: colWidths.status,
    continued: false,
  });

  // Draw header line
  doc.moveDown(0.2);
  doc
    .moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .stroke();
  doc.moveDown(0.3);

  // Table rows
  doses.forEach((dose, index) => {
    // Check if we need a new page
    if (doc.y > 700) {
      doc.addPage();
      doc.fontSize(9);
    }

    const rowY = doc.y;
    xPos = 50;

    // Date
    const dateStr = new Date(dose.loggedAt).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
    doc.text(dateStr, xPos, rowY, { width: colWidths.date, continued: false });
    xPos += colWidths.date;

    // Time
    const timeStr = new Date(dose.loggedAt).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    doc.text(timeStr, xPos, rowY, { width: colWidths.time, continued: false });
    xPos += colWidths.time;

    // Substance
    const substanceName =
      dose.product?.name || dose.substance.name || "Unknown";
    doc.text(substanceName.substring(0, 20), xPos, rowY, {
      width: colWidths.substance,
      continued: false,
    });
    xPos += colWidths.substance;

    // Dose
    const doseStr = `${dose.dose} ${dose.doseUnit || ""}`.trim();
    doc.text(doseStr, xPos, rowY, { width: colWidths.dose, continued: false });
    xPos += colWidths.dose;

    // Site
    const site = dose.administrationSite
      ? dose.administrationSite.substring(0, 10)
      : "-";
    doc.text(site, xPos, rowY, { width: colWidths.site, continued: false });
    xPos += colWidths.site;

    // Status
    const status = dose.status || "taken";
    doc.text(status, xPos, rowY, { width: colWidths.status, continued: false });

    doc.moveDown(0.5);

    // Add notes if present
    if (dose.notes) {
      doc
        .fontSize(8)
        .fillColor("#666666")
        .text(`  Note: ${dose.notes.substring(0, 100)}`, {
          indent: 50,
        });
      doc.fontSize(9).fillColor("#000000");
      doc.moveDown(0.3);
    }

    // Light separator line every 5 rows
    if ((index + 1) % 5 === 0 && index < doses.length - 1) {
      doc
        .strokeColor("#eeeeee")
        .moveTo(50, doc.y)
        .lineTo(550, doc.y)
        .stroke();
      doc.strokeColor("#000000");
      doc.moveDown(0.2);
    }
  });

  doc.moveDown(2);
}
