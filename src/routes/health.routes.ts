import { Router } from "express";
import { getHealthStatus } from "../controllers/health.controller";

const router = Router();

/**
 * GET /api/health
 */
router.get("/", async (req, res) => {
  await getHealthStatus(req, res);
});

export default router;
