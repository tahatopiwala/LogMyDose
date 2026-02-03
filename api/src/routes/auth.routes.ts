import { Router, Response } from "express";
import { z } from "zod";
import { getContainer } from "../container/index.js";
import { authenticate } from "../middleware/auth.js";
import { createAuditLog } from "../middleware/auditLog.js";
import { env } from "../lib/env.js";

const router = Router();

// Cookie configuration for auth tokens
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
  rememberMe: boolean = false,
) {
  // When rememberMe is false, use session cookies (no maxAge - expires when browser closes)
  // When rememberMe is true, use persistent cookies with maxAge
  const accessCookieOptions = rememberMe
    ? { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 } // 15 minutes
    : COOKIE_OPTIONS;
  const refreshCookieOptions = rememberMe
    ? { ...COOKIE_OPTIONS, maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days for remember me
    : COOKIE_OPTIONS;

  res.cookie("lmd_access_token", accessToken, accessCookieOptions);
  res.cookie("lmd_refresh_token", refreshToken, refreshCookieOptions);

  // Store rememberMe preference for use during token refresh
  if (rememberMe) {
    res.cookie("lmd_remember_me", "1", refreshCookieOptions);
  } else {
    res.clearCookie("lmd_remember_me", COOKIE_OPTIONS);
  }
}

function clearAuthCookies(res: Response) {
  res.clearCookie("lmd_access_token", COOKIE_OPTIONS);
  res.clearCookie("lmd_refresh_token", COOKIE_OPTIONS);
  res.clearCookie("lmd_remember_me", COOKIE_OPTIONS);
}

// Password validation schema
const passwordSchema = z
  .string()
  .min(12, "Password must be at least 12 characters")
  .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
  .regex(
    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
    "Password must contain at least 1 special character",
  );

// Validation schemas
const registerPatientSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean().default(false),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

// POST /api/v1/auth/register/patient
router.post("/register/patient", async (req, res, next) => {
  try {
    const data = registerPatientSchema.parse(req.body);
    const authService = getContainer().authService;

    const result = await authService.registerPatient(data);

    await createAuditLog(req, {
      action: "patient.register",
      tableName: "patients",
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

// POST /api/v1/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const authService = getContainer().authService;

    const result = await authService.login(data);

    await createAuditLog(req, {
      action: "patient.login",
      tableName: "patients",
      recordId: result.patient.id,
    });

    // Set httpOnly cookies for web clients
    setAuthCookies(
      res,
      result.accessToken,
      result.refreshToken,
      data.rememberMe,
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/auth/refresh
router.post("/refresh", async (req, res, next) => {
  try {
    // Support refresh token from body or cookie
    const refreshToken =
      req.body.refreshToken || req.cookies?.lmd_refresh_token;
    // Preserve rememberMe preference from cookie
    const rememberMe = req.cookies?.lmd_remember_me === "1";

    const data = refreshSchema.parse({ refreshToken });
    const authService = getContainer().authService;

    const tokens = await authService.refresh(data);

    // Set httpOnly cookies for web clients, preserving rememberMe preference
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken, rememberMe);

    res.json(tokens);
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/auth/logout
router.post("/logout", authenticate, async (req, res, next) => {
  try {
    const authService = getContainer().authService;

    await authService.logout(req.user!.id);

    await createAuditLog(req, {
      action: "patient.logout",
      tableName: "patients",
      recordId: req.user!.id,
    });

    // Clear httpOnly cookies
    clearAuthCookies(res);

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/auth/me
router.get("/me", authenticate, async (req, res, next) => {
  try {
    const authService = getContainer().authService;

    const patient = await authService.getCurrentPatient(req.user!.id);
    res.json({ patient });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/auth/verify-email
router.get("/verify-email", async (req, res, next) => {
  try {
    const { token } = z.object({ token: z.string().min(1) }).parse(req.query);
    const authService = getContainer().authService;

    await authService.verifyEmail(token);

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/auth/resend-verification
router.post("/resend-verification", authenticate, async (req, res, next) => {
  try {
    const authService = getContainer().authService;

    await authService.resendVerificationEmail(req.user!.id);

    res.json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
});

export default router;
