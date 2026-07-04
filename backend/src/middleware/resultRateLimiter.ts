import rateLimit from "express-rate-limit";

export const resultLookupLimiter = rateLimit({
    windowMs: 20 * 1000 ,   // 
    max: 20, //
    message: { success: false, message: "Too many attempts. Please try again in a minute." },
    standardHeaders: true,
    legacyHeaders: false,
});