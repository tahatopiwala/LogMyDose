import { Router } from "express";
import { getContainer } from "../container/index.js";
import { paginationSchema } from "../types/index.js";

const router = Router();

// GET /api/v1/substances/categories
router.get("/categories", async (_req, res, next) => {
  try {
    const substanceService = getContainer().substanceService;
    const categories = await substanceService.getCategories();

    res.json({ categories });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/substances
router.get("/", async (req, res, next) => {
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
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const substanceService = getContainer().substanceService;

    const substance = await substanceService.getSubstanceById(id);

    res.json({ substance });
  } catch (error) {
    next(error);
  }
});

export default router;
