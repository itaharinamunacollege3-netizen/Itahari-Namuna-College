import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

export const globalLimiter = rateLimit({ // global rate limiter
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requests per 15 minutes
  standardHeaders: true, // return the headers
  legacyHeaders: false, // return the headers
  message: { success: false, message: "Too many requests. Please try again later." }, // return the message
});

export const loginLimiter = rateLimit({ // login rate limiter
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per 15 minutes
  standardHeaders: true, // return the headers
  legacyHeaders: false, // return the headers
  message: { success: false, message: "Too many login attempts. Please try again later." }, // return the message
});

export const refreshLimiter = rateLimit({ // refresh rate limiter
  windowMs: 15 * 60 * 1000,
  max: 30, // 30 requests per 15 minutes
  standardHeaders: true, // return the headers
  legacyHeaders: false, // return the headers
});

export const contactLimiter = rateLimit({ // contact rate limiter
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per hour
  standardHeaders: true, // return the headers
  legacyHeaders: false, // return the headers
});

export const admissionLimiter = rateLimit({ // admission rate limiter
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per hour
  standardHeaders: true, // return the headers
  legacyHeaders: false, // return the headers
});

export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many uploads. Please try again later." },
});

export const loginSlowDown = slowDown({ // login slow down
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 3, // delay after 3 requests
  delayMs: () => 1000, // delay by 1 second
});
