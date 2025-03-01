import { Router } from "express";
import { verifyAccessToken } from "../middlewares/verifyTokens";
import { getTransactions } from "../controllers/transactions.controller";

const router = Router();

/**
 * GET /api/transactions
 */
router.get("/", verifyAccessToken, getTransactions);

export default router;
