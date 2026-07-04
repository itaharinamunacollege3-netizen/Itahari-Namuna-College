import { Router } from "express";
import { examResultController } from "./examResult.controller";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/adminGuard";
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// All admin exam results routes require authentication and admin role
router.use(authenticate, requireAdmin);

router.get("/sessions", examResultController.listAll);
router.post("/sessions", examResultController.createSession);
router.post("/sessions/:id/upload", upload.single("file"), examResultController.uploadExcel);
router.get("/sessions/:id/preview", examResultController.previewStaged);
router.post("/sessions/:id/commit", examResultController.commitImport);
router.put("/sessions/:id/publish", examResultController.togglePublish);

export default router;