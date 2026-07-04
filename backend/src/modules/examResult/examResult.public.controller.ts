import { Request, Response } from "express";
import { examResultService } from "./examResult.service";
import { sendSuccess, sendError } from "../../utils/apiResponse";

export const examResultPublicController = {
  listPublished: async (_req: Request, res: Response) => {
    const sessions = await examResultService.listPublishedSessions();
    return sendSuccess(res, sessions);
  },

  lookupBySymbol: async (req: Request, res: Response) => {
    const sessionId = req.params.sessionId as string;
    const symbolNumber = req.params.symbolNumber as string;
    if (!symbolNumber?.trim()) return sendError(res, "Symbol number is required", 400);

    const result = await examResultService.lookupBySymbol(sessionId, symbolNumber.trim());
    if (!result) return sendError(res, "No result found for this symbol number", 404);

    return sendSuccess(res, result);
  },
};