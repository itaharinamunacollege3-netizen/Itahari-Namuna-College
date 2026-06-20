import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { AppError } from "../utils/apiResponse";

export function validateBody<T>(schema: ZodSchema<T>) { // validate the request body
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(new AppError(400, result.error.issues[0]?.message ?? "Invalid request body"));
    }
    req.body = result.data;
    req.validatedBody = result.data;
    next();
  };
}

export function validateQuery<T extends Record<string, unknown>>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return next(new AppError(400, result.error.issues[0]?.message ?? "Invalid query parameters"));
    }
    req.validatedQuery = result.data;
    next();
  };
}

export function validateParams<T extends Record<string, unknown>>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      return next(new AppError(400, result.error.issues[0]?.message ?? "Invalid route parameters"));
    }
    req.params = result.data as typeof req.params;
    next();
  };
}
