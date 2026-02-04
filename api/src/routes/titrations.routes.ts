import { Router } from "express";
import { z } from "zod";
import { getContainer } from "../container/index.js";
import { authenticate, requirePatient } from "../middleware/auth.js";

const router = Router();

// Validation schemas
const startTitrationSchema = z.object({
  protocolSubstanceId: z.string().uuid(),
  planName: z.string().optional(),
  customSteps: z
    .array(
      z.object({
        doseAmount: z.number().positive(),
        doseUnit: z.string(),
        weeksAtDose: z.number().int().min(1).max(52),
        isMaintenance: z.boolean().optional(),
      })
    )
    .optional(),
  startDate: z.string().datetime().optional(),
  notes: z.string().optional(),
});

const updateTitrationSchema = z.object({
  weeksAtDose: z.number().int().min(1).max(52).optional(),
  notes: z.string().optional(),
});

const advancePhaseSchema = z.object({
  reason: z
    .enum(["scheduled", "tolerability", "side_effects", "plateau", "custom"])
    .optional(),
  notes: z.string().optional(),
  customDose: z.number().positive().optional(),
  customWeeks: z.number().int().min(1).max(52).optional(),
});

const getTitrationQuerySchema = z.object({
  protocolSubstanceId: z.string().uuid().optional(),
});

// ============================================
// Titration Endpoints
// ============================================

// GET /api/v1/titrations/plans - Get available standard titration plans
router.get("/plans", authenticate, requirePatient, async (_req, res, next) => {
  try {
    const titrationService = getContainer().titrationService;

    const plans = titrationService.getAvailablePlans();

    res.json({ plans });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/titrations - Start a new titration
router.post("/", authenticate, requirePatient, async (req, res, next) => {
  try {
    const data = startTitrationSchema.parse(req.body);
    const titrationService = getContainer().titrationService;

    const phases = await titrationService.startTitration(req.user!.id, data);

    res.status(201).json({ phases, message: "Titration started" });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/titrations - List titration phases
router.get("/", authenticate, requirePatient, async (req, res, next) => {
  try {
    const query = getTitrationQuerySchema.parse(req.query);
    const titrationService = getContainer().titrationService;

    const phases = await titrationService.getTitrationPhases(
      req.user!.id,
      query.protocolSubstanceId
    );

    res.json({ phases });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/titrations/summary - Get titration summary
router.get("/summary", authenticate, requirePatient, async (req, res, next) => {
  try {
    const titrationService = getContainer().titrationService;

    const summary = await titrationService.getTitrationSummary(req.user!.id);

    res.json({ summary });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/titrations/progress/:protocolSubstanceId - Get titration progress
router.get(
  "/progress/:protocolSubstanceId",
  authenticate,
  requirePatient,
  async (req, res, next) => {
    try {
      const protocolSubstanceId = req.params.protocolSubstanceId as string;
      const titrationService = getContainer().titrationService;

      const progress = await titrationService.getTitrationProgress(
        protocolSubstanceId,
        req.user!.id
      );

      if (!progress) {
        return res.json({ progress: null });
      }

      res.json({ progress });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/v1/titrations/active/:protocolSubstanceId - Get active phase
router.get(
  "/active/:protocolSubstanceId",
  authenticate,
  requirePatient,
  async (req, res, next) => {
    try {
      const protocolSubstanceId = req.params.protocolSubstanceId as string;
      const titrationService = getContainer().titrationService;

      const phase = await titrationService.getActivePhase(
        protocolSubstanceId,
        req.user!.id
      );

      res.json({ phase });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/v1/titrations/:id - Get a specific phase
router.get("/:id", authenticate, requirePatient, async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const titrationService = getContainer().titrationService;

    const phase = await titrationService.getTitrationPhaseById(id, req.user!.id);

    if (!phase) {
      return res.status(404).json({ error: "Titration phase not found" });
    }

    res.json({ phase });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/titrations/:id - Update a phase
router.put("/:id", authenticate, requirePatient, async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const data = updateTitrationSchema.parse(req.body);
    const titrationService = getContainer().titrationService;

    const phase = await titrationService.updatePhase(id, req.user!.id, data);

    res.json({ phase });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/titrations/:protocolSubstanceId/advance - Advance to next phase
router.post(
  "/:protocolSubstanceId/advance",
  authenticate,
  requirePatient,
  async (req, res, next) => {
    try {
      const protocolSubstanceId = req.params.protocolSubstanceId as string;
      const data = advancePhaseSchema.parse(req.body);
      const titrationService = getContainer().titrationService;

      const phase = await titrationService.advanceToNextPhase(
        protocolSubstanceId,
        req.user!.id,
        data
      );

      res.json({ phase, message: "Advanced to next phase" });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/v1/titrations/:id/skip - Skip a phase
router.post(
  "/:id/skip",
  authenticate,
  requirePatient,
  async (req, res, next) => {
    try {
      const id = req.params.id as string;
      const { notes } = req.body;
      const titrationService = getContainer().titrationService;

      const phase = await titrationService.skipPhase(id, req.user!.id, notes);

      res.json({ phase, message: "Phase skipped" });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/v1/titrations/:id - Delete a phase
router.delete("/:id", authenticate, requirePatient, async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const titrationService = getContainer().titrationService;

    // Verify ownership
    await titrationService.getTitrationPhaseById(id, req.user!.id);

    // Delete via repository
    const titrationRepository = getContainer().titrationRepository;
    await titrationRepository.delete(id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
