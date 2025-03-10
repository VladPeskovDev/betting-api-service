import { Request } from "express";
import { prisma } from "../../prisma/client";
import * as balanceApiClient from "../api/balanceApiClient";

// Устанавливаем баланс (и во внешнем API, и у себя в БД).
 
export async function setBalanceForUser(userId: number, amount: number, req: Request) {
  const ipAddress = req.ip || "unknown"; // Получаем IP-адрес клиента

  // Устанавливаем баланс во внешнем сервисе
  const externalResponse = await balanceApiClient.setBalance(userId, amount, ipAddress);

  // Сохраняем/обновляем баланс у себя в таблице userBalance
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

// Получаем текущий баланс (и синхронизируем с внешним API).
 
export async function getBalanceForUser(userId: number, req: Request) {
  const ipAddress = req.ip || "unknown"; 

  // Запрашиваем баланс у внешнего API
  const externalBalanceResult = await balanceApiClient.getBalance(userId, ipAddress);

  // Обновляем/сохраняем баланс в нашей БД
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
