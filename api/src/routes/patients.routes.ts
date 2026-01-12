import { Router } from 'express';
import { z } from 'zod';
import { Prisma } from '@logmydose/shared/prisma';
import { getContainer } from '../container/index.js';
import { authenticate, requirePatient } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { createAuditLog } from '../middleware/auditLog.js';

const router = Router();

// Validation schemas
const updatePatientSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  dateOfBirth: z.string().optional(),
  phone: z.string().max(20).optional(),
  settings: z.record(z.unknown()).optional(),
});

const linkClinicSchema = z.object({
  inviteCode: z.string().min(1),
});

// GET /api/v1/patients/me
router.get('/me', authenticate, requirePatient, async (req, res, next) => {
  try {
    const patientService = getContainer().patientService;
    const patient = await patientService.getProfile(req.user!.id);

    if (!patient) {
      throw new AppError(404, 'Patient not found', 'NOT_FOUND');
    }

    res.json({ patient });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/patients/me
router.put('/me', authenticate, requirePatient, async (req, res, next) => {
  try {
    const data = updatePatientSchema.parse(req.body);
    const patientService = getContainer().patientService;

    const patient = await patientService.updateProfile(req.user!.id, {
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      phone: data.phone,
      settings: data.settings as Prisma.InputJsonValue,
    });

    await createAuditLog(req, {
      action: 'patient.update',
      tableName: 'patients',
      recordId: patient.id,
      newValues: data as Record<string, unknown>,
    });

    res.json({ patient });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/patients/link-clinic
router.post('/link-clinic', authenticate, requirePatient, async (req, res, next) => {
  try {
    const data = linkClinicSchema.parse(req.body);
    const patientService = getContainer().patientService;

    const patient = await patientService.linkToClinic(req.user!.id, data.inviteCode);

    await createAuditLog(req, {
      action: 'patient.link_clinic',
      tableName: 'patients',
      recordId: patient.id,
      newValues: { clinicId: patient.clinicId },
    });

    res.json({ patient });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/patients/unlink-clinic
router.post('/unlink-clinic', authenticate, requirePatient, async (req, res, next) => {
  try {
    const patientService = getContainer().patientService;

    const currentPatient = await patientService.getProfile(req.user!.id);
    const patient = await patientService.unlinkFromClinic(req.user!.id);

    await createAuditLog(req, {
      action: 'patient.unlink_clinic',
      tableName: 'patients',
      recordId: patient.id,
      oldValues: { clinicId: currentPatient?.clinicId },
    });

    res.json({ patient });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/patients/protocols
router.get('/protocols', authenticate, requirePatient, async (req, res, next) => {
  try {
    const patientService = getContainer().patientService;
    const protocols = await patientService.getProtocols(req.user!.id);

    res.json({ protocols });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/patients/doses
router.get('/doses', authenticate, requirePatient, async (req, res, next) => {
  try {
    const { page, limit, startDate, endDate } = req.query;
    const patientService = getContainer().patientService;

    const result = await patientService.getDoses(req.user!.id, {
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
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

// GET /api/v1/patients/alerts
router.get('/alerts', authenticate, requirePatient, async (req, res, next) => {
  try {
    const patientService = getContainer().patientService;
    const alerts = await patientService.getAlerts(req.user!.id);

    res.json({ alerts });
  } catch (error) {
    next(error);
  }
});

export default router;
