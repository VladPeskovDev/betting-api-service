import { Router } from "express";
import { verifyAccessToken } from "../middlewares/verifyTokens";
import { getBalance, postBalance } from "../controllers/balance.controller";

const router = Router();

// GET /api/balance => получить текущий баланс
router.get("/", verifyAccessToken, getBalance);

// POST /api/balance => установить или вернуть баланс (зависит от тела)
router.post("/", verifyAccessToken, postBalance);

export default router;
