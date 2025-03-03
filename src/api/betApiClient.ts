import axios, { AxiosError } from "axios";
import { createSignature, getExternalApiCredentials } from "../utils/apiAuth";
import { logApiRequest } from "../utils/logApiRequest";

const BET_API_BASE_URL = process.env.BETTING_API_URL || "https://bet-provider.coolify.tgapps.cloud/api";

// Размещаем ставку во внешней системе с логированием.
 
export async function placeBet(userId: number, amount: number, ipAddress: string) {
  const { externalUserId, secretKey } = await getExternalApiCredentials(userId);
  const body = { bet: amount };
  const signature = createSignature(secretKey, body);
  const startTime = Date.now();
  
  try {
    const response = await axios.post(`${BET_API_BASE_URL}/bet`, body, {
      headers: {
        "user-id": externalUserId,
        "x-signature": signature,
        "Content-Type": "application/json",
      },
    });

    await logApiRequest({ userId, endpoint: "/bet", method: "POST", requestBody: body, responseBody: response.data, statusCode: response.status, requestDuration: Date.now() - startTime, ipAddress });
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    await logApiRequest({ userId, endpoint: "/bet", method: "POST", requestBody: body, responseBody: err.response?.data || err.message, statusCode: err.response?.status || 500, requestDuration: Date.now() - startTime, ipAddress });
    throw error;
  }
}

// Получаем рекомендуемую ставку с логированием.
 
export async function getRecommendedBet(userId: number, ipAddress: string): Promise<{ bet: number }> {
  const { externalUserId, secretKey } = await getExternalApiCredentials(userId);
  const signature = createSignature(secretKey, null);
  const startTime = Date.now();
  
  try {
    const response = await axios.get(`${BET_API_BASE_URL}/bet`, {
      headers: {
        "user-id": externalUserId,
        "x-signature": signature,
        "Content-Type": "application/json",
      },
    });

    await logApiRequest({ userId, endpoint: "/bet", method: "GET", requestBody: {}, responseBody: response.data, statusCode: response.status, requestDuration: Date.now() - startTime, ipAddress });
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    await logApiRequest({ userId, endpoint: "/bet", method: "GET", requestBody: {}, responseBody: err.response?.data || err.message, statusCode: err.response?.status || 500, requestDuration: Date.now() - startTime, ipAddress });
    throw error;
  }
}

// Запрашиваем результат ставки с логированием.
 
export async function checkBetResult(userId: number, betId: string, ipAddress: string) {
  const { externalUserId, secretKey } = await getExternalApiCredentials(userId);
  const body = { bet_id: betId };
  const signature = createSignature(secretKey, body);
  const startTime = Date.now();
  
  try {
    const response = await axios.post(`${BET_API_BASE_URL}/win`, body, {
      headers: {
        "user-id": externalUserId,
        "x-signature": signature,
        "Content-Type": "application/json",
      },
    });

    await logApiRequest({ userId, endpoint: "/win", method: "POST", requestBody: body, responseBody: response.data, statusCode: response.status, requestDuration: Date.now() - startTime, ipAddress });
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    await logApiRequest({ userId, endpoint: "/win", method: "POST", requestBody: body, responseBody: err.response?.data || err.message, statusCode: err.response?.status || 500, requestDuration: Date.now() - startTime, ipAddress });
    throw error;
  }
}
