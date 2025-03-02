import { prisma } from "../../prisma/client"; 
import * as betApiClient from "../api/betApiClient";
import { Decimal } from "@prisma/client/runtime/library";

/**
 * Получаем список ставок пользователя из нашей БД
 */
export async function getBetsByUserId(userId: number) {
  return await prisma.bet.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Получаем одну ставку по её ID (с проверкой, что принадлежит данному пользователю)
 */
export async function getBetById(userId: number, betId: number) {
  return await prisma.bet.findFirst({
    where: {
      id: betId,
      userId,
    },
  });
}

/**
 * Размещаем ставку во внешней системе и сохраняем в БД
 */
export async function createBetForUser(userId: number, amount: number) {
  const userBalance = await prisma.userBalance.findUnique({
    where: { userId },
  });

  if (!userBalance) {
    throw new Error("User balance not found");
  }

  const currentBalance = new Decimal(userBalance.balance).toNumber();
  if (currentBalance < amount) {
    throw new Error("Insufficient balance");
  }

  // Вызываем API с ID пользователя из БД
  const placeBetResult = await betApiClient.placeBet(userId, amount);
  const newBalance = new Decimal(currentBalance - amount);

  const newBet = await prisma.bet.create({
    data: {
      userId,
      externalBetId: placeBetResult.bet_id.toString(),
      amount,
      status: "pending",
    },
  });

  await prisma.transaction.create({
    data: {
      userId,
      betId: newBet.id,
      type: "bet_place",
      amount: amount,
      balanceBefore: currentBalance,
      balanceAfter: newBalance.toNumber(),
      description: `User placed bet #${newBet.id}`,
    },
  });

  await prisma.userBalance.update({
    where: { userId },
    data: { balance: newBalance },
  });

  return newBet;
}

/**
 * Получаем рекомендуемый размер ставки из внешнего API
 */
export async function getRecommendedBetAmount(userId: number): Promise<number> {
  const data = await betApiClient.getRecommendedBet(userId);
  return data.bet;
}

/**
 * Запрашивает результат ставки, обновляет баланс и статус
 */
export async function checkBetResult(userId: number, betId: string) {
  const bet = await prisma.bet.findFirst({
    where: { externalBetId: betId, userId },
  });

  if (!bet) {
    throw new Error("Bet not found");
  }

  if (bet.status !== "pending") {
    throw new Error("Bet already settled");
  }

  const result = await betApiClient.checkBetResult(userId, betId);

  let winAmount = new Decimal(0);
  if (result.win) {
    winAmount = new Decimal(result.amount);
  }

  const updatedBet = await prisma.bet.update({
    where: { id: bet.id },
    data: {
      status: result.win ? "won" : "lost",
      winAmount: winAmount.toNumber(),
      completedAt: new Date(),
    },
  });

  const userBalance = await prisma.userBalance.findUnique({
    where: { userId },
  });

  if (!userBalance) {
    throw new Error("User balance not found");
  }

  const newBalance = new Decimal(userBalance.balance).plus(winAmount);

  await prisma.userBalance.update({
    where: { userId },
    data: { balance: newBalance },
  });

  await prisma.transaction.create({
    data: {
      userId,
      betId: bet.id,
      type: result.win ? "bet_win" : "bet_loss",
      amount: winAmount.toNumber(),
      balanceBefore: userBalance.balance,
      balanceAfter: newBalance.toNumber(),
      description: `Bet ${bet.id} was ${result.win ? "won" : "lost"}`,
    },
  });

  return {
    message: `Bet ${bet.id} ${result.win ? "won" : "lost"}`,
    balance: newBalance.toNumber(),
    winAmount: winAmount.toNumber(),
  };
}