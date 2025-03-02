import axios from "axios";
import { createSignature, getExternalApiCredentials } from "../utils/apiAuth";


const BET_API_BASE_URL = process.env.BETTING_API_URL || "https://bet-provider.coolify.tgapps.cloud/api";

/**
 * Установить баланс во внешней системе.
 */
export async function setBalance(userId: number, balance: number) {
  const { externalUserId, secretKey } = await getExternalApiCredentials(userId);
  const body = { balance };
  const signature = createSignature(secretKey, body);

  const response = await axios.post(`${BET_API_BASE_URL}/balance`, body, {
    headers: {
      "user-id": externalUserId,
      "x-signature": signature,
      "Content-Type": "application/json",
    },
  });

  return response.data;
}

/**
 * Получить текущий баланс во внешней системе.
 */
export async function getBalance(userId: number) {
  const { externalUserId, secretKey } = await getExternalApiCredentials(userId);
  const signature = createSignature(secretKey, null);

  const response = await axios.post(`${BET_API_BASE_URL}/balance`, {}, {
    headers: {
      "user-id": externalUserId,
      "x-signature": signature,
      "Content-Type": "application/json",
    },
  });

  return response.data;
}
