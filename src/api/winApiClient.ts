import axios, { AxiosError } from "axios";
import { createSignature, getExternalApiCredentials } from "../utils/apiAuth";


const BET_API_BASE_URL = process.env.BETTING_API_URL || "https://bet-provider.coolify.tgapps.cloud/api";

/**
 * Запрашивает результат ставки у внешнего API
 */
export async function checkBetWin(userId: number, betId: string) {
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

    console.log("Received response from external API:", response.data);
    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    console.error("External API error:", error.response?.data || error.message);
    throw error;
  }
}
