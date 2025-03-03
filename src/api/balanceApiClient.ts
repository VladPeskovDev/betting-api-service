import axios, { AxiosError } from "axios";
import { createSignature, getExternalApiCredentials } from "../utils/apiAuth";
import { logApiRequest } from "../utils/logApiRequest";

const BET_API_BASE_URL = process.env.BETTING_API_URL || "https://bet-provider.coolify.tgapps.cloud/api";


// Установить баланс во внешней системе с логированием.
 
export async function setBalance(userId: number, balance: number, ipAddress: string) {
  const { externalUserId, secretKey } = await getExternalApiCredentials(userId);
  const body = { balance };
  const signature = createSignature(secretKey, body);

  const startTime = Date.now();
  try {
    const response = await axios.post(`${BET_API_BASE_URL}/balance`, body, {
      headers: {
        "user-id": externalUserId,
        "x-signature": signature,
        "Content-Type": "application/json",
      },
    });

    await logApiRequest({
      userId,
      endpoint: "/balance",
      method: "POST",
      requestBody: body,
      responseBody: response.data,
      statusCode: response.status,
      requestDuration: Date.now() - startTime,
      ipAddress,
    });

    return response.data;
  } catch (err) {
    const error = err as AxiosError;

    await logApiRequest({
      userId,
      endpoint: "/balance",
      method: "POST",
      requestBody: body,
      responseBody: error.response?.data || { message: error.message },
      statusCode: error.response?.status || 500,
      requestDuration: Date.now() - startTime,
      ipAddress,
    });

    throw error;
  }
}

// Получить текущий баланс во внешней системе с логированием.
 
export async function getBalance(userId: number, ipAddress: string) {
  const { externalUserId, secretKey } = await getExternalApiCredentials(userId);
  const signature = createSignature(secretKey, null);

  const startTime = Date.now();
  try {
    const response = await axios.post(`${BET_API_BASE_URL}/balance`, {}, {
      headers: {
        "user-id": externalUserId,
        "x-signature": signature,
        "Content-Type": "application/json",
      },
    });

    await logApiRequest({
      userId,
      endpoint: "/balance",
      method: "POST",
      requestBody: {},
      responseBody: response.data,
      statusCode: response.status,
      requestDuration: Date.now() - startTime,
      ipAddress,
    });

    return response.data;
  } catch (err) {
    const error = err as AxiosError;

    await logApiRequest({
      userId,
      endpoint: "/balance",
      method: "POST",
      requestBody: {},
      responseBody: error.response?.data || { message: error.message },
      statusCode: error.response?.status || 500,
      requestDuration: Date.now() - startTime,
      ipAddress,
    });

    throw error;
  }
}
