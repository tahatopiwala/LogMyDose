import { Router } from "express";
import { z } from "zod";
import { Prisma } from "@biostak/shared/prisma";
import { getContainer } from "../container/index.js";
import { authenticate, requirePatient } from "../middleware/auth.js";
import { AppError } from "../middleware/errorHandler.js";
import { createAuditLog } from "../middleware/auditLog.js";

const router = Router();

// Validation schemas
const updatePatientSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  dateOfBirth: z.string().optional(),
  phone: z.string().max(20).optional(),
  settings: z.record(z.string(), z.unknown()).optional(),
});

// GET /api/v1/patients/me
router.get("/me", authenticate, requirePatient, async (req, res, next) => {
  try {
    const patientService = getContainer().patientService;
    const patient = await patientService.getProfile(req.user!.id);

    if (!patient) {
      throw new AppError(404, "Patient not found", "NOT_FOUND");
    }

    res.json({ patient });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/patients/me
router.put("/me", authenticate, requirePatient, async (req, res, next) => {
  try {
    const data = updatePatientSchema.parse(req.body);
    const patientService = getContainer().patientService;

    const patient = await patientService.updateProfile(req.user!.id, {
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      phone: data.phone,
      settings: data.settings as Prisma.InputJsonValue,
    });

    await createAuditLog(req, {
      action: "patient.update",
      tableName: "patients",
      recordId: patient.id,
      newValues: data as Record<string, unknown>,
    });

    res.json({ patient });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/patients/protocols
router.get(
  "/protocols",
  authenticate,
  requirePatient,
  async (req, res, next) => {
    try {
      const patientService = getContainer().patientService;
      const protocols = await patientService.getProtocols(req.user!.id);

      res.json({ protocols });
    } catch (error) {
      next(error);
    }
  },
);

// GET /api/v1/patients/doses
router.get("/doses", authenticate, requirePatient, async (req, res, next) => {
  try {
    const { page, limit, startDate, endDate } = req.query;
    const patientService = getContainer().patientService;

    const result = await patientService.getDoses(req.user!.id, {
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      startDate: startDate as string,
      endDate: endDate as string,
    });

    res.json({
      doses: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/patients/alerts
router.get("/alerts", authenticate, requirePatient, async (req, res, next) => {
  try {
    const patientService = getContainer().patientService;
    const alerts = await patientService.getAlerts(req.user!.id);

    res.json({ alerts });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/patients/me/export - Queue async PDF export (deprecated, use POST /api/v1/exports)
const exportBodySchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
});

router.post(
  "/me/export",
  authenticate,
  requirePatient,
  async (req, res, next) => {
    try {
      const container = getContainer();
      const patientService = container.patientService;
      const patientRepository = container.patientRepository;
      const exportJobService = container.exportJobService;

      // Check Pro subscription
      const patient = await patientRepository.findById(req.user!.id);
      if (!patient) {
        throw new AppError(404, "Patient not found", "NOT_FOUND");
      }
      patientService.validateProSubscription(patient);

      // Validate body parameters
      const result = exportBodySchema.safeParse(req.body);
      if (!result.success) {
        throw new AppError(
          400,
          "Invalid request: startDate and endDate are required in YYYY-MM-DD format",
          "INVALID_REQUEST",
        );
      }

      const { startDate, endDate } = result.data;
      const patientId = req.user!.id;

      // Queue the export job
      const job = await exportJobService.createExportJob(
        patientId,
        new Date(startDate),
        new Date(endDate),
      );

      res.status(202).json({
        message: "Export job queued successfully",
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

export default router;
