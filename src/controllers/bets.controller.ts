import { Request, Response } from "express";
import * as BetService from "../services/bet.service";

/**
 * GET /api/bets
 * Возвращает список ставок, сохранённый в нашей БД для данного пользователя
 */
export async function getUserBets(req: Request, res: Response): Promise<void> {
  try {
    // JWT-мидлварь сохраняет данные в res.locals.user
    // У нас токен содержит поле "userId"
    const user = res.locals.user as { userId?: number };

    // Проверяем, что у нас есть userId
    if (!user?.userId) {
      res.status(401).json({ error: "No userId in token" });
      return;
    }

    // Получаем ставки из БД, привязанные к user.userId
    const bets = await BetService.getBetsByUserId(user.userId);

    res.status(200).json({ bets });
  } catch (error) {
    console.error("Error in getUserBets:", error);
    res.status(500).json({
      statusCode: 500,
      error: "Internal Server Error",
      message: (error as Error).message,
    });
  }
}

/**
 * GET /api/bets/:id
 * Получает одну ставку (из нашей БД), принадлежащую пользователю
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
      res.status(400).json({
        statusCode: 400,
        error: "Bad Request",
        message: "Bet id must be a number",
      });
      return;
    }

    const bet = await BetService.getBetById(user.userId, betId);
    if (!bet) {
      res.status(404).json({
        statusCode: 404,
        error: "Not Found",
        message: "Bet not found",
      });
      return;
    }

    // Преобразуем данные ставки в нужный формат (если нужно)
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
    res.status(500).json({
      statusCode: 500,
      error: "Internal Server Error",
      message: (error as Error).message,
    });
  }
}

/**
 * POST /api/bets
 * Размещаем новую ставку:
 *  1) Вызываем внешний API (placeBet)
 *  2) Сохраняем ставку у себя (prisma.bet.create)
 *  3) Возвращаем результат
 */
export async function createBet(req: Request, res: Response): Promise<void> {
  try {
    const user = res.locals.user as { userId?: number };
    if (!user?.userId) {
      res.status(401).json({ error: "No userId in token" });
      return;
    }

    const { amount } = req.body;

    // Проверка валидности суммы
    if (typeof amount !== "number" || amount < 1 || amount > 5) {
      res.status(400).json({
        statusCode: 400,
        error: "Bad Request",
        message: "Invalid bet amount. Must be between 1 and 5.",
      });
      return;
    }

    // Сохраняем ставку во внешней системе + локально
    const newBet = await BetService.createBetForUser(user.userId, amount);

    // Отдаём клиенту результат
    res.status(201).json({
      id: newBet.id,
      amount: newBet.amount,
      status: newBet.status,
      created_at: newBet.createdAt,
    });
  } catch (error) {
    console.error("Error in createBet:", error);
    res.status(500).json({
      statusCode: 500,
      error: "Internal Server Error",
      message: (error as Error).message,
    });
  }
}

/**
 * GET /api/bets/recommended
 * Получение рекомендуемой ставки (через внешний API)
 */
export async function getRecommendedBet(req: Request, res: Response): Promise<void> {
  try {
    // Если хотим проверить userId — смотрим user.userId
    // Но для рекомендуемой ставки не всегда нужно
    // const user = res.locals.user as { userId?: number };

    const recommended = await BetService.getRecommendedBetAmount();

    res.status(200).json({ recommended_amount: recommended });
  } catch (error) {
    console.error("Error in getRecommendedBet:", error);
    res.status(500).json({
      statusCode: 500,
      error: "Internal Server Error",
      message: (error as Error).message,
    });
  }
}
