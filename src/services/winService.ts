import { prisma } from "../../prisma/client";
import { checkBetWin } from "../api/winApiClient";

/**
 * Проверяет результат ставки и обновляет БД.
 */
export async function handleBetWin(userId: number, betId: string, ipAddress: string) {
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

  // **Передаём IP-адрес в запрос**
  const winResult = await checkBetWin(userId, bet.externalBetId || bet.id.toString(), ipAddress);
  const winAmount = Number(winResult.win) || 0;  

  console.log(`Win result from API: ${JSON.stringify(winResult)}`);

  await prisma.bet.update({
    where: { id: bet.id },
    data: {
      status: "completed",
      winAmount,
      completedAt: new Date(),
    },
  });

  // Получаем текущий баланс пользователя
  const userBalance = await prisma.userBalance.findUnique({
    where: { userId },
  });

  if (!userBalance) {
    console.log("User balance record not found!");
    throw new Error("User balance record not found");
  }

  const balanceBefore = Number(userBalance.balance);  
  const balanceAfter = balanceBefore + winAmount;  

  console.log(`Updating balance: current=${balanceBefore}, winAmount=${winAmount}, new=${balanceAfter}`);

  if (winAmount > 0) {
    await prisma.userBalance.update({
      where: { userId },
      data: { balance: balanceAfter },
    });

    await prisma.transaction.create({
      data: {
        userId,
        betId: bet.id,
        type: "win",
        amount: winAmount,
        balanceBefore,
        balanceAfter,
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
