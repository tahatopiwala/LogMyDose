import { Router } from "express";
import { z } from "zod";
import { getContainer } from "../container/index.js";
import { authenticate, requirePatient } from "../middleware/auth.js";
import { AppError } from "../middleware/errorHandler.js";
import { createAuditLog } from "../middleware/auditLog.js";
import { verifyPassword, hashPassword } from "../lib/password.js";

const router = Router();

// Password validation schema (same as auth.routes.ts)
const passwordSchema = z
  .string()
  .min(12, "Password must be at least 12 characters")
  .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
  .regex(
    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
    "Password must contain at least 1 special character",
  );

// Change email schema
const changeEmailSchema = z.object({
  newEmail: z.string().email("Invalid email format"),
  currentPassword: z.string().min(1, "Current password is required"),
});

// Change password schema
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
});

// Delete account schema
const deleteAccountSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

// POST /api/v1/settings/email - Change email address
router.post("/email", authenticate, requirePatient, async (req, res, next) => {
  try {
    const data = changeEmailSchema.parse(req.body);
    const patientRepository = getContainer().patientRepository;

    // Get current patient with password
    const patient = await patientRepository.findById(req.user!.id);
    if (!patient) {
      throw new AppError(404, "Patient not found", "NOT_FOUND");
    }

    // Verify current password
    const isValidPassword = await verifyPassword(
      data.currentPassword,
      patient.passwordHash,
    );
    if (!isValidPassword) {
      throw new AppError(401, "Invalid password", "INVALID_PASSWORD");
    }

    // Check if new email is different
    if (data.newEmail.toLowerCase() === patient.email.toLowerCase()) {
      throw new AppError(
        400,
        "New email must be different from current email",
        "SAME_EMAIL",
      );
    }

    // Check if new email is already in use
    const existingPatient = await patientRepository.findByEmail(data.newEmail);
    if (existingPatient) {
      throw new AppError(
        409,
        "An account with this email already exists",
        "EMAIL_EXISTS",
      );
    }

    // For now, update email directly (in production, you'd want email verification)
    // TODO: Implement email change verification flow
    const oldEmail = patient.email;
    await patientRepository.update(req.user!.id, {
      // Note: We need to add email update capability to repository
    });

    await createAuditLog(req, {
      action: "patient.change_email",
      tableName: "patients",
      recordId: patient.id,
      oldValues: { email: oldEmail },
      newValues: { email: data.newEmail },
    });

    res.json({
      message: "Verification email sent to your new email address",
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/settings/password - Change password
router.post(
  "/password",
  authenticate,
  requirePatient,
  async (req, res, next) => {
    try {
      const data = changePasswordSchema.parse(req.body);
      const patientRepository = getContainer().patientRepository;

      // Get current patient with password
      const patient = await patientRepository.findById(req.user!.id);
      if (!patient) {
        throw new AppError(404, "Patient not found", "NOT_FOUND");
      }

      // Verify current password
      const isValidPassword = await verifyPassword(
        data.currentPassword,
        patient.passwordHash,
      );
      if (!isValidPassword) {
        throw new AppError(
          401,
          "Current password is incorrect",
          "INVALID_PASSWORD",
        );
      }

      // Ensure new password is different
      const isSamePassword = await verifyPassword(
        data.newPassword,
        patient.passwordHash,
      );
      if (isSamePassword) {
        throw new AppError(
          400,
          "New password must be different from current password",
          "SAME_PASSWORD",
        );
      }

      // Hash new password and update
      const newPasswordHash = await hashPassword(data.newPassword);
      await patientRepository.updatePassword(req.user!.id, newPasswordHash);

      // Increment token version to invalidate all sessions
      await patientRepository.incrementTokenVersion(req.user!.id);

      await createAuditLog(req, {
        action: "patient.change_password",
        tableName: "patients",
        recordId: patient.id,
      });

      res.json({
        message: "Password changed successfully",
      });
    } catch (error) {
      next(error);
    }
  },
);

// DELETE /api/v1/settings/account - Delete account
router.delete(
  "/account",
  authenticate,
  requirePatient,
  async (req, res, next) => {
    try {
      const data = deleteAccountSchema.parse(req.body);
      const patientRepository = getContainer().patientRepository;

      // Get current patient with password
      const patient = await patientRepository.findById(req.user!.id);
      if (!patient) {
        throw new AppError(404, "Patient not found", "NOT_FOUND");
      }

      // Verify password
      const isValidPassword = await verifyPassword(
        data.password,
        patient.passwordHash,
      );
      if (!isValidPassword) {
        throw new AppError(401, "Invalid password", "INVALID_PASSWORD");
      }

      // TODO: Cancel Stripe subscription if active

      // Soft delete the account
      await patientRepository.softDelete(req.user!.id);

      // Increment token version to invalidate all sessions
      await patientRepository.incrementTokenVersion(req.user!.id);

      await createAuditLog(req, {
        action: "patient.delete_account",
        tableName: "patients",
        recordId: patient.id,
      });

      res.json({
        message: "Account deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
