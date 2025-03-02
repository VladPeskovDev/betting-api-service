import { Router } from "express";
import {
  getUserBets,
  getBetById,
  createBet,
  getRecommendedBet
} from "../controllers/bets.controller";
import { verifyAccessToken } from "../middlewares/verifyTokens";

const router = Router();

router.get("/", verifyAccessToken, getUserBets);
router.get("/recommended", verifyAccessToken, getRecommendedBet);
router.get("/:id", verifyAccessToken, getBetById);
router.post("/", verifyAccessToken, createBet);


export default router;
