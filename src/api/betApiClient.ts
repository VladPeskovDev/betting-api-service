import axios, { AxiosError } from "axios";
import { createSignature, getExternalApiCredentials } from "../utils/apiAuth";

const BET_API_BASE_URL = process.env.BETTING_API_URL || "https://bet-provider.coolify.tgapps.cloud/api";

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

/**
 * Запрос результата ставки
 */
export async function checkBetResult(userId: number, betId: string) {
  const { externalUserId, secretKey } = await getExternalApiCredentials(userId);
  const body = { bet_id: betId };
  const signature = createSignature(secretKey, body);

  try {
    const response = await axios.post(`${BET_API_BASE_URL}/win`, body, {
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
