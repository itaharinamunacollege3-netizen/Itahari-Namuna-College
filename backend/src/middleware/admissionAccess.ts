import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { hashToken } from "../utils/hash";
import { AppError } from "../utils/apiResponse";

export async function requireAdmissionAccess(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      throw new AppError(400, "Invalid application id");
    }

    const token =
      (req.headers["x-admission-token"] as string | undefined)?.trim() ||
      (typeof req.query.token === "string" ? req.query.token.trim() : "");

    if (!token) {
      throw new AppError(401, "Admission access token is required");
    }

    const application = await prisma.admissionApplication.findUnique({ where: { id } });
    if (!application) {
      throw new AppError(404, "Application not found");
    }

    if (application.accessTokenHash !== hashToken(token)) {
      throw new AppError(403, "Invalid admission access token");
    }

    req.admissionApplication = {
      id: application.id,
      status: application.status,
      accessTokenHash: application.accessTokenHash,
    };

    next();
  } catch (err) {
    next(err);
  }
}
