import { Request, Response } from "express";
import { Decimal } from "@prisma/client/runtime/library"; // Добавляем импорт Decimal
import * as TransactionService from "../services/transaction.service";

/**
 * Интерфейс для описания транзакции
 */
interface Transaction {
  id: number;
  userId: number;
  betId: number | null;
  type: string;
  amount: Decimal;
  balanceBefore: Decimal;
  balanceAfter: Decimal;
  description: string;
  createdAt: Date;
}

/**
 * GET /api/transactions
 */
export async function getTransactions(req: Request, res: Response): Promise<void> {
  try {
    const user = res.locals.user as { userId?: number };
    if (!user?.userId) {
      res.status(401).json({ error: "No userId in token" });
      return;
    }

    // query-параметры ?page=1&limit=10
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    // Получение транзакций пользователя
    const result = await TransactionService.getTransactionsForUser(user.userId, page, limit);

    res.status(200).json({
      transactions: result.transactions.map((t: Transaction) => ({
        id: t.id.toString(),
        type: t.type,
        amount: t.amount.toNumber(), // ✅ Преобразуем Decimal в number
        balance_before: t.balanceBefore.toNumber(), // ✅ Преобразуем Decimal в number
        balance_after: t.balanceAfter.toNumber(), // ✅ Преобразуем Decimal в number
        description: t.description,
        created_at: t.createdAt,
      })),
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error in getTransactions:", error);
    res.status(500).json({
      statusCode: 500,
      error: "Internal Server Error",
      message: (error as Error).message,
    });
  }
}
