import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { env } from "./lib/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { requestLogger } from "./middleware/requestLogger.js";

// Route imports
import authRoutes from "./routes/auth.routes.js";
import patientsRoutes from "./routes/patients.routes.js";
import substancesRoutes from "./routes/substances.routes.js";
import protocolsRoutes from "./routes/protocols.routes.js";
import dosesRoutes from "./routes/doses.routes.js";
import tenantsRoutes from "./routes/tenants.routes.js";
import healthRoutes from "./routes/health.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import subscriptionRoutes, {
  webhookHandler,
} from "./routes/subscription.routes.js";
import productsRoutes from "./routes/products.routes.js";
import exportsRoutes from "./routes/exports.routes.js";

export const app = express();

// Security middleware
app.use(helmet());

// Parse comma-separated CORS origins
const allowedOrigins = env.CORS_ORIGINS.split(",").map((origin) =>
  origin.trim(),
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// Rate limiting (skip for localhost in development)
const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for localhost in development
    if (env.NODE_ENV === "development") {
      const host = req.get("host") || "";
      return host.includes("localhost") || host.includes("127.0.0.1");
    }
    return false;
  },
});
app.use(limiter);

// Webhook routes (must be before body parsing for raw body access)
app.use("/api/v1/webhooks", webhookHandler);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Cookie parsing
app.use(cookieParser());

// Request logging
app.use(requestLogger);

// API Routes
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/patients", patientsRoutes);
app.use("/api/v1/substances", substancesRoutes);
app.use("/api/v1/protocols", protocolsRoutes);
app.use("/api/v1/doses", dosesRoutes);
app.use("/api/v1/tenants", tenantsRoutes);
app.use("/api/v1/settings", settingsRoutes);
app.use("/api/v1/subscription", subscriptionRoutes);
app.use("/api/v1/products", productsRoutes);
app.use("/api/v1/exports", exportsRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Global error handler
app.use(errorHandler);
