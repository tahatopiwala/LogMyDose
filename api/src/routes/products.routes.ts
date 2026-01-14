import { Router } from "express";
import { z } from "zod";
import { getContainer } from "../container/index.js";
import { authenticate, requirePatient, requireSuperAdmin } from "../middleware/auth.js";
import { paginationSchema } from "../types/index.js";

const router = Router();

// Validation schemas
const createProductSchema = z.object({
  substanceId: z.string().uuid(),
  name: z.string().min(1).max(255),
  defaultDose: z.number().positive().optional(),
  doseUnit: z.string().max(20).optional(),
});

const updateProductSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  defaultDose: z.number().positive().optional(),
  doseUnit: z.string().max(20).optional(),
  isActive: z.boolean().optional(),
});

// ============================================
// Patient Endpoints
// ============================================

// GET /api/v1/products - List products visible to patient (global + own custom)
router.get("/", authenticate, requirePatient, async (req, res, next) => {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    const { substanceId, search } = req.query;

    const productService = getContainer().productService;
    const result = await productService.getProductsForPatient(req.user!.id, {
      page,
      limit,
      substanceId: substanceId as string,
      search: search as string,
    });

    res.json({
      products: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/products/by-substance/:substanceId - Get products for a substance
router.get(
  "/by-substance/:substanceId",
  authenticate,
  requirePatient,
  async (req, res, next) => {
    try {
      const substanceId = req.params.substanceId as string;

      const productService = getContainer().productService;
      const products = await productService.getProductsBySubstanceForPatient(
        substanceId,
        req.user!.id,
      );

      res.json({ products });
    } catch (error) {
      next(error);
    }
  },
);

// GET /api/v1/products/:id - Get single product
router.get("/:id", authenticate, async (req, res, next) => {
  try {
    const id = req.params.id as string;

    const productService = getContainer().productService;
    const product = await productService.getProductById(id);

    res.json({ product });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/products - Create custom product (patient)
router.post("/", authenticate, requirePatient, async (req, res, next) => {
  try {
    const data = createProductSchema.parse(req.body);
    const productService = getContainer().productService;

    const product = await productService.createCustomProduct(req.user!.id, data);

    res.status(201).json({ product });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/products/:id - Update own custom product (patient)
router.put("/:id", authenticate, requirePatient, async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const data = updateProductSchema.parse(req.body);

    const productService = getContainer().productService;
    const product = await productService.updateCustomProduct(
      id,
      req.user!.id,
      data,
    );

    res.json({ product });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/products/:id - Delete own custom product (patient)
router.delete("/:id", authenticate, requirePatient, async (req, res, next) => {
  try {
    const id = req.params.id as string;

    const productService = getContainer().productService;
    await productService.deleteCustomProduct(id, req.user!.id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// ============================================
// Admin Endpoints
// ============================================

// GET /api/v1/products/admin/global - List all global products
router.get(
  "/admin/global",
  authenticate,
  requireSuperAdmin,
  async (req, res, next) => {
    try {
      const { page, limit } = paginationSchema.parse(req.query);
      const { substanceId, search } = req.query;

      const productService = getContainer().productService;
      const result = await productService.getGlobalProducts({
        page,
        limit,
        substanceId: substanceId as string,
        search: search as string,
      });

      res.json({
        products: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  },
);

// POST /api/v1/products/admin/global - Create global product
router.post(
  "/admin/global",
  authenticate,
  requireSuperAdmin,
  async (req, res, next) => {
    try {
      const data = createProductSchema.parse(req.body);

      const productService = getContainer().productService;
      const product = await productService.createGlobalProduct(data);

      res.status(201).json({ product });
    } catch (error) {
      next(error);
    }
  },
);

// PUT /api/v1/products/admin/global/:id - Update global product
router.put(
  "/admin/global/:id",
  authenticate,
  requireSuperAdmin,
  async (req, res, next) => {
    try {
      const id = req.params.id as string;
      const data = updateProductSchema.parse(req.body);

      const productService = getContainer().productService;
      const product = await productService.updateGlobalProduct(id, data);

      res.json({ product });
    } catch (error) {
      next(error);
    }
  },
);

// DELETE /api/v1/products/admin/global/:id - Delete global product
router.delete(
  "/admin/global/:id",
  authenticate,
  requireSuperAdmin,
  async (req, res, next) => {
    try {
      const id = req.params.id as string;

      const productService = getContainer().productService;
      await productService.deleteGlobalProduct(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
