import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

const defaultRateLimitMessage = {
  success: false,
  message: "Too many requests. Please try again later.",
};

const skipHealthCheck = (req: { path: string }) => req.path === "/api/health";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipHealthCheck,
  message: defaultRateLimitMessage,
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipHealthCheck,
  message: { success: false, message: "Too many login attempts. Please try again later." }, // return the message
});

export const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipHealthCheck,
  message: defaultRateLimitMessage,
});

export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipHealthCheck,
  message: defaultRateLimitMessage,
});

const isDev = process.env.NODE_ENV !== "production";

export const admissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: isDev ? 100 : 3,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipHealthCheck,
  message: defaultRateLimitMessage,
});

export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipHealthCheck,
  message: { success: false, message: "Too many uploads. Please try again later." },
});

export const loginSlowDown = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 3,
  delayMs: () => 1000,
});
