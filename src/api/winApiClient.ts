import axios, { AxiosError } from "axios";
import { createSignature, getExternalApiCredentials } from "../utils/apiAuth";
import { logApiRequest } from "../utils/logApiRequest";

const BET_API_BASE_URL = process.env.BETTING_API_URL || "https://bet-provider.coolify.tgapps.cloud/api";

// Запрашивает результат ставки у внешнего API и логирует запрос.
 
export async function checkBetWin(userId: number, betId: string, ipAddress: string) {
  const { externalUserId, secretKey } = await getExternalApiCredentials(userId);
  const body = { bet_id: betId };
  const signature = createSignature(secretKey, body);
  const endpoint = "/win";

  const startTime = Date.now(); // Засекаем время запроса для логов 

  try {
    const response = await axios.post(`${BET_API_BASE_URL}${endpoint}`, body, {
      headers: {
        "user-id": externalUserId,
        "x-signature": signature,
        "Content-Type": "application/json",
      },
    });

    const duration = Date.now() - startTime; // Считаем длительность запроса для логов 

    //  успешный запрос
    await logApiRequest({
      userId,
      endpoint,
      method: "POST",
      requestBody: body,
      responseBody: response.data,
      statusCode: response.status,
      requestDuration: duration,
      ipAddress,
    });

    console.log("Received response from external API:", response.data);
    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    const duration = Date.now() - startTime;

    //  неудачный запрос
    await logApiRequest({
      userId,
      endpoint,
      method: "POST",
      requestBody: body,
      responseBody: error.response?.data || { error: error.message },
      statusCode: error.response?.status || 500,
      requestDuration: duration,
      ipAddress,
    });

    console.error("❌ External API error:", error.response?.data || error.message);
    throw error;
  }
}
