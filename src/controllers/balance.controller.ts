import { Request, Response } from "express";
import * as BalanceService from "../services/balance.service";

/*
 * GET /api/balance
 * Получить текущий баланс из нашей БД (или синхронизировать)
 */
export async function getBalance(req: Request, res: Response): Promise<void> {
  try {
    const user = res.locals.user as { userId?: number };
    if (!user?.userId) {
      res.status(401).json({ error: "No userId in token" });
      return;
    }

    // Передаем req в сервис
    const result = await BalanceService.getBalanceForUser(user.userId, req);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getBalance:", error);
    res.status(500).json({
      statusCode: 500,
      error: "Internal Server Error",
      message: (error as Error).message,
    });
  }
}

/*
  POST /api/balance
  Логика: если тело содержит { balance: number }, то устанавливаем, иначе получаем.
 */
export async function postBalance(req: Request, res: Response): Promise<void> {
  try {
    const user = res.locals.user as { userId?: number };
    if (!user?.userId) {
      res.status(401).json({ error: "No userId in token" });
      return;
    }

    const { balance } = req.body;

    if (typeof balance === "number") {
      // Передаем req в сервис
      const result = await BalanceService.setBalanceForUser(user.userId, balance, req);
      res.status(200).json({
        message: result.message,
        balance: result.balance,
      });
    } else {
      // Передаем req в сервис
      const result = await BalanceService.getBalanceForUser(user.userId, req);
      res.status(200).json({
        balance: result.balance,
        last_updated: result.last_updated,
      });
    }
  } catch (error) {
    console.error("Error in postBalance:", error);
    res.status(500).json({
      statusCode: 500,
      error: "Internal Server Error",
      message: (error as Error).message,
    });
  }
}
