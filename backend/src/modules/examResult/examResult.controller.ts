import { Request, Response, NextFunction } from "express";
import { examResultService } from "./examResult.service";
import { createExamSessionSchema, publishSessionSchema } from "./examResult.validation";
import { sendSuccess, sendError } from "../../utils/apiResponse";
import { writeAuditLog } from "../../utils/audit";

export const examResultController = {
  createSession: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = createExamSessionSchema.safeParse(req.body);
      if (!parsed.success) return sendError(res, parsed.error.issues[0].message, 400);

      const adminId = (req as any).user.id;
      const session = await examResultService.createSession(parsed.data, adminId);

      await writeAuditLog({
        userId: adminId,
        action: "CREATE_EXAM_SESSION",
        metadata: { details: `Created exam session ${session.examName}` },
        ipAddress: req.ip,
      });

      return sendSuccess(res, session, "Exam session created", 201);
    } catch (err) {
      next(err);
    }
  },

  listAll: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const sessions = await examResultService.listAllSessions();
      return sendSuccess(res, sessions);
    } catch (err) {
      next(err);
    }
  },

  uploadExcel: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionId = req.params.id as string;
      if (!req.file) return sendError(res, "No file uploaded", 400);

      const session = await examResultService.getSessionById(sessionId);
      if (!session) return sendError(res, "Exam session not found", 404);

      let parsed;
      try {
        parsed = examResultService.parseExcelBuffer(req.file.buffer);
      } catch {
        return sendError(res, "Invalid Excel file", 400);
      }

      if (parsed.missingHeaders.length > 0) {
        return sendError(res, `Missing columns: ${parsed.missingHeaders.join(", ")}`, 400);
      }
      if (parsed.rows.length === 0) {
        return sendError(res, "Excel file is empty", 400);
      }

      examResultService.stageRows(sessionId, parsed.rows);

      const validCount = parsed.rows.filter((r) => r.errors.length === 0).length;
      return sendSuccess(res, {
        rows: parsed.rows,
        summary: { total: parsed.rows.length, valid: validCount, invalid: parsed.rows.length - validCount },
      }, "File parsed. Review before committing.");
    } catch (err) {
      next(err);
    }
  },

  previewStaged: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionId = req.params.id as string;
      const staged = examResultService.getStagedRows(sessionId);
      if (!staged) return sendError(res, "No staged upload found. Upload a file first.", 404);
      return sendSuccess(res, staged);
    } catch (err) {
      next(err);
    }
  },

  commitImport: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionId = req.params.id as string;
      const result = await examResultService.commitStagedRows(sessionId);
      if (!result) return sendError(res, "No staged upload found. Upload a file first.", 404);
      if (result.totalValid === 0) return sendError(res, "No valid rows to import", 400);

      const adminId = (req as any).user.id;
      await writeAuditLog({
        userId: adminId,
        action: "COMMIT_EXAM_RESULTS",
        metadata: { details: `Imported ${result.imported} results for session ${sessionId}` },
        ipAddress: req.ip,
      });

      return sendSuccess(res, result, `Imported ${result.imported} results`);
    } catch (err) {
      next(err);
    }
  },

  togglePublish: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionId = req.params.id as string;
      const parsed = publishSessionSchema.safeParse(req.body);
      if (!parsed.success) return sendError(res, parsed.error.issues[0].message, 400);

      const session = await examResultService.togglePublish(sessionId, parsed.data.isPublished);

      const adminId = (req as any).user.id;
      await writeAuditLog({
        userId: adminId,
        action: parsed.data.isPublished ? "PUBLISH_EXAM_SESSION" : "UNPUBLISH_EXAM_SESSION",
        metadata: { details: `Session ${sessionId}` },
        ipAddress: req.ip,
      });

      return sendSuccess(res, session);
    } catch (err) {
      next(err);
    }
  },
};