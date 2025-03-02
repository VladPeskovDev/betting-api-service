import { Router } from "express";
import { verifyAccessToken } from "../middlewares/verifyTokens";
import { processBetWin } from "../controllers/winController";

const router = Router();

router.post("/", verifyAccessToken, processBetWin);

export default router;





/*
import { Router, Request, Response, NextFunction } from "express";
import axios, { AxiosError } from "axios";
import crypto from "crypto";
import { prisma } from "../../prisma/client";
import { verifyAccessToken } from "../middlewares/verifyTokens";

const router = Router();
const BET_API_BASE_URL = process.env.BETTING_API_URL || "https://bet-provider.coolify.tgapps.cloud/api";


function createSignature(secretKey: string, body: Record<string, unknown> | null): string {
  const payload = JSON.stringify(body || {});
  return crypto.createHmac("sha512", secretKey).update(payload).digest("hex");
}


async function getExternalApiCredentials(userId: number) {
  const externalAccount = await prisma.externalApiAccount.findUnique({
    where: { userId },
  });

  if (!externalAccount) {
    throw new Error("External API credentials not found");
  }

  return {
    externalUserId: externalAccount.externalUserId,
    secretKey: externalAccount.externalSecretKey,
  };
}


router.post("/", verifyAccessToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    // Проверяем, существует ли ставка в базе
    const bet = await prisma.bet.findFirst({
      where: {
        id: parseInt(bet_id, 10),
        userId: user.userId, // Убеждаемся, что ставка принадлежит пользователю
      },
    });
    console.log("Bet found in database:", bet);

    if (!bet) {
        console.log("Bet not found, returning 404");
      res.status(404).json({ error: "Bet not found" });
      return;
    }

    // Получаем API-данные пользователя
    const { externalUserId, secretKey } = await getExternalApiCredentials(user.userId);

    // Формируем запрос к API
    const body = { bet_id: bet.externalBetId || bet.id.toString() };
    const signature = createSignature(secretKey, body);

    try {
      const response = await axios.post(`${BET_API_BASE_URL}/win`, body, {
        headers: {
          "user-id": externalUserId,
          "x-signature": signature,
          "Content-Type": "application/json",
        },
      });

      const winAmount = response.data.win || 0;

      // Обновляем статус ставки в БД
      await prisma.bet.update({
        where: { id: bet.id },
        data: {
          status: "completed",
          winAmount: winAmount,
          completedAt: new Date(),
        },
      });

      // Если есть выигрыш, обновляем баланс
      if (winAmount > 0) {
        await prisma.userBalance.update({
          where: { userId: user.userId },
          data: {
            balance: { increment: winAmount },
          },
        });

        // Добавляем запись о транзакции
        await prisma.transaction.create({
          data: {
            userId: user.userId,
            betId: bet.id,
            type: "win",
            amount: winAmount,
            balanceBefore: bet.amount,
            balanceAfter: bet.amount + winAmount,
            description: `User won ${winAmount} from bet #${bet.id}`,
          },
        });
      }

      res.status(200).json({
        bet_id: bet.id,
        win_amount: winAmount,
        message: response.data.message || "Bet result processed successfully",
      });
    } catch (err) {
      const error = err as AxiosError;
      console.error("External API error:", error.response?.data || error.message);
      next(error); // Передаем ошибку в Express error handler
    }
  } catch (error) {
    console.error("Error in /api/win:", error);
    next(error);
  }
});

export default router;
*/
