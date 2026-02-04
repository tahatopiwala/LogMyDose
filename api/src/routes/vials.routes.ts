import { Router } from "express";
import { z } from "zod";
import { getContainer } from "../container/index.js";
import { authenticate, requirePatient } from "../middleware/auth.js";
import { paginationSchema } from "../types/index.js";

const router = Router();

// Validation schemas
const createVialSchema = z.object({
  productId: z.string().uuid(),
  vialAmountMcg: z.number().positive().optional(),
  lotNumber: z.string().max(100).optional(),
  manufacturerExpDate: z.string().datetime().optional(),
  storageLocation: z.string().max(100).optional(),
  requiresRefrigeration: z.boolean().optional(),
  notes: z.string().optional(),
});

const updateVialSchema = z.object({
  lotNumber: z.string().max(100).optional(),
  manufacturerExpDate: z.string().datetime().optional(),
  storageLocation: z.string().max(100).optional(),
  requiresRefrigeration: z.boolean().optional(),
  notes: z.string().optional(),
  status: z.enum(["active", "depleted", "expired", "disposed"]).optional(),
});

const reconstitutionSchema = z.object({
  diluentType: z.enum(["bacteriostatic_water", "saline", "sterile_water"]),
  diluentVolumeMl: z.number().positive(),
});

const getVialsQuerySchema = paginationSchema.extend({
  productId: z.string().uuid().optional(),
  status: z.string().optional(),
  substanceId: z.string().uuid().optional(),
});

// ============================================
// Vial Endpoints
// ============================================

// POST /api/v1/vials - Create a new vial
router.post("/", authenticate, requirePatient, async (req, res, next) => {
  try {
    const data = createVialSchema.parse(req.body);
    const vialService = getContainer().vialService;

    const vial = await vialService.createVial(req.user!.id, data);

    res.status(201).json({ vial });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/vials - List patient's vials
router.get("/", authenticate, requirePatient, async (req, res, next) => {
  try {
    const query = getVialsQuerySchema.parse(req.query);
    const vialService = getContainer().vialService;

    const result = await vialService.getVials(req.user!.id, query);

    res.json({
      vials: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/vials/active - Get all active vials for the patient
router.get("/active", authenticate, requirePatient, async (req, res, next) => {
  try {
    const vialService = getContainer().vialService;
    const vials = await vialService.getActiveVials(req.user!.id);

    res.json({ vials });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/vials/active/product/:productId - Get active vials for a specific product
router.get(
  "/active/product/:productId",
  authenticate,
  requirePatient,
  async (req, res, next) => {
    try {
      const productId = req.params.productId as string;
      const vialService = getContainer().vialService;

      const vials = await vialService.getActiveVialsByProduct(
        req.user!.id,
        productId,
      );

      res.json({ vials });
    } catch (error) {
      next(error);
    }
  },
);

// GET /api/v1/vials/:id - Get a specific vial
router.get("/:id", authenticate, requirePatient, async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const vialService = getContainer().vialService;

    const vial = await vialService.getVialById(id, req.user!.id);

    res.json({ vial });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/vials/:id - Update a vial
router.put("/:id", authenticate, requirePatient, async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const data = updateVialSchema.parse(req.body);
    const vialService = getContainer().vialService;

    const vial = await vialService.updateVial(id, req.user!.id, data);

    res.json({ vial });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/vials/:id/reconstitute - Reconstitute a vial
router.post(
  "/:id/reconstitute",
  authenticate,
  requirePatient,
  async (req, res, next) => {
    try {
      const id = req.params.id as string;
      const data = reconstitutionSchema.parse(req.body);
      const vialService = getContainer().vialService;

      const vial = await vialService.reconstitute(id, req.user!.id, data);

      res.json({ vial });
    } catch (error) {
      next(error);
    }
  },
);

// POST /api/v1/vials/:id/depleted - Mark a vial as depleted
router.post(
  "/:id/depleted",
  authenticate,
  requirePatient,
  async (req, res, next) => {
    try {
      const id = req.params.id as string;
      const vialService = getContainer().vialService;

      const vial = await vialService.markDepleted(id, req.user!.id);

      res.json({ vial });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
