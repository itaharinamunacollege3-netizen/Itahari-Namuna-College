import express, { Application, RequestHandler } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "path";
import { env } from "../config/env";
import apiRoutes from "../routes/index";
import { errorHandler } from "../middleware/errorHandler";
import { globalLimiter } from "../middleware/rateLimiter";
import { requestSecurityMiddleware } from "../middleware/security";

export function createApp(): Application {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", env.TRUST_PROXY);

  app.use(
    helmet({
      frameguard: { action: "deny" },
      xssFilter: false,
      noSniff: true,
      hsts: env.isProduction
        ? {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
          }
        : false,
      referrerPolicy: { policy: "no-referrer" },
      crossOriginResourcePolicy: { policy: "cross-origin" },
      contentSecurityPolicy: false,
    })
  );

  app.use(
    cors({
      origin: env.isProduction 
        ? (origin, callback) => {
            const allowed = env.corsOrigins;
            if (!origin || allowed.includes(origin)) {
              callback(null, true);
            } else {
              callback(new Error(`Origin ${origin} not allowed by CORS`));
            }
          }
        : true,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      optionsSuccessStatus: 204,
    })
  );

  app.use(cookieParser());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(requestSecurityMiddleware);
  app.use(globalLimiter);

  // Serve uploaded photos (staff, faculty, etc.)
  app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

  app.use("/api", apiRoutes);

  app.use(errorHandler);

  return app;
}