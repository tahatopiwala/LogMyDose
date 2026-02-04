import { Router } from "express";
import { z } from "zod";
import { getContainer } from "../container/index.js";
import { authenticate, requirePatient } from "../middleware/auth.js";

const router = Router();

// Validation schemas
const startCycleSchema = z.object({
  protocolSubstanceId: z.string().uuid(),
  startDate: z.string().datetime().optional(),
  onWeeks: z.number().int().min(1).max(52),
  offWeeks: z.number().int().min(1).max(52),
  notes: z.string().optional(),
});

const updateCycleSchema = z.object({
  onWeeks: z.number().int().min(1).max(52).optional(),
  offWeeks: z.number().int().min(1).max(52).optional(),
  notes: z.string().optional(),
});

const getCyclesQuerySchema = z.object({
  protocolSubstanceId: z.string().uuid().optional(),
});

// ============================================
// Cycle Endpoints
// ============================================

// POST /api/v1/cycles - Start a new cycle
router.post("/", authenticate, requirePatient, async (req, res, next) => {
  try {
    const data = startCycleSchema.parse(req.body);
    const cycleService = getContainer().cycleService;

    const cycle = await cycleService.startCycle(req.user!.id, data);

    res.status(201).json({ cycle });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/cycles - List patient's cycles
router.get("/", authenticate, requirePatient, async (req, res, next) => {
  try {
    const query = getCyclesQuerySchema.parse(req.query);
    const cycleService = getContainer().cycleService;

    const cycles = await cycleService.getCycles(
      req.user!.id,
      query.protocolSubstanceId,
    );

    res.json({ cycles });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/cycles/summary - Get cycle summary for patient
router.get("/summary", authenticate, requirePatient, async (req, res, next) => {
  try {
    const cycleService = getContainer().cycleService;

    const summary = await cycleService.getCycleSummary(req.user!.id);

    res.json({ summary });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/cycles/active/:protocolSubstanceId - Get active cycle for a substance
router.get(
  "/active/:protocolSubstanceId",
  authenticate,
  requirePatient,
  async (req, res, next) => {
    try {
      const protocolSubstanceId = req.params.protocolSubstanceId as string;
      const cycleService = getContainer().cycleService;

      const cycle = await cycleService.getActiveCycle(
        protocolSubstanceId,
        req.user!.id,
      );

      if (!cycle) {
        return res.json({ cycle: null });
      }

      // Calculate phase info
      const phaseInfo = cycleService.calculatePhaseInfo(cycle);

      res.json({ cycle, phaseInfo });
    } catch (error) {
      next(error);
    }
  },
);

// GET /api/v1/cycles/:id - Get a specific cycle
router.get("/:id", authenticate, requirePatient, async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const cycleService = getContainer().cycleService;

    const cycle = await cycleService.getCycleById(id, req.user!.id);

    if (!cycle) {
      return res.status(404).json({ error: "Cycle not found" });
    }

    // Calculate phase info
    const phaseInfo = cycleService.calculatePhaseInfo(cycle);

    res.json({ cycle, phaseInfo });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/cycles/:id - Update a cycle
router.put("/:id", authenticate, requirePatient, async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const data = updateCycleSchema.parse(req.body);
    const cycleService = getContainer().cycleService;

    const cycle = await cycleService.updateCycle(id, req.user!.id, data);

    res.json({ cycle });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/cycles/:id/complete - Complete a cycle
router.post(
  "/:id/complete",
  authenticate,
  requirePatient,
  async (req, res, next) => {
    try {
      const id = req.params.id as string;
      const cycleService = getContainer().cycleService;

      const cycle = await cycleService.completeCycle(id, req.user!.id);

      res.json({ cycle, message: "Cycle completed" });
    } catch (error) {
      next(error);
    }
  },
);

// DELETE /api/v1/cycles/:id - Delete a cycle
router.delete("/:id", authenticate, requirePatient, async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const cycleService = getContainer().cycleService;

    // Verify ownership through getCycleById
    await cycleService.getCycleById(id, req.user!.id);

    // Delete via repository
    const cycleRepository = getContainer().cycleRepository;
    await cycleRepository.delete(id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
