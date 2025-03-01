import { Router } from "express";
import {
  getUserBets,
  getBetById,
  createBet,
  getRecommendedBet,
} from "../controllers/bets.controller";

// middleware, который проверяет JWT:
import { verifyAccessToken } from "../middlewares/verifyTokens";

const router = Router();

// GET /api/bets (история ставок)
router.get("/", verifyAccessToken, getUserBets);

// GET /api/bets/recommended (рекомендуемая ставка)
router.get("/recommended", verifyAccessToken, getRecommendedBet);

// GET /api/bets/:id (одна ставка)
router.get("/:id", verifyAccessToken, getBetById);

// POST /api/bets (новая ставка)
router.post("/", verifyAccessToken, createBet);



export default router;
