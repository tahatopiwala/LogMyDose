import { Router, Response } from 'express';
import { z } from 'zod';
import { getContainer } from '../container/index.js';
import { authenticate } from '../middleware/auth.js';
import { createAuditLog } from '../middleware/auditLog.js';
import { env } from '../lib/env.js';

const router = Router();

// Cookie configuration for auth tokens
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie('lmd_access_token', accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
  res.cookie('lmd_refresh_token', refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

function clearAuthCookies(res: Response) {
  res.clearCookie('lmd_access_token', COOKIE_OPTIONS);
  res.clearCookie('lmd_refresh_token', COOKIE_OPTIONS);
}

// Validation schemas
const registerPatientSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12, 'Password must be at least 12 characters'),
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
});

const registerUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12, 'Password must be at least 12 characters'),
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  role: z.enum(['provider', 'clinic_admin']),
  tenantId: z.string().uuid(),
  credentials: z.string().max(255).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  userType: z.enum(['patient', 'user']).default('patient'),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
  userType: z.enum(['patient', 'user']).default('patient'),
});

// POST /api/v1/auth/register/patient
router.post('/register/patient', async (req, res, next) => {
  try {
    const data = registerPatientSchema.parse(req.body);
    const authService = getContainer().authService;

    const result = await authService.registerPatient(data);

    await createAuditLog(req, {
      action: 'patient.register',
      tableName: 'patients',
      recordId: result.patient.id,
      newValues: { email: result.patient.email },
    });

    // Set httpOnly cookies for web clients
    setAuthCookies(res, result.accessToken, result.refreshToken);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/auth/register/user (for providers/admins)
router.post('/register/user', authenticate, async (req, res, next) => {
  try {
    const data = registerUserSchema.parse(req.body);
    const authService = getContainer().authService;

    const result = await authService.registerUser(data, {
      id: req.user!.id,
      email: req.user!.email,
      role: req.user!.role,
      tenantId: req.user!.tenantId,
    });

    await createAuditLog(req, {
      action: 'user.register',
      tableName: 'users',
      recordId: result.user.id,
      newValues: { email: result.user.email, role: result.user.role },
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const authService = getContainer().authService;

    const result = await authService.login(data);

    const isPatient = 'patient' in result;
    await createAuditLog(req, {
      action: isPatient ? 'patient.login' : 'user.login',
      tableName: isPatient ? 'patients' : 'users',
      recordId: isPatient ? result.patient.id : result.user.id,
    });

    // Set httpOnly cookies for web clients
    setAuthCookies(res, result.accessToken, result.refreshToken);

    res.json(result);
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/auth/refresh
router.post('/refresh', async (req, res, next) => {
  try {
    // Support refresh token from body or cookie
    const refreshToken = req.body.refreshToken || req.cookies?.lmd_refresh_token;
    const userType = req.body.userType || 'patient';

    const data = refreshSchema.parse({ refreshToken, userType });
    const authService = getContainer().authService;

    const tokens = await authService.refresh(data);

    // Set httpOnly cookies for web clients
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    res.json(tokens);
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/auth/logout
router.post('/logout', authenticate, async (req, res, next) => {
  try {
    const authService = getContainer().authService;

    await authService.logout({
      id: req.user!.id,
      email: req.user!.email,
      role: req.user!.role,
      tenantId: req.user!.tenantId,
    });

    await createAuditLog(req, {
      action: req.user!.role === 'patient' ? 'patient.logout' : 'user.logout',
      tableName: req.user!.role === 'patient' ? 'patients' : 'users',
      recordId: req.user!.id,
    });

    // Clear httpOnly cookies
    clearAuthCookies(res);

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/auth/me
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const authService = getContainer().authService;

    if (req.user!.role === 'patient') {
      const patient = await authService.getCurrentPatient(req.user!.id);
      res.json({ patient });
    } else {
      const user = await authService.getCurrentUser(req.user!.id);
      res.json({ user });
    }
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/auth/verify-email
router.get('/verify-email', async (req, res, next) => {
  try {
    const { token } = z.object({ token: z.string().min(1) }).parse(req.query);
    const authService = getContainer().authService;

    await authService.verifyEmail(token);

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/auth/resend-verification
router.post('/resend-verification', authenticate, async (req, res, next) => {
  try {
    const authService = getContainer().authService;

    // Only patients can request verification emails
    if (req.user!.role !== 'patient') {
      return res.status(403).json({ error: 'Only patients can request verification emails' });
    }

    await authService.resendVerificationEmail(req.user!.id);

    res.json({ message: 'Verification email sent' });
  } catch (error) {
    next(error);
  }
});

export default router;
