import { PatientExportData } from "../../../interfaces/repositories/IPatientRepository.js";

export function renderProtocolSection(
  doc: PDFKit.PDFDocument,
  protocols: PatientExportData["protocols"],
): void {
  doc.fontSize(16).text("Active Protocols", { underline: true });
  doc.moveDown(1);

  if (protocols.length === 0) {
    doc
      .fontSize(10)
      .fillColor("#666666")
      .text("No protocols found during this period.");
    doc.fillColor("#000000");
    doc.moveDown(2);
    return;
  }

  protocols.forEach((protocol, index) => {
    // Protocol header
    doc.fontSize(12).text(`Protocol ${index + 1}`);
    doc.moveDown(0.3);

    // Protocol details
    doc.fontSize(10);
    doc.text(`Status: ${protocol.status.toUpperCase()}`);
    doc.text(`Source: ${protocol.source}`);

    if (protocol.startDate) {
      doc.text(
        `Start Date: ${new Date(protocol.startDate).toLocaleDateString("en-US")}`,
      );
    }

    if (protocol.endDate) {
      doc.text(
        `End Date: ${new Date(protocol.endDate).toLocaleDateString("en-US")}`,
      );
    }

    if (protocol.notes) {
      doc.text(`Notes: ${protocol.notes}`);
    }

    doc.moveDown(0.5);

    // Substances table
    if (protocol.substances.length > 0) {
      doc.fontSize(11).text("Substances:", { underline: true });
      doc.moveDown(0.3);

      protocol.substances.forEach((ps) => {
        const doseStr = `${ps.dose} ${ps.doseUnit || ps.substance.doseUnit || "units"}`;
        const frequencyStr = ps.frequency || "as needed";

        doc
          .fontSize(10)
          .text(`  • ${ps.substance.name}: ${doseStr}, ${frequencyStr}`);
      });

      doc.moveDown(1);
    }

    // Add spacing between protocols
    if (index < protocols.length - 1) {
      doc.moveDown(0.5);
    }
  });

  doc.moveDown(2);
}
