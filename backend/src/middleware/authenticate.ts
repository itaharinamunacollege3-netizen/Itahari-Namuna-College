import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { AppError } from "../utils/apiResponse";

export function authenticate(req: Request, _res: Response, next: NextFunction) { // authenticate the user
  try {
    const bearer = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.slice(7)
      : undefined;
    const token = bearer || req.cookies?.accessToken;

    if (!token) {
      throw new AppError(401, "Authentication required");
    }

    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(new AppError(401, "Invalid or expired token"));
  }
}
