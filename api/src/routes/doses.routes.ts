import { Router } from "express";
import { z } from "zod";
import { getContainer } from "../container/index.js";
import { authenticate, requirePatient } from "../middleware/auth.js";
import { createAuditLog } from "../middleware/auditLog.js";

const router = Router();

// Validation schemas
const logDoseSchema = z.object({
  protocolSubstanceId: z.string().uuid().optional(),
  substanceId: z.string().uuid(),
  dose: z.number().positive(),
  doseUnit: z.string().max(20).optional(),
  scheduledAt: z.string().optional(),
  status: z.enum(["taken", "missed", "skipped"]).default("taken"),
  administrationSite: z.string().max(50).optional(),
  notes: z.string().optional(),
  photoUrl: z.string().url().optional(),
});

const logSideEffectSchema = z.object({
  doseId: z.string().uuid().optional(),
  substanceId: z.string().uuid().optional(),
  symptom: z.string().min(1).max(100),
  severity: z.number().int().min(1).max(10),
  durationHours: z.number().positive().optional(),
  notes: z.string().optional(),
});

const updateDoseSchema = z.object({
  status: z.enum(["taken", "missed", "skipped"]).optional(),
  administrationSite: z.string().max(50).optional(),
  notes: z.string().optional(),
});

// POST /api/v1/doses
router.post("/", authenticate, requirePatient, async (req, res, next) => {
  try {
    const data = logDoseSchema.parse(req.body);
    const doseService = getContainer().doseService;

    const dose = await doseService.logDose(req.user!.id, data);

    await createAuditLog(req, {
      action: "dose.log",
      tableName: "doses",
      recordId: dose.id,
      newValues: {
        substanceId: data.substanceId,
        dose: data.dose,
        status: data.status,
      },
    });

    res.status(201).json({ dose });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/doses
router.get("/", authenticate, requirePatient, async (req, res, next) => {
  try {
    const { page, limit, substanceId, status, startDate, endDate } = req.query;
    const doseService = getContainer().doseService;

    const result = await doseService.getDoses(req.user!.id, {
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      substanceId: substanceId as string,
      status: status as string,
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

// GET /api/v1/doses/today
router.get("/today", authenticate, requirePatient, async (req, res, next) => {
  try {
    const doseService = getContainer().doseService;
    const doses = await doseService.getTodayDoses(req.user!.id);

    res.json({ doses });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/doses/side-effects
router.get(
  "/side-effects",
  authenticate,
  requirePatient,
  async (req, res, next) => {
    try {
      const { page, limit, substanceId, minSeverity } = req.query;
      const doseService = getContainer().doseService;

      const result = await doseService.getSideEffects(req.user!.id, {
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        substanceId: substanceId as string,
        minSeverity: minSeverity ? parseInt(minSeverity as string) : undefined,
      });

      res.json({
        sideEffects: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  },
);

// GET /api/v1/doses/stats
router.get("/stats", authenticate, requirePatient, async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const doseService = getContainer().doseService;

    const stats = await doseService.getStats(req.user!.id, {
      startDate: startDate as string,
      endDate: endDate as string,
    });

    res.json({ stats });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/doses/:id
router.get("/:id", authenticate, requirePatient, async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const doseService = getContainer().doseService;

    const dose = await doseService.getDoseById(id, req.user!.id);

    res.json({ dose });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/doses/:id
router.put("/:id", authenticate, requirePatient, async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const data = updateDoseSchema.parse(req.body);
    const doseService = getContainer().doseService;

    const dose = await doseService.updateDose(id, req.user!.id, data);

    await createAuditLog(req, {
      action: "dose.update",
      tableName: "doses",
      recordId: dose.id,
      newValues: data as Record<string, unknown>,
    });

    res.json({ dose });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/doses/side-effects
router.post(
  "/side-effects",
  authenticate,
  requirePatient,
  async (req, res, next) => {
    try {
      const data = logSideEffectSchema.parse(req.body);
      const doseService = getContainer().doseService;

      const sideEffect = await doseService.logSideEffect(req.user!.id, data);

      await createAuditLog(req, {
        action: "side_effect.log",
        tableName: "side_effects",
        recordId: sideEffect.id,
        newValues: { symptom: data.symptom, severity: data.severity },
      });

      res.status(201).json({ sideEffect });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
