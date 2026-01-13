import { Router } from "express";
import { z } from "zod";
import { Prisma } from "@logmydose/shared/prisma";
import { getContainer } from "../container/index.js";
import {
  authenticate,
  requireAdmin,
  requireSuperAdmin,
} from "../middleware/auth.js";
import { AppError } from "../middleware/errorHandler.js";
import { createAuditLog } from "../middleware/auditLog.js";
import { paginationSchema } from "../types/index.js";

const router = Router();

// Validation schemas
const createTenantSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  branding: z
    .object({
      logoUrl: z.string().url().optional(),
      primaryColor: z.string().optional(),
      secondaryColor: z.string().optional(),
      appName: z.string().optional(),
    })
    .optional(),
  settings: z.record(z.unknown()).optional(),
});

const updateTenantSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  branding: z
    .object({
      logoUrl: z.string().url().optional(),
      primaryColor: z.string().optional(),
      secondaryColor: z.string().optional(),
      appName: z.string().optional(),
    })
    .optional(),
  settings: z.record(z.unknown()).optional(),
});

const createInvitationSchema = z.object({
  email: z.string().email(),
  expiresInDays: z.number().int().min(1).max(30).default(7),
});

// GET /api/v1/tenants/me
router.get("/me", authenticate, requireAdmin, async (req, res, next) => {
  try {
    if (!req.user?.tenantId) {
      throw new AppError(
        400,
        "No tenant associated with this account",
        "NO_TENANT",
      );
    }

    const tenantService = getContainer().tenantService;
    const tenant = await tenantService.getMyClinic(req.user.tenantId);

    if (!tenant) {
      throw new AppError(404, "Tenant not found", "NOT_FOUND");
    }

    res.json({ tenant });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/tenants/me
router.put("/me", authenticate, requireAdmin, async (req, res, next) => {
  try {
    if (!req.user?.tenantId) {
      throw new AppError(
        400,
        "No tenant associated with this account",
        "NO_TENANT",
      );
    }

    const data = updateTenantSchema.parse(req.body);
    const tenantService = getContainer().tenantService;

    const tenant = await tenantService.updateMyClinic(req.user.tenantId, {
      name: data.name,
      branding: data.branding as Prisma.InputJsonValue,
      settings: data.settings as Prisma.InputJsonValue,
    });

    await createAuditLog(req, {
      action: "tenant.update",
      tableName: "tenants",
      recordId: tenant.id,
      newValues: data as Record<string, unknown>,
    });

    res.json({ tenant });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/tenants/me/patients
router.get(
  "/me/patients",
  authenticate,
  requireAdmin,
  async (req, res, next) => {
    try {
      if (!req.user?.tenantId) {
        throw new AppError(
          400,
          "No tenant associated with this account",
          "NO_TENANT",
        );
      }

      const { page, limit } = paginationSchema.parse(req.query);
      const { search, status } = req.query;

      const tenantService = getContainer().tenantService;
      const result = await tenantService.getClinicPatients(req.user.tenantId, {
        page,
        limit,
        search: search as string,
        status: status as string,
      });

      res.json({
        patients: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  },
);

// POST /api/v1/tenants/me/invitations
router.post(
  "/me/invitations",
  authenticate,
  requireAdmin,
  async (req, res, next) => {
    try {
      if (!req.user?.tenantId) {
        throw new AppError(
          400,
          "No tenant associated with this account",
          "NO_TENANT",
        );
      }

      const data = createInvitationSchema.parse(req.body);
      const tenantService = getContainer().tenantService;

      const invitation = await tenantService.createInvitation(
        req.user.tenantId,
        data,
      );

      await createAuditLog(req, {
        action: "invitation.create",
        tableName: "clinic_invitations",
        recordId: invitation.id,
        newValues: { email: data.email },
      });

      res.status(201).json({ invitation });
    } catch (error) {
      next(error);
    }
  },
);

// GET /api/v1/tenants/me/invitations
router.get(
  "/me/invitations",
  authenticate,
  requireAdmin,
  async (req, res, next) => {
    try {
      if (!req.user?.tenantId) {
        throw new AppError(
          400,
          "No tenant associated with this account",
          "NO_TENANT",
        );
      }

      const tenantService = getContainer().tenantService;
      const invitations = await tenantService.getInvitations(req.user.tenantId);

      res.json({ invitations });
    } catch (error) {
      next(error);
    }
  },
);

// Super admin routes

// GET /api/v1/tenants (super admin only)
router.get("/", authenticate, requireSuperAdmin, async (req, res, next) => {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    const tenantService = getContainer().tenantService;

    const result = await tenantService.getAllTenants(page, limit);

    res.json({
      tenants: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/tenants (super admin only)
router.post("/", authenticate, requireSuperAdmin, async (req, res, next) => {
  try {
    const data = createTenantSchema.parse(req.body);
    const tenantService = getContainer().tenantService;

    const tenant = await tenantService.createTenant({
      name: data.name,
      slug: data.slug,
      branding: data.branding as Prisma.InputJsonValue,
      settings: data.settings as Prisma.InputJsonValue,
    });

    await createAuditLog(req, {
      action: "tenant.create",
      tableName: "tenants",
      recordId: tenant.id,
      newValues: { name: data.name, slug: data.slug },
    });

    res.status(201).json({ tenant });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/tenants/:id (super admin only)
router.get("/:id", authenticate, requireSuperAdmin, async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const tenantService = getContainer().tenantService;

    const tenant = await tenantService.getTenantWithUsers(id);

    if (!tenant) {
      throw new AppError(404, "Tenant not found", "NOT_FOUND");
    }

    res.json({ tenant });
  } catch (error) {
    next(error);
  }
});

export default router;
