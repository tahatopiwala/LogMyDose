import { Router } from "express";
import { z } from "zod";
import Stripe from "stripe";
import express from "express";
import { getContainer } from "../container/index.js";
import { authenticate, requirePatient } from "../middleware/auth.js";
import { AppError } from "../middleware/errorHandler.js";
import { createAuditLog } from "../middleware/auditLog.js";
import { env } from "../lib/env.js";

const router = Router();

// Initialize Stripe (only if configured)
const stripe = env.STRIPE_SECRET_KEY ? new Stripe(env.STRIPE_SECRET_KEY) : null;

// Plan definitions
const plans = [
  {
    id: "free",
    name: "Free",
    description: "Basic dose tracking",
    price: 0,
    currency: "usd",
    interval: "month" as const,
    priceId: "",
    features: [
      "Track up to 2 protocols",
      "Basic dose logging",
      "7-day history",
    ],
  },
  {
    id: "pro_monthly",
    name: "Pro",
    description: "Full tracking with AI insights",
    price: 999,
    currency: "usd",
    interval: "month" as const,
    priceId: env.STRIPE_PRICE_PRO_MONTHLY || "",
    features: [
      "Unlimited protocols",
      "Full dose history",
      "AI-powered insights",
      "Weekly AI reports",
      "Side effect tracking",
      "Data export",
    ],
  },
  {
    id: "pro_annual",
    name: "Pro (Annual)",
    description: "Save 17% with annual billing",
    price: 9900,
    currency: "usd",
    interval: "year" as const,
    priceId: env.STRIPE_PRICE_PRO_ANNUAL || "",
    features: ["Everything in Pro", "2 months free", "Priority support"],
  },
];

// Schemas
const checkoutSchema = z.object({
  priceId: z.string().min(1, "Price ID is required"),
});

// GET /api/v1/subscription/plans - List available plans
router.get("/plans", (_req, res) => {
  res.json({ plans });
});

// GET /api/v1/subscription/status - Get current subscription status
router.get("/status", authenticate, requirePatient, async (req, res, next) => {
  try {
    const patientRepository = getContainer().patientRepository;
    const patient = await patientRepository.findById(req.user!.id);

    if (!patient) {
      throw new AppError(404, "Patient not found", "NOT_FOUND");
    }

    const isPro =
      patient.subscriptionTier === "pro" &&
      ["active", "trialing"].includes(patient.subscriptionStatus || "");

    res.json({
      subscription: {
        tier: patient.subscriptionTier || "free",
        status: patient.subscriptionStatus,
        periodEnd: patient.subscriptionPeriodEnd,
        trialEndsAt: patient.trialEndsAt,
        cancelAtPeriodEnd: patient.cancelAtPeriodEnd,
        priceId: patient.subscriptionPriceId,
        features: {
          maxProtocols: isPro ? Infinity : 2,
          aiInsights: isPro,
          aiReports: isPro,
          exportData: isPro,
          advancedAnalytics: isPro,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/subscription/checkout - Create Stripe Checkout session
router.post(
  "/checkout",
  authenticate,
  requirePatient,
  async (req, res, next) => {
    try {
      if (!stripe) {
        throw new AppError(
          503,
          "Subscription service is not configured",
          "SERVICE_UNAVAILABLE",
        );
      }

      const data = checkoutSchema.parse(req.body);
      const patientRepository = getContainer().patientRepository;
      const patient = await patientRepository.findById(req.user!.id);

      if (!patient) {
        throw new AppError(404, "Patient not found", "NOT_FOUND");
      }

      // Validate price ID
      const plan = plans.find((p) => p.priceId === data.priceId);
      if (!plan || !plan.priceId) {
        throw new AppError(400, "Invalid price ID", "INVALID_PRICE");
      }

      // Get or create Stripe customer
      let customerId = patient.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: patient.email,
          metadata: { patientId: patient.id },
        });
        customerId = customer.id;
        await patientRepository.updateSubscription(patient.id, {
          stripeCustomerId: customerId,
        });
      }

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ["card"],
        line_items: [{ price: data.priceId, quantity: 1 }],
        mode: "subscription",
        subscription_data: {
          trial_period_days: 14,
        },
        success_url: `${env.APP_URL}/settings?subscription=success`,
        cancel_url: `${env.APP_URL}/settings?subscription=canceled`,
        metadata: { patientId: patient.id },
        allow_promotion_codes: true,
      });

      await createAuditLog(req, {
        action: "subscription.checkout_started",
        tableName: "patients",
        recordId: patient.id,
        newValues: { priceId: data.priceId, sessionId: session.id },
      });

      res.json({
        checkoutUrl: session.url,
        sessionId: session.id,
      });
    } catch (error) {
      next(error);
    }
  },
);

// POST /api/v1/subscription/portal - Create Stripe Customer Portal session
router.post("/portal", authenticate, requirePatient, async (req, res, next) => {
  try {
    if (!stripe) {
      throw new AppError(
        503,
        "Subscription service is not configured",
        "SERVICE_UNAVAILABLE",
      );
    }

    const patientRepository = getContainer().patientRepository;
    const patient = await patientRepository.findById(req.user!.id);

    if (!patient) {
      throw new AppError(404, "Patient not found", "NOT_FOUND");
    }

    if (!patient.stripeCustomerId) {
      throw new AppError(
        400,
        "No subscription found. Please subscribe first.",
        "NO_SUBSCRIPTION",
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: patient.stripeCustomerId,
      return_url: `${env.APP_URL}/settings`,
    });

    res.json({
      portalUrl: session.url,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/subscription/cancel - Cancel subscription
router.post("/cancel", authenticate, requirePatient, async (req, res, next) => {
  try {
    if (!stripe) {
      throw new AppError(
        503,
        "Subscription service is not configured",
        "SERVICE_UNAVAILABLE",
      );
    }

    const patientRepository = getContainer().patientRepository;
    const patient = await patientRepository.findById(req.user!.id);

    if (!patient) {
      throw new AppError(404, "Patient not found", "NOT_FOUND");
    }

    if (!patient.stripeSubscriptionId) {
      throw new AppError(
        400,
        "No active subscription to cancel",
        "NO_SUBSCRIPTION",
      );
    }

    // Cancel at period end (user keeps access until period ends)
    await stripe.subscriptions.update(patient.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    await patientRepository.updateSubscription(patient.id, {
      cancelAtPeriodEnd: true,
    });

    await createAuditLog(req, {
      action: "subscription.canceled",
      tableName: "patients",
      recordId: patient.id,
    });

    res.json({
      message: "Subscription will be canceled at period end",
      cancelAt: patient.subscriptionPeriodEnd,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/subscription/resume - Resume canceled subscription
router.post("/resume", authenticate, requirePatient, async (req, res, next) => {
  try {
    if (!stripe) {
      throw new AppError(
        503,
        "Subscription service is not configured",
        "SERVICE_UNAVAILABLE",
      );
    }

    const patientRepository = getContainer().patientRepository;
    const patient = await patientRepository.findById(req.user!.id);

    if (!patient) {
      throw new AppError(404, "Patient not found", "NOT_FOUND");
    }

    if (!patient.stripeSubscriptionId || !patient.cancelAtPeriodEnd) {
      throw new AppError(
        400,
        "No canceled subscription to resume",
        "NO_SUBSCRIPTION",
      );
    }

    await stripe.subscriptions.update(patient.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });

    await patientRepository.updateSubscription(patient.id, {
      cancelAtPeriodEnd: false,
    });

    await createAuditLog(req, {
      action: "subscription.resumed",
      tableName: "patients",
      recordId: patient.id,
    });

    res.json({
      message: "Subscription resumed successfully",
    });
  } catch (error) {
    next(error);
  }
});

// Webhook handler (uses raw body for signature verification)
// This needs to be mounted BEFORE body parsing middleware
export const webhookHandler = express.Router();

webhookHandler.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
      console.warn("Stripe webhook received but Stripe is not configured");
      return res.status(503).json({ error: "Service not configured" });
    }

    const sig = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return res.status(400).json({ error: "Invalid signature" });
    }

    const patientRepository = getContainer().patientRepository;

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          const patientId = session.metadata?.patientId;
          if (patientId) {
            await patientRepository.updateSubscription(patientId, {
              stripeCustomerId: session.customer as string,
            });
          }
          break;
        }

        case "customer.subscription.created":
        case "customer.subscription.updated": {
          const subscription = event.data.object as Stripe.Subscription;
          const customerId = subscription.customer as string;
          const patient =
            await patientRepository.findByStripeCustomerId(customerId);

          if (patient) {
            const sub = subscription as unknown as {
              id: string;
              status: string;
              currentPeriodEnd: number;
              trialEnd: number | null;
              cancelAtPeriodEnd: boolean;
              items: { data: Array<{ price: { id: string } }> };
            };
            await patientRepository.updateSubscription(patient.id, {
              stripeSubscriptionId: sub.id,
              subscriptionTier: "pro",
              subscriptionStatus: sub.status,
              subscriptionPeriodEnd: new Date(sub.currentPeriodEnd * 1000),
              subscriptionPriceId: sub.items.data[0]?.price.id,
              trialEndsAt: sub.trialEnd ? new Date(sub.trialEnd * 1000) : null,
              cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
            });
          }
          break;
        }

        case "customer.subscription.deleted": {
          const subscription = event.data.object as Stripe.Subscription;
          const customerId = subscription.customer as string;
          const patient =
            await patientRepository.findByStripeCustomerId(customerId);

          if (patient) {
            await patientRepository.updateSubscription(patient.id, {
              stripeSubscriptionId: null,
              subscriptionTier: "free",
              subscriptionStatus: "canceled",
              subscriptionPeriodEnd: null,
              subscriptionPriceId: null,
              trialEndsAt: null,
              cancelAtPeriodEnd: false,
            });
          }
          break;
        }

        case "invoice.payment_failed": {
          const invoiceData = event.data.object as unknown as {
            subscription: string | null;
            customer: string;
          };
          if (!invoiceData.subscription) break;

          const customerId = invoiceData.customer;
          const patient =
            await patientRepository.findByStripeCustomerId(customerId);

          if (patient) {
            await patientRepository.updateSubscription(patient.id, {
              subscriptionStatus: "past_due",
            });
          }
          break;
        }

        case "invoice.payment_succeeded": {
          const invoiceData = event.data.object as unknown as {
            subscription: string | null;
            customer: string;
          };
          if (!invoiceData.subscription) break;

          const customerId = invoiceData.customer;
          const patient =
            await patientRepository.findByStripeCustomerId(customerId);

          if (patient) {
            await patientRepository.updateSubscription(patient.id, {
              subscriptionStatus: "active",
            });
          }
          break;
        }
      }

      res.json({ received: true });
    } catch (error) {
      console.error("Webhook processing error:", error);
      // Return 200 to prevent retries for processing errors
      res.json({ received: true, error: "Processing error logged" });
    }
  },
);

export default router;
