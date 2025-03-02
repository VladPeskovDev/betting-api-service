import { Router } from "express";
import {
  authTest,
  getBetTest,
  postBetTest,
  postWinTest,
  postBalanceTest,
  postCheckBalanceTest
} from "./internal.controller";
import { verifyAccessToken } from "../middlewares/verifyTokens";
import { verifyInternalAdmin } from "./internal.middleware";

const router = Router();

/**
 Все эндпоинты: /api/internal/
 Сначала проверяем JWT (verifyAccessToken),
 потом проверяем, что наш user админ.
 */

router.use(verifyAccessToken);
router.use(verifyInternalAdmin);


/**
 * POST /api/internal/auth
 */
router.post("/auth", authTest);

/**
 * GET /api/internal/bet
 */
router.get("/bet", getBetTest);

/**
 * POST /api/internal/bet
 */
router.post("/bet", postBetTest);

/**
 * POST /api/internal/win
 */
router.post("/win", postWinTest);

/**
 * POST /api/internal/balance
 */
router.post("/balance", postBalanceTest);

/**
 * POST /api/internal/check-balance
 */
router.post("/check-balance", postCheckBalanceTest);

export default router;
