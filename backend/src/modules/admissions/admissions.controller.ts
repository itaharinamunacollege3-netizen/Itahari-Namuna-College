import { Request, Response, NextFunction } from "express";
import * as admissionsService from "./admissions.service";
import { sendSuccess } from "../../utils/apiResponse";

export async function submit(req: Request, res: Response, next: NextFunction) {
  try {
    const application = await admissionsService.createAdmission(req.body);
    sendSuccess(
      res,
      { id: application.id, status: application.status, programApplied: application.programApplied },
      undefined,
      201
    );
  } catch (err) {
    next(err);
  }
}

export async function listAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await admissionsService.listAdmissions(
      Number(req.query.page) || 1,
      Number(req.query.limit) || 20
    );
    sendSuccess(res, result.items, result.meta);
  } catch (err) {
    next(err);
  }
}

export async function updateStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, adminNotes } = req.body;
    const data = await admissionsService.updateAdmissionStatus(
      Number(req.params.id),
      status,
      adminNotes
    );
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}
