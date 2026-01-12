import { Router } from 'express';
import { z } from 'zod';
import { getContainer } from '../container/index.js';
import { authenticate, requireSuperAdmin } from '../middleware/auth.js';
import { paginationSchema } from '../types/index.js';

const router = Router();

// Validation schemas
const createSubstanceSchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(1).max(100),
  aliases: z.array(z.string()).optional(),
  subcategory: z.string().max(100).optional(),
  defaultDose: z.number().positive().optional(),
  doseUnit: z.string().max(20).optional(),
  defaultFrequency: z.string().max(50).optional(),
  administrationRoute: z.string().max(50).optional(),
  preparationInstructions: z.string().optional(),
  storageTemp: z.string().max(50).optional(),
  storageNotes: z.string().optional(),
  shelfLifeDays: z.number().int().positive().optional(),
  shelfLifeReconstitutedDays: z.number().int().positive().optional(),
  requiresCycling: z.boolean().optional(),
  commonCycleOnWeeks: z.number().int().positive().optional(),
  commonCycleOffWeeks: z.number().int().positive().optional(),
  contraindications: z.array(z.string()).optional(),
  commonSideEffects: z.array(z.string()).optional(),
  interactions: z.array(z.string()).optional(),
  onsetTimeline: z.string().max(100).optional(),
  isPrescriptionRequired: z.boolean().optional(),
});

// GET /api/v1/substances/categories
router.get('/categories', async (_req, res, next) => {
  try {
    const substanceService = getContainer().substanceService;
    const categories = await substanceService.getCategories();

    res.json({ categories });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/substances
router.get('/', async (req, res, next) => {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    const { categoryId, subcategory, search } = req.query;

    const substanceService = getContainer().substanceService;
    const result = await substanceService.getSubstances({
      page,
      limit,
      categoryId: categoryId as string,
      subcategory: subcategory as string,
      search: search as string,
    });

    res.json({
      substances: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/substances/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const substanceService = getContainer().substanceService;

    const substance = await substanceService.getSubstanceById(id);

    res.json({ substance });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/substances (super admin only)
router.post('/', authenticate, requireSuperAdmin, async (req, res, next) => {
  try {
    const data = createSubstanceSchema.parse(req.body);
    const substanceService = getContainer().substanceService;

    const substance = await substanceService.createSubstance(data);

    res.status(201).json({ substance });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/substances/:id (super admin only)
router.put('/:id', authenticate, requireSuperAdmin, async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const data = createSubstanceSchema.partial().parse(req.body);

    const substanceService = getContainer().substanceService;
    const substance = await substanceService.updateSubstance(id, data);

    res.json({ substance });
  } catch (error) {
    next(error);
  }
});

export default router;
