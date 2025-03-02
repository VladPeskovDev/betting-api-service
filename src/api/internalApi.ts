import axios, { AxiosError } from "axios";
import crypto from "crypto";
import dotenv from "dotenv";
import { prisma } from "../../prisma/client"; // Подключаем Prisma

dotenv.config();

const BET_API_BASE_URL = process.env.BETTING_API_URL || "https://bet-provider.coolify.tgapps.cloud/api";

/**
 * Функция получения API-ключа и ID админа из БД
 */
async function getAdminCredentials() {
  const adminCredentials = await prisma.externalApiAccount.findUnique({
    where: { userId: 2 }, 
  });

  if (!adminCredentials) {
    throw new Error("Admin API credentials not found in the database");
  }

  return {
    userId: adminCredentials.externalUserId,
    secretKey: adminCredentials.externalSecretKey,
  };
}

/**
 * Создаёт HMAC SHA-512 подпись
 */
function createSignature(body: Record<string, unknown>, secretKey: string): string {
  const payload = JSON.stringify(body);
  return crypto.createHmac("sha512", secretKey).update(payload).digest("hex");
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
    // Получаем актуальные креды админа из БД
    const { userId, secretKey } = await getAdminCredentials();
    
    // Генерируем подпись
    const signature = createSignature(method === "GET" ? {} : data, secretKey);

    const headers = {
      "user-id": userId,
      "x-signature": signature,
      "Content-Type": "application/json",
    };

    console.log("🔹 Отправляем запрос в API:", { method, url: `${BET_API_BASE_URL}${endpoint}`, headers });

    let response;
    if (method === "GET") {
      response = await axios.get(`${BET_API_BASE_URL}${endpoint}`, { headers });
    } else {
      response = await axios.post(`${BET_API_BASE_URL}${endpoint}`, data, { headers });
    }

    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    console.error("❌ Ошибка при вызове внешнего API:", error.response?.data || error.message);
    throw new Error(`External API error: ${JSON.stringify(error.response?.data || error.message)}`);
  }
}

export { callExternalApi };
