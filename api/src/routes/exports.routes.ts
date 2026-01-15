import { Router } from "express";
import { z } from "zod";
import { getContainer } from "../container/index.js";
import { authenticate, requirePatient } from "../middleware/auth.js";
import { requireProSubscription } from "../middleware/subscription.js";
import { AppError } from "../middleware/errorHandler.js";
import { createAuditLog } from "../middleware/auditLog.js";

const router = Router();

const createExportSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
});

// POST /api/v1/exports - Create a new export job
router.post(
  "/",
  authenticate,
  requirePatient,
  requireProSubscription,
  async (req, res, next) => {
    try {
      const result = createExportSchema.safeParse(req.body);
      if (!result.success) {
        throw new AppError(
          400,
          "Invalid request: startDate and endDate are required in YYYY-MM-DD format",
          "INVALID_REQUEST",
        );
      }

      const { startDate, endDate } = result.data;
      const patientId = req.user!.id;

      const exportJobService = getContainer().exportJobService;
      const job = await exportJobService.createExportJob(
        patientId,
        new Date(startDate),
        new Date(endDate),
      );

      await createAuditLog(req, {
        action: "export.create",
        tableName: "export_jobs",
        recordId: job.id,
        newValues: { startDate, endDate },
      });

      res.status(201).json({
        job: {
          id: job.id,
          status: job.status,
          startDate: job.startDate,
          endDate: job.endDate,
          createdAt: job.createdAt,
          expiresAt: job.expiresAt,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// GET /api/v1/exports - List all exports for current patient
router.get(
  "/",
  authenticate,
  requirePatient,
  async (req, res, next) => {
    try {
      const status = typeof req.query.status === "string" ? req.query.status : undefined;
      const patientId = req.user!.id;

      const exportJobService = getContainer().exportJobService;
      const jobs = await exportJobService.getActiveJobs(
        patientId,
        status,
      );

      res.json({
        jobs: jobs.map((job) => ({
          id: job.id,
          status: job.status,
          startDate: job.startDate,
          endDate: job.endDate,
          fileName: job.fileName,
          fileSize: job.fileSize,
          error: job.error,
          createdAt: job.createdAt,
          expiresAt: job.expiresAt,
        })),
      });
    } catch (error) {
      next(error);
    }
  },
);

// GET /api/v1/exports/:jobId - Get specific export status with download URL
router.get(
  "/:jobId",
  authenticate,
  requirePatient,
  async (req, res, next) => {
    try {
      const jobId = req.params.jobId as string;
      const patientId = req.user!.id;

      const exportJobService = getContainer().exportJobService;

      try {
        const job = await exportJobService.getJobStatus(jobId, patientId);

        res.json({
          job: {
            id: job.id,
            status: job.status,
            startDate: job.startDate,
            endDate: job.endDate,
            fileName: job.fileName,
            fileSize: job.fileSize,
            downloadUrl: job.downloadUrl,
            error: job.error,
            createdAt: job.createdAt,
            expiresAt: job.expiresAt,
          },
        });
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === "Export job not found") {
            throw new AppError(404, "Export job not found", "NOT_FOUND");
          }
          if (error.message === "Unauthorized access to export job") {
            throw new AppError(403, "Unauthorized access to export job", "FORBIDDEN");
          }
        }
        throw error;
      }
    } catch (error) {
      next(error);
    }
  },
);

export default router;
