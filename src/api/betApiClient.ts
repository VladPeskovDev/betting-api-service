import axios, { AxiosError } from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const BET_API_BASE_URL =
  process.env.BETTING_API_URL ||
  'https://bet-provider.coolify.tgapps.cloud/api';
const USER_ID = process.env.BETTING_USER_ID || '12';
const SECRET_KEY = process.env.BETTING_SECRET_KEY || 'some-secret-key';

/**
 * Создает подпись HMAC SHA-512 для запроса
 */
function createSignature(body: Record<string, unknown> | null): string {
  const payload = JSON.stringify(body || {});
  return crypto.createHmac('sha512', SECRET_KEY).update(payload).digest('hex');
}

/**
 * Размещаем ставку во внешней системе
 */
export async function placeBet(amount: number) {
  const body = { bet: amount };
  const signature = createSignature(body);

  try {
    const response = await axios.post(`${BET_API_BASE_URL}/bet`, body, {
      headers: {
        'user-id': USER_ID,
        'x-signature': signature,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    console.error('External API error status:', error.response?.status);
    console.error('External API error data:', error.response?.data);
    throw error;
  }
}

/**
 * Получаем рекомендуемую ставку
 */
export async function getRecommendedBet(): Promise<{ bet: number }> {
  const signature = createSignature(null);

  const response = await axios.get(`${BET_API_BASE_URL}/bet`, {
    headers: {
      'user-id': USER_ID,
      'x-signature': signature,
      'Content-Type': 'application/json',
    },
  });

  return response.data;
}
