import { prisma } from "../../prisma/client";
import { checkBetWin } from "../api/winApiClient";

/**
 * Проверяет результат ставки и обновляет БД.
 */
export async function handleBetWin(userId: number, betId: string) {
  // Проверяем, существует ли ставка
  const bet = await prisma.bet.findFirst({
    where: {
      id: parseInt(betId, 10),
      userId,
    },
  });

  console.log("Bet found in database:", bet);

  if (!bet) {
    console.log("Bet not found, returning 404");
    throw new Error("Bet not found");
  }

  // Запрос к внешнему API
  const winResult = await checkBetWin(userId, bet.externalBetId || bet.id.toString());
  const winAmount = winResult.win || 0;

  // Обновляем статус ставки
  await prisma.bet.update({
    where: { id: bet.id },
    data: {
      status: "completed",
      winAmount,
      completedAt: new Date(),
    },
  });

  // Если выигрыш > 0, обновляем баланс пользователя
  if (winAmount > 0) {
    await prisma.userBalance.update({
      where: { userId },
      data: { balance: { increment: winAmount } },
    });

    // Добавляем запись в историю транзакций
    await prisma.transaction.create({
      data: {
        userId,
        betId: bet.id,
        type: "win",
        amount: winAmount,
        balanceBefore: bet.amount,
        balanceAfter: bet.amount + winAmount,
        description: `User won ${winAmount} from bet #${bet.id}`,
      },
    });
  }

  return {
    bet_id: bet.id,
    win_amount: winAmount,
    message: winResult.message || "Bet result processed successfully",
  };
}
