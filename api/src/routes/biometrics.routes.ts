import { Router } from "express";
import { z } from "zod";
import { getContainer } from "../container/index.js";
import { authenticate, requirePatient } from "../middleware/auth.js";
import { paginationSchema } from "../types/index.js";

const router = Router();

// Valid metric types
const metricTypes = [
  "weight",
  "blood_glucose",
  "blood_pressure_systolic",
  "blood_pressure_diastolic",
  "heart_rate",
  "body_fat_percentage",
  "sleep_quality",
  "energy_level",
  "appetite_level",
  "pain_level",
  "mood",
  "stress_level",
  "hydration",
  "steps",
  "calories_burned",
] as const;

// Validation schemas
const logBiometricSchema = z.object({
  metricType: z.enum(metricTypes),
  value: z.number(),
  unit: z.string().max(20).optional(),
  doseId: z.string().uuid().optional(),
  notes: z.string().optional(),
  recordedAt: z.string().datetime().optional(),
});

const batchLogSchema = z.object({
  entries: z.array(logBiometricSchema).min(1).max(50),
});

const getBiometricsQuerySchema = paginationSchema.extend({
  metricType: z.enum(metricTypes).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  doseId: z.string().uuid().optional(),
});

const getStatsQuerySchema = z.object({
  metricType: z.enum(metricTypes).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// ============================================
// Biometric Endpoints
// ============================================

// POST /api/v1/biometrics - Log a single biometric entry
router.post("/", authenticate, requirePatient, async (req, res, next) => {
  try {
    const data = logBiometricSchema.parse(req.body);
    const biometricService = getContainer().biometricService;

    const entry = await biometricService.logEntry(req.user!.id, data);

    res.status(201).json({ entry });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/biometrics/batch - Log multiple biometric entries
router.post("/batch", authenticate, requirePatient, async (req, res, next) => {
  try {
    const data = batchLogSchema.parse(req.body);
    const biometricService = getContainer().biometricService;

    const count = await biometricService.logBatch(req.user!.id, data);

    res.status(201).json({ count, message: `${count} entries logged` });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/biometrics - List biometric entries
router.get("/", authenticate, requirePatient, async (req, res, next) => {
  try {
    const query = getBiometricsQuerySchema.parse(req.query);
    const biometricService = getContainer().biometricService;

    const result = await biometricService.getEntries(req.user!.id, query);

    res.json({
      entries: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/biometrics/stats - Get aggregated statistics
router.get("/stats", authenticate, requirePatient, async (req, res, next) => {
  try {
    const query = getStatsQuerySchema.parse(req.query);
    const biometricService = getContainer().biometricService;

    const stats = await biometricService.getStats(req.user!.id, query);

    res.json({ stats });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/biometrics/trend/:metricType - Get trend data for a metric
router.get(
  "/trend/:metricType",
  authenticate,
  requirePatient,
  async (req, res, next) => {
    try {
      const metricType = req.params.metricType as string;
      const days = req.query.days
        ? parseInt(req.query.days as string)
        : 30;

      // Validate metric type
      if (!metricTypes.includes(metricType as (typeof metricTypes)[number])) {
        return res.status(400).json({ error: "Invalid metric type" });
      }

      const biometricService = getContainer().biometricService;
      const trend = await biometricService.getTrend(
        req.user!.id,
        metricType,
        days,
      );

      res.json({ trend, metricType, days });
    } catch (error) {
      next(error);
    }
  },
);

// GET /api/v1/biometrics/by-dose/:doseId - Get entries linked to a dose
router.get(
  "/by-dose/:doseId",
  authenticate,
  requirePatient,
  async (req, res, next) => {
    try {
      const doseId = req.params.doseId as string;
      const biometricService = getContainer().biometricService;

      const entries = await biometricService.getEntriesByDose(
        doseId,
        req.user!.id,
      );

      res.json({ entries });
    } catch (error) {
      next(error);
    }
  },
);

// GET /api/v1/biometrics/:id - Get a specific entry
router.get("/:id", authenticate, requirePatient, async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const biometricService = getContainer().biometricService;

    const entry = await biometricService.getEntryById(id, req.user!.id);

    res.json({ entry });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/biometrics/:id - Delete an entry
router.delete("/:id", authenticate, requirePatient, async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const biometricService = getContainer().biometricService;

    await biometricService.deleteEntry(id, req.user!.id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
