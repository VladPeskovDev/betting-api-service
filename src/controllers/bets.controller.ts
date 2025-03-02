import { Request, Response } from "express";
import * as BetService from "../services/bet.service";

/**
 * GET /api/bets (История ставок)
 */
export async function getUserBets(req: Request, res: Response): Promise<void> {
  try {
    const user = res.locals.user as { userId?: number };
    if (!user?.userId) {
      res.status(401).json({ error: "No userId in token" });
      return;
    }

    const bets = await BetService.getBetsByUserId(user.userId);
    res.status(200).json({ bets });
  } catch (error) {
    console.error("Error in getUserBets:", error);
    res.status(500).json({ error: "Internal Server Error", message: (error as Error).message });
  }
}

/**
 * GET /api/bets/:id (Получение одной ставки по ID)
 */
export async function getBetById(req: Request, res: Response): Promise<void> {
  try {
    const user = res.locals.user as { userId?: number };
    if (!user?.userId) {
      res.status(401).json({ error: "No userId in token" });
      return;
    }

    const betId = parseInt(req.params.id, 10);
    if (isNaN(betId)) {
      res.status(400).json({ error: "Invalid bet ID. It must be a number." });
      return;
    }

    const bet = await BetService.getBetById(user.userId, betId);
    if (!bet) {
      res.status(404).json({ error: "Bet not found" });
      return;
    }

    res.status(200).json({
      id: bet.id,
      amount: bet.amount,
      status: bet.status,
      win_amount: bet.winAmount,
      created_at: bet.createdAt,
      completed_at: bet.completedAt,
    });
  } catch (error) {
    console.error("Error in getBetById:", error);
    res.status(500).json({ error: "Internal Server Error", message: (error as Error).message });
  }
}

/**
 * POST /api/bets (Создание ставки)
 */
export async function createBet(req: Request, res: Response): Promise<void> {
  try {
    const user = res.locals.user as { userId?: number };
    if (!user?.userId) {
      res.status(401).json({ error: "No userId in token" });
      return;
    }

    const { amount } = req.body;
    if (typeof amount !== "number" || amount < 1 || amount > 5) {
      res.status(400).json({ error: "Invalid bet amount. Must be between 1 and 5." });
      return;
    }

    const newBet = await BetService.createBetForUser(user.userId, amount);
    res.status(201).json({
      id: newBet.id,
      amount: newBet.amount,
      status: newBet.status,
      created_at: newBet.createdAt,
    });
  } catch (error) {
    console.error("Error in createBet:", error);
    res.status(500).json({ error: "Internal Server Error", message: (error as Error).message });
  }
}

/**
 * GET /api/bets/recommended (Получение рекомендуемой ставки)
 */
export async function getRecommendedBet(req: Request, res: Response): Promise<void> {
  try {
    const user = res.locals.user as { userId?: number };
    if (!user?.userId) {
      res.status(401).json({ error: "No userId in token" });
      return;
    }

    const recommended = await BetService.getRecommendedBetAmount(user.userId);
    res.status(200).json({ recommended_amount: recommended });
  } catch (error) {
    console.error("Error in getRecommendedBet:", error);
    res.status(500).json({ error: "Internal Server Error", message: (error as Error).message });
  }
}

/**
 * POST /api/bets/win
 * Проверяет результат ставки, обновляет баланс и статус
 */
export async function checkBetWin(req: Request, res: Response): Promise<void> {
  try {
    const user = res.locals.user as { userId?: number };
    if (!user?.userId) {
      res.status(401).json({ error: "No userId in token" });
      return;
    }

    const { bet_id } = req.body;
    if (!bet_id) {
      res.status(400).json({ error: "bet_id is required" });
      return;
    }

    const result = await BetService.checkBetResult(user.userId, bet_id);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in checkBetWin:", error);
    res.status(500).json({ error: "Internal Server Error", message: (error as Error).message });
  }
}