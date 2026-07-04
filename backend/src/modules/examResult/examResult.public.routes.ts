import { Router } from "express";
import { resultLookupLimiter } from "../../middleware/resultRateLimiter";
import { examResultPublicController } from "./examResult.public.controller";

const router = Router();

router.get("/sessions", examResultPublicController.listPublished);
router.get("/sessions/:sessionId/results/:symbolNumber", resultLookupLimiter, examResultPublicController.lookupBySymbol);

export default router;