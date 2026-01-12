import { z } from 'zod';

const envSchema = z.object({
  // Redis
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),

  // Resend
  RESEND_API_KEY: z.string(),
  EMAIL_FROM: z.string().default('LogMyDose <noreply@logmydose.com>'),

  // App
  APP_URL: z.string().url().default('http://localhost:5173'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Worker settings
  WORKER_CONCURRENCY: z.coerce.number().default(5),
});

function validateEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('Invalid environment variables:');
    console.error(parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
  }

  return parsed.data;
}

export const env = validateEnv();

export type Env = z.infer<typeof envSchema>;
