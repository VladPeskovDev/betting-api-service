import axios, { AxiosError } from "axios";
import crypto from "crypto";
import dotenv from "dotenv";
import { prisma } from "../../prisma/client";

dotenv.config();

const BET_API_BASE_URL = process.env.BETTING_API_URL || "https://bet-provider.coolify.tgapps.cloud/api";

/**
 * Создаёт HMAC SHA-512 подпись для запроса
 */
function createSignature(secretKey: string, body: Record<string, unknown> | null): string {
  const payload = JSON.stringify(body || {});
  return crypto.createHmac("sha512", secretKey).update(payload).digest("hex");
}

/**
 * Получает API-учетные данные пользователя
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
 * Размещаем ставку во внешней системе
 */
export async function placeBet(userId: number, amount: number) {
  const { externalUserId, secretKey } = await getExternalApiCredentials(userId);
  const body = { bet: amount };
  const signature = createSignature(secretKey, body);

  try {
    const response = await axios.post(`${BET_API_BASE_URL}/bet`, body, {
      headers: {
        "user-id": externalUserId,
        "x-signature": signature,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    console.error("External API error:", error.response?.data || error.message);
    throw error;
  }
}

/**
 * Получаем рекомендуемую ставку
 */
export async function getRecommendedBet(userId: number): Promise<{ bet: number }> {
  const { externalUserId, secretKey } = await getExternalApiCredentials(userId);
  const signature = createSignature(secretKey, null);

  try {
    const response = await axios.get(`${BET_API_BASE_URL}/bet`, {
      headers: {
        "user-id": externalUserId,
        "x-signature": signature,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    console.error("External API error:", error.response?.data || error.message);
    throw error;
  }
}
