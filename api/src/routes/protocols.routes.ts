import { Router } from 'express';
import { z } from 'zod';
import { getContainer } from '../container/index.js';
import { authenticate, requirePatient, requireSuperAdmin } from '../middleware/auth.js';
import { createAuditLog } from '../middleware/auditLog.js';
import { paginationSchema } from '../types/index.js';

const router = Router();

// Validation schemas
const createProtocolSchema = z.object({
  source: z.enum(['template', 'custom']),
  templateId: z.string().uuid().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  notes: z.string().optional(),
  substances: z
    .array(
      z.object({
        substanceId: z.string().uuid(),
        dose: z.number().positive(),
        doseUnit: z.string().max(20).optional(),
        frequency: z.string().max(50).optional(),
        schedule: z.record(z.unknown()).optional(),
        titrationPlan: z.record(z.unknown()).optional(),
        cycleOnWeeks: z.number().int().positive().optional(),
        cycleOffWeeks: z.number().int().positive().optional(),
        notes: z.string().optional(),
      })
    )
    .min(1),
});

const updateProtocolSchema = z.object({
  status: z.enum(['draft', 'active', 'paused', 'completed']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  notes: z.string().optional(),
});

const createTemplateSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  substanceId: z.string().uuid().optional(),
  defaultDose: z.number().positive().optional(),
  doseUnit: z.string().max(20).optional(),
  frequency: z.string().max(50).optional(),
  titrationPlan: z.record(z.unknown()).optional(),
  cycleOnWeeks: z.number().int().positive().optional(),
  cycleOffWeeks: z.number().int().positive().optional(),
  difficultyLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().optional(),
});

const updateTemplateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  substanceId: z.string().uuid().optional(),
  defaultDose: z.number().positive().optional(),
  doseUnit: z.string().max(20).optional(),
  frequency: z.string().max(50).optional(),
  titrationPlan: z.record(z.unknown()).optional(),
  cycleOnWeeks: z.number().int().positive().optional(),
  cycleOffWeeks: z.number().int().positive().optional(),
  difficultyLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().optional(),
});

// GET /api/v1/protocols/templates
router.get('/templates', async (req, res, next) => {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    const { categoryId, substanceId, difficulty, search } = req.query;

    const protocolService = getContainer().protocolService;
    const result = await protocolService.getTemplates({
      page,
      limit,
      categoryId: categoryId as string,
      substanceId: substanceId as string,
      difficulty: difficulty as string,
      search: search as string,
    });

    res.json({
      templates: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/protocols/templates/:id
router.get('/templates/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const protocolService = getContainer().protocolService;

    const template = await protocolService.getTemplateById(id);

    res.json({ template });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/protocols/templates (super admin only)
router.post('/templates', authenticate, requireSuperAdmin, async (req, res, next) => {
  try {
    const data = createTemplateSchema.parse(req.body);
    const protocolService = getContainer().protocolService;

    const template = await protocolService.createTemplate(data);

    await createAuditLog(req, {
      action: 'protocol_template.create',
      tableName: 'protocol_templates',
      recordId: template.id,
      newValues: { name: data.name },
    });

    res.status(201).json({ template });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/protocols/templates/:id (super admin only)
router.put('/templates/:id', authenticate, requireSuperAdmin, async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const data = updateTemplateSchema.parse(req.body);
    const protocolService = getContainer().protocolService;

    const template = await protocolService.updateTemplate(id, data);

    await createAuditLog(req, {
      action: 'protocol_template.update',
      tableName: 'protocol_templates',
      recordId: template.id,
      newValues: data as Record<string, unknown>,
    });

    res.json({ template });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/protocols/templates/:id (super admin only)
router.delete('/templates/:id', authenticate, requireSuperAdmin, async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const protocolService = getContainer().protocolService;

    await protocolService.deleteTemplate(id);

    await createAuditLog(req, {
      action: 'protocol_template.delete',
      tableName: 'protocol_templates',
      recordId: id,
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/protocols (create from template or custom)
router.post('/', authenticate, requirePatient, async (req, res, next) => {
  try {
    const data = createProtocolSchema.parse(req.body);
    const protocolService = getContainer().protocolService;

    const protocol = await protocolService.createProtocol(req.user!.id, data);

    await createAuditLog(req, {
      action: 'protocol.create',
      tableName: 'protocols',
      recordId: protocol.id,
      newValues: { source: data.source, templateId: data.templateId },
    });

    res.status(201).json({ protocol });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/protocols/:id
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const protocolService = getContainer().protocolService;

    const protocol = await protocolService.getProtocolById(id, {
      id: req.user!.id,
      email: req.user!.email,
      role: req.user!.role,
      tenantId: req.user!.tenantId,
    });

    res.json({ protocol });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/protocols/:id
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const data = updateProtocolSchema.parse(req.body);
    const protocolService = getContainer().protocolService;

    const protocol = await protocolService.updateProtocol(
      id,
      {
        status: data.status,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        notes: data.notes,
      },
      {
        id: req.user!.id,
        email: req.user!.email,
        role: req.user!.role,
        tenantId: req.user!.tenantId,
      }
    );

    await createAuditLog(req, {
      action: 'protocol.update',
      tableName: 'protocols',
      recordId: protocol.id,
      newValues: data as Record<string, unknown>,
    });

    res.json({ protocol });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/protocols/:id/schedule
router.get('/:id/schedule', authenticate, async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const { startDate, endDate } = req.query;

    const protocolService = getContainer().protocolService;
    const result = await protocolService.getProtocolSchedule(
      id,
      {
        id: req.user!.id,
        email: req.user!.email,
        role: req.user!.role,
        tenantId: req.user!.tenantId,
      },
      startDate as string,
      endDate as string
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
