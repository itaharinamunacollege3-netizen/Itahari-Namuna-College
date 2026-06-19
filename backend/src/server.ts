/// <reference path="./types/express.d.ts" />
import type { Server } from "http";
import { createApp } from "./app/createApp";
import { env } from "./config/env";
import { connectDatabase, disconnectDatabase } from "./config";

let httpServer: Server | null = null;

export async function startServer(): Promise<Server> {
  await connectDatabase();

  const app = createApp();

  httpServer = app.listen(env.PORT, () => {
    console.log(`[server] INC API running on http://localhost:${env.PORT}/api`);
    console.log(`[server] Health check: http://localhost:${env.PORT}/api/health`);
    console.log(`[server] Environment: ${env.NODE_ENV}`);
  });

  registerShutdownHandlers();

  return httpServer;
}

function registerShutdownHandlers(): void {
  const shutdown = async (signal: string) => {
    console.log(`[server] Received ${signal}. Shutting down gracefully...`);

    if (httpServer) {
      await new Promise<void>((resolve, reject) => {
        httpServer!.close((error) => (error ? reject(error) : resolve()));
      });
    }

    await disconnectDatabase();
    console.log("[server] Shutdown complete.");
    process.exit(0);
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));

  process.on("unhandledRejection", (reason) => {
    console.error("[server] Unhandled rejection:", reason);
  });

  process.on("uncaughtException", (error) => {
    console.error("[server] Uncaught exception:", error);
    process.exit(1);
  });
}

startServer().catch((error) => {
  console.error("[server] Failed to start:", error);
  process.exit(1);
});
