import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "path";
import { env } from "../config/env";
import apiRoutes from "../routes/index";
import { errorHandler } from "../middleware/errorHandler";
import { globalLimiter } from "../middleware/rateLimiter";

export function createApp(): Application {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", env.TRUST_PROXY);

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  app.use(
    cors({
      origin(origin, callback) {
        const allowed = env.corsOrigins;
        if (!origin || allowed.includes(origin)) {
          callback(null, origin || allowed[0]);
        } else {
          callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
      },
      credentials: true,
    })
  );

  app.use(cookieParser());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(globalLimiter);

  // Serve uploaded photos (staff, faculty, etc.)
  app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

  app.use("/api", apiRoutes);

  app.use(errorHandler);

  return app;
}
