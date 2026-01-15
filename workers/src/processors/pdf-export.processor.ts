import { Worker, Job } from "bullmq";
import {
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import PDFDocument from "pdfkit";
import {
  QUEUE_NAMES,
  PDF_EXPORT_JOB_TYPES,
  pdfExportPatientReportSchema,
} from "@logmydose/shared/queues";
import { PrismaClient, Prisma } from "@logmydose/shared/prisma";
import { redis } from "../lib/redis.js";
import { env } from "../config/env.js";

const prisma = new PrismaClient();

interface S3Config {
  client: S3Client;
  bucket: string;
}

function createS3Client(): S3Config | null {
  if (!env.S3_ACCESS_KEY_ID || !env.S3_SECRET_ACCESS_KEY) {
    console.warn("[PDF Export Worker] S3 credentials not configured, PDF export will be disabled");
    return null;
  }

  return {
    client: new S3Client({
      endpoint: env.S3_ENDPOINT,
      region: env.S3_REGION,
      credentials: {
        accessKeyId: env.S3_ACCESS_KEY_ID,
        secretAccessKey: env.S3_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true,
    }),
    bucket: env.S3_BUCKET,
  };
}

const s3Config = createS3Client();

interface PatientExportData {
  patient: {
    firstName: string | null;
    lastName: string | null;
    email: string;
    dateOfBirth: Date | null;
  };
  protocols: Array<{
    id: string;
    status: string;
    startDate: Date | null;
    endDate: Date | null;
    source: string;
    notes: string | null;
    substances: Array<{
      substance: {
        name: string;
        doseUnit: string | null;
      };
      dose: Prisma.Decimal;
      doseUnit: string | null;
      frequency: string | null;
    }>;
  }>;
  doses: Array<{
    id: string;
    loggedAt: Date;
    dose: Prisma.Decimal;
    doseUnit: string | null;
    status: string;
    administrationSite: string | null;
    notes: string | null;
    substance: {
      name: string;
    };
    product: {
      name: string;
    } | null;
  }>;
}

interface DateRange {
  startDate: Date;
  endDate: Date;
}

async function getExportData(
  patientId: string,
  startDate: Date,
  endDate: Date,
): Promise<PatientExportData> {
  const patient = await prisma.patient.findUnique({
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

  const protocols = await prisma.protocol.findMany({
    where: {
      patientId,
      OR: [
        { startDate: { lte: endDate } },
        { startDate: null },
      ],
    },
    orderBy: { startDate: "desc" },
  });

  const protocolIds = protocols.map((p) => p.id);
  const protocolSubstances = await prisma.protocolSubstance.findMany({
    where: { protocolId: { in: protocolIds } },
    include: {
      substance: {
        select: { name: true, doseUnit: true },
      },
    },
  });

  const substancesByProtocol = new Map<string, typeof protocolSubstances>();
  protocolSubstances.forEach((ps) => {
    if (!substancesByProtocol.has(ps.protocolId)) {
      substancesByProtocol.set(ps.protocolId, []);
    }
    substancesByProtocol.get(ps.protocolId)!.push(ps);
  });

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

  const doses = await prisma.dose.findMany({
    where: {
      patientId,
      loggedAt: { gte: startDate, lte: endDate },
    },
    include: {
      substance: { select: { name: true } },
      product: { select: { name: true } },
    },
    orderBy: { loggedAt: "desc" },
    take: 5000,
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
      substance: { name: dose.substance.name },
      product: dose.product,
    })),
  };
}

function renderHeader(
  doc: PDFKit.PDFDocument,
  data: PatientExportData,
  dateRange: DateRange,
): void {
  doc.fontSize(20).text("Medical Report - LogMyDose", { align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(10).fillColor("#666666").text("Patient Health Data Export", { align: "center" });
  doc.fillColor("#000000");
  doc.moveDown(2);

  doc.fontSize(14).text("Patient Information", { underline: true });
  doc.moveDown(0.5);

  const fullName =
    `${data.patient.firstName || ""} ${data.patient.lastName || ""}`.trim() || "Patient Export";
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

function renderProtocolSection(
  doc: PDFKit.PDFDocument,
  protocols: PatientExportData["protocols"],
): void {
  doc.fontSize(16).text("Active Protocols", { underline: true });
  doc.moveDown(1);

  if (protocols.length === 0) {
    doc.fontSize(10).fillColor("#666666").text("No protocols found during this period.");
    doc.fillColor("#000000");
    doc.moveDown(2);
    return;
  }

  protocols.forEach((protocol, index) => {
    doc.fontSize(12).text(`Protocol ${index + 1}`);
    doc.moveDown(0.3);

    doc.fontSize(10);
    doc.text(`Status: ${protocol.status.toUpperCase()}`);
    doc.text(`Source: ${protocol.source}`);

    if (protocol.startDate) {
      doc.text(`Start Date: ${new Date(protocol.startDate).toLocaleDateString("en-US")}`);
    }

    if (protocol.endDate) {
      doc.text(`End Date: ${new Date(protocol.endDate).toLocaleDateString("en-US")}`);
    }

    if (protocol.notes) {
      doc.text(`Notes: ${protocol.notes}`);
    }

    doc.moveDown(0.5);

    if (protocol.substances.length > 0) {
      doc.fontSize(11).text("Substances:", { underline: true });
      doc.moveDown(0.3);

      protocol.substances.forEach((ps) => {
        const doseStr = `${ps.dose} ${ps.doseUnit || ps.substance.doseUnit || "units"}`;
        const frequencyStr = ps.frequency || "as needed";
        doc.fontSize(10).text(`  • ${ps.substance.name}: ${doseStr}, ${frequencyStr}`);
      });

      doc.moveDown(1);
    }

    if (index < protocols.length - 1) {
      doc.moveDown(0.5);
    }
  });

  doc.moveDown(2);
}

function renderDoseHistorySection(
  doc: PDFKit.PDFDocument,
  doses: PatientExportData["doses"],
): void {
  doc.fontSize(16).text("Dose History", { underline: true });
  doc.moveDown(1);

  if (doses.length === 0) {
    doc.fontSize(10).fillColor("#666666").text("No doses logged during this period.");
    doc.fillColor("#000000");
    doc.moveDown(2);
    return;
  }

  if (doses.length >= 5000) {
    doc.fontSize(9).fillColor("#cc0000")
      .text("Note: Showing first 5000 doses. Please use a shorter date range for complete history.");
    doc.fillColor("#000000");
    doc.moveDown(0.5);
  }

  doc.fontSize(10).text(`Total Doses: ${doses.length}`);
  doc.moveDown(1);

  const tableTop = doc.y;
  const colWidths = { date: 70, time: 50, substance: 100, dose: 60, site: 60, status: 50 };

  doc.fontSize(9).fillColor("#000000");
  let xPos = 50;

  doc.text("Date", xPos, tableTop, { width: colWidths.date, continued: false });
  xPos += colWidths.date;
  doc.text("Time", xPos, tableTop, { width: colWidths.time, continued: false });
  xPos += colWidths.time;
  doc.text("Substance", xPos, tableTop, { width: colWidths.substance, continued: false });
  xPos += colWidths.substance;
  doc.text("Dose", xPos, tableTop, { width: colWidths.dose, continued: false });
  xPos += colWidths.dose;
  doc.text("Site", xPos, tableTop, { width: colWidths.site, continued: false });
  xPos += colWidths.site;
  doc.text("Status", xPos, tableTop, { width: colWidths.status, continued: false });

  doc.moveDown(0.2);
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.3);

  doses.forEach((dose, index) => {
    if (doc.y > 700) {
      doc.addPage();
      doc.fontSize(9);
    }

    const rowY = doc.y;
    xPos = 50;

    const dateStr = new Date(dose.loggedAt).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
    doc.text(dateStr, xPos, rowY, { width: colWidths.date, continued: false });
    xPos += colWidths.date;

    const timeStr = new Date(dose.loggedAt).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    doc.text(timeStr, xPos, rowY, { width: colWidths.time, continued: false });
    xPos += colWidths.time;

    const substanceName = dose.product?.name || dose.substance.name || "Unknown";
    doc.text(substanceName.substring(0, 20), xPos, rowY, {
      width: colWidths.substance,
      continued: false,
    });
    xPos += colWidths.substance;

    const doseStr = `${dose.dose} ${dose.doseUnit || ""}`.trim();
    doc.text(doseStr, xPos, rowY, { width: colWidths.dose, continued: false });
    xPos += colWidths.dose;

    const site = dose.administrationSite ? dose.administrationSite.substring(0, 10) : "-";
    doc.text(site, xPos, rowY, { width: colWidths.site, continued: false });
    xPos += colWidths.site;

    const status = dose.status || "taken";
    doc.text(status, xPos, rowY, { width: colWidths.status, continued: false });

    doc.moveDown(0.5);

    if (dose.notes) {
      doc.fontSize(8).fillColor("#666666").text(`  Note: ${dose.notes.substring(0, 100)}`, { indent: 50 });
      doc.fontSize(9).fillColor("#000000");
      doc.moveDown(0.3);
    }

    if ((index + 1) % 5 === 0 && index < doses.length - 1) {
      doc.strokeColor("#eeeeee").moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.strokeColor("#000000");
      doc.moveDown(0.2);
    }
  });

  doc.moveDown(2);
}

function renderFooter(doc: PDFKit.PDFDocument): void {
  if (doc.y > 650) {
    doc.addPage();
  }

  doc.moveDown(2);
  doc.fontSize(12).fillColor("#000000").text("Medical Disclaimer", { underline: true });
  doc.moveDown(0.5);

  doc.fontSize(9).fillColor("#333333").text(
    "This report is for informational purposes only and is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition or treatment.",
    { align: "justify" },
  );

  doc.moveDown(0.5);
  doc.text(
    "The information in this report is self-reported by the patient and has not been verified by a healthcare professional. LogMyDose is a tracking platform and does not provide medical advice or recommendations.",
    { align: "justify" },
  );

  doc.moveDown(1);
  doc.fontSize(8).fillColor("#666666").text(
    "Generated by LogMyDose © " + new Date().getFullYear(),
    { align: "center" },
  );
  doc.fillColor("#000000");
}

async function generatePdf(
  exportData: PatientExportData,
  dateRange: DateRange,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "LETTER",
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        info: {
          Title: "Medical Report - LogMyDose",
          Author: "LogMyDose",
          Subject: "Patient Health Data Export",
        },
      });

      const chunks: Buffer[] = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (error) => reject(error));

      renderHeader(doc, exportData, dateRange);
      renderProtocolSection(doc, exportData.protocols);
      renderDoseHistorySection(doc, exportData.doses);
      renderFooter(doc);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

async function uploadToS3(buffer: Buffer, key: string): Promise<string> {
  if (!s3Config) {
    throw new Error("S3 not configured");
  }

  const command = new PutObjectCommand({
    Bucket: s3Config.bucket,
    Key: key,
    Body: buffer,
    ContentType: "application/pdf",
  });

  await s3Config.client.send(command);
  return key;
}

async function processPdfExportJob(job: Job): Promise<void> {
  console.log(`[PDF Export Worker] Processing job: ${job.name} (${job.id})`);

  if (job.name !== PDF_EXPORT_JOB_TYPES.PATIENT_REPORT) {
    throw new Error(`Unknown PDF export job type: ${job.name}`);
  }

  const payload = pdfExportPatientReportSchema.parse(job.data);
  const { exportJobId, patientId, startDate, endDate } = payload;

  try {
    // Update status to processing
    await prisma.exportJob.update({
      where: { id: exportJobId },
      data: { status: "processing", attempts: { increment: 1 } },
    });

    // Fetch export data
    const exportData = await getExportData(
      patientId,
      new Date(startDate),
      new Date(endDate + "T23:59:59.999Z"),
    );

    // Generate PDF
    const pdfBuffer = await generatePdf(exportData, {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    // Generate unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `export_${patientId}_${timestamp}.pdf`;
    const s3Key = `exports/${patientId}/${fileName}`;

    // Upload to S3
    await uploadToS3(pdfBuffer, s3Key);

    // Update job status
    await prisma.exportJob.update({
      where: { id: exportJobId },
      data: {
        status: "completed",
        fileUrl: s3Key,
        fileName,
        fileSize: pdfBuffer.length,
      },
    });

    console.log(`[PDF Export Worker] Job ${job.id} completed: ${fileName} (${pdfBuffer.length} bytes)`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`[PDF Export Worker] Job ${job.id} failed:`, errorMessage);

    await prisma.exportJob.update({
      where: { id: exportJobId },
      data: {
        status: "failed",
        error: errorMessage,
      },
    });

    throw error;
  }
}

export function createPdfExportWorker(): Worker {
  const worker = new Worker(QUEUE_NAMES.PDF_EXPORT, processPdfExportJob, {
    connection: redis,
    concurrency: env.WORKER_CONCURRENCY,
  });

  worker.on("completed", (job) => {
    console.log(`[PDF Export Worker] Job ${job.id} completed successfully`);
  });

  worker.on("failed", (job, err) => {
    console.error(`[PDF Export Worker] Job ${job?.id} failed:`, err.message);
  });

  worker.on("error", (err) => {
    console.error("[PDF Export Worker] Worker error:", err.message);
  });

  return worker;
}
