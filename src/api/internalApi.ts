import axios, { AxiosError } from "axios";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const BET_API_BASE_URL = process.env.BETTING_API_URL || "https://bet-provider.coolify.tgapps.cloud/api";
const USER_ID = process.env.BETTING_USER_ID || "12";
const SECRET_KEY = process.env.BETTING_SECRET_KEY || "6b34fe24ac2ff8103f6fce1f0da2ef57";

/**
 * Создаёт HMAC SHA-512 подпись
 */
function createSignature(body: Record<string, unknown>): string {
  const payload = JSON.stringify(body);
  return crypto.createHmac("sha512", SECRET_KEY).update(payload).digest("hex");
}

/**
 * Универсальная отправка запросов во внешний API
 */
async function callExternalApi(
  method: "GET" | "POST",
  endpoint: string,
  data: Record<string, unknown> = {}
) {
  try {
    const signature = createSignature(method === "GET" ? {} : data); // Только для `POST`!

    const headers = {
      "user-id": USER_ID,
      "x-signature": signature,
      "Content-Type": "application/json",
    };

    console.log("Отправляем запрос в API:", { method, url: `${BET_API_BASE_URL}${endpoint}`, headers });

    let response;
    if (method === "GET") {
      response = await axios.get(`${BET_API_BASE_URL}${endpoint}`, { headers });
    } else {
      response = await axios.post(`${BET_API_BASE_URL}${endpoint}`, data, { headers });
    }

    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    console.error("Ошибка при вызове внешнего API:", error.response?.data || error.message);
    throw new Error(`External API error: ${JSON.stringify(error.response?.data || error.message)}`);
  }
}

export { callExternalApi };
