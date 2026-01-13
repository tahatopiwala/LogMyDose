import "dotenv/config";
import { app } from "./app.js";
import { env } from "./lib/env.js";
import { prisma } from "./lib/db.js";
import { Container } from "./container/index.js";

const PORT = env.PORT;

async function main() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log("Database connected successfully");

    // Initialize the DI container
    Container.getInstance(prisma);
    console.log("DI Container initialized");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nShutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\nShutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

main();
