import { Request, Response, NextFunction } from "express";
import { handleBetWin } from "../services/winService";

export async function processBetWin(req: Request, res: Response, next: NextFunction): Promise<void> {
  console.log("Received request on /api/win");

  try {
    const user = res.locals.user as { userId?: number };
    console.log("Extracted user from token:", user);

    if (!user?.userId) {
      console.log("No userId found in token, returning 401");
      res.status(401).json({ error: "No userId in token" });
      return;
    }

    const { bet_id } = req.body;
    console.log("Received bet_id:", bet_id);

    if (!bet_id) {
      console.log("Missing bet_id, returning 400");
      res.status(400).json({ error: "bet_id is required" });
      return;
    }

    // **Получаем IP-адрес пользователя**
    const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";

    // Вызываем сервис обработки выигрыша
    const result = await handleBetWin(user.userId, bet_id, ipAddress.toString());
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in /api/win:", error);
    next(error);
  }
}
