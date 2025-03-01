import { prisma } from "../../prisma/client"; 
import * as balanceApiClient from "../api/balanceApiClient";

/**
 * Устанавливаем баланс (и во внешнем API, и у себя в БД).
 */
export async function setBalanceForUser(userId: number, amount: number) {
  // 1) Устанавливаем баланс во внешнем сервисе
  const externalResponse = await balanceApiClient.setBalance(amount);
  

  // 2) Сохраняем/обновляем баланс у себя в таблице userBalance (или user_balances).
  
  const userBalance = await prisma.userBalance.upsert({
    where: { userId },
    update: {
      balance: amount,
      externalBalance: amount,
      lastCheckedAt: new Date(),
    },
    create: {
      userId,
      balance: amount,
      externalBalance: amount,
      lastCheckedAt: new Date(),
    }
  });

  return {
    message: externalResponse.message,
    balance: userBalance.balance
  };
}

/**
 * Получаем текущий баланс (и синхронизируем с внешним).
 */
export async function getBalanceForUser(userId: number) {
  // 1) Запрашиваем у внешнего API
  const externalBalanceResult = await balanceApiClient.getBalance();
 

  // 2) Обновляем/сохраняем у себя
  const userBalance = await prisma.userBalance.upsert({
    where: { userId },
    update: {
      balance: externalBalanceResult.balance,
      externalBalance: externalBalanceResult.balance,
      lastCheckedAt: new Date(),
    },
    create: {
      userId,
      balance: externalBalanceResult.balance,
      externalBalance: externalBalanceResult.balance,
      lastCheckedAt: new Date(),
    }
  });

  return {
    balance: userBalance.balance,
    last_updated: userBalance.lastCheckedAt
  };
}
