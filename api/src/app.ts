import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { env } from './lib/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import patientsRoutes from './routes/patients.routes.js';
import substancesRoutes from './routes/substances.routes.js';
import protocolsRoutes from './routes/protocols.routes.js';
import dosesRoutes from './routes/doses.routes.js';
import tenantsRoutes from './routes/tenants.routes.js';
import healthRoutes from './routes/health.routes.js';

export const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Cookie parsing
app.use(cookieParser());

// Request logging
app.use(requestLogger);

// API Routes
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/patients', patientsRoutes);
app.use('/api/v1/substances', substancesRoutes);
app.use('/api/v1/protocols', protocolsRoutes);
app.use('/api/v1/doses', dosesRoutes);
app.use('/api/v1/tenants', tenantsRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use(errorHandler);
