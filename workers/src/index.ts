import 'dotenv/config';
import { createEmailWorker } from './processors/index.js';
import { redis } from './lib/redis.js';

console.log('Starting LogMyDose workers...');

const workers = [
  createEmailWorker(),
  // Future workers can be added here:
  // createNotificationWorker(),
  // createAiReportWorker(),
];

console.log(`[Workers] ${workers.length} worker(s) started and listening for jobs`);

// Graceful shutdown
async function shutdown(signal: string): Promise<void> {
  console.log(`\n[Workers] Received ${signal}, shutting down gracefully...`);

  try {
    await Promise.all(workers.map((w) => w.close()));
    console.log('[Workers] All workers closed');

    await redis.quit();
    console.log('[Workers] Redis connection closed');

    process.exit(0);
  } catch (error) {
    console.error('[Workers] Error during shutdown:', error);
    process.exit(1);
  }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Keep the process alive
process.on('uncaughtException', (error) => {
  console.error('[Workers] Uncaught exception:', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('[Workers] Unhandled rejection:', reason);
});
