import { prisma } from "../../prisma/client"; 
import * as betApiClient from "../api/betApiClient";
import { Decimal } from "@prisma/client/runtime/library";

/**
 * Получаем список ставок пользователя из нашей БД
 */
export async function getBetsByUserId(userId: number) {
  const bets = await prisma.bet.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  
  return bets;
}

/**
 * Получаем одну ставку по её ID (с проверкой, что принадлежит данному пользователю)
 */
export async function getBetById(userId: number, betId: number) {
  const bet = await prisma.bet.findFirst({
    where: {
      id: betId,
      userId,
    },
  });
  return bet;
}

export async function createBetForUser(userId: number, amount: number) {
  const userBalance = await prisma.userBalance.findUnique({
    where: { userId },
  });

  if (!userBalance) {
    throw new Error("User balance not found");
  }

  // 2. Преобразуем Decimal → Number
  const currentBalance = new Decimal(userBalance.balance).toNumber();

  // 3. Проверяем, хватает ли баланса
  if (currentBalance < amount) {
    throw new Error("Insufficient balance");
  }

  // 4. Вызываем API для размещения ставки
  const placeBetResult = await betApiClient.placeBet(amount);

  // 5. Вычисляем новый баланс
  const newBalance = new Decimal(currentBalance - amount);

  // 6. Сохраняем ставку в нашей БД
  const newBet = await prisma.bet.create({
    data: {
      userId,
      externalBetId: placeBetResult.bet_id.toString(),
      amount,
      status: "pending",
    },
  });

  // 7. Записываем транзакцию
  await prisma.transaction.create({
    data: {
      userId,
      betId: newBet.id,
      type: "bet_place",
      amount: amount,
      balanceBefore: currentBalance, // Старый баланс
      balanceAfter: newBalance.toNumber(), // Новый баланс
      description: `User placed bet #${newBet.id}`,
    },
  });

  // 8. Обновляем баланс пользователя
  await prisma.userBalance.update({
    where: { userId },
    data: { balance: newBalance },
  });

  return newBet;
}

/**
 * получаем рекомендуемый размер ставки из внешнего API
 */
export async function getRecommendedBetAmount(): Promise<number> {
  const data = await betApiClient.getRecommendedBet();
  return data.bet;
}
