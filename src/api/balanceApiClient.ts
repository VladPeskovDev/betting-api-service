import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";
import { prisma } from "../../prisma/client";

dotenv.config();

const BET_API_BASE_URL = process.env.BETTING_API_URL || "https://bet-provider.coolify.tgapps.cloud/api";

/**
 * Создает HMAC SHA-512 подпись
 */
function createSignature(secretKey: string, body: Record<string, unknown> | null): string {
  const payload = JSON.stringify(body || {});
  return crypto.createHmac("sha512", secretKey).update(payload).digest("hex");
}

/**
 * Получаем API-учетные данные пользователя для интеграции
 */
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

/**
 * Установить баланс во внешней системе.
 */
export async function setBalance(userId: number, balance: number): Promise<{ message: string; balance: number }> {
  const body = { balance };

  const { externalUserId, secretKey } = await getExternalApiCredentials(userId);
  const signature = createSignature(secretKey, body);

  const response = await axios.post(
    `${BET_API_BASE_URL}/balance`,
    body,
    {
      headers: {
        "user-id": externalUserId,
        "x-signature": signature,
        "Content-Type": "application/json",
      }
    }
  );

  return response.data;
}

/**
 * Получить текущий баланс во внешней системе.
 */
export async function getBalance(userId: number): Promise<{ balance: number }> {
  const { externalUserId, secretKey } = await getExternalApiCredentials(userId);
  const signature = createSignature(secretKey, null);

  const response = await axios.post(
    `${BET_API_BASE_URL}/balance`,
    {},
    {
      headers: {
        "user-id": externalUserId,
        "x-signature": signature,
        "Content-Type": "application/json",
      }
    }
  );

  return response.data;
}
