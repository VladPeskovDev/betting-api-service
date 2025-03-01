import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const BET_API_BASE_URL = process.env.BETTING_API_URL || "https://bet-provider.coolify.tgapps.cloud/api";
const USER_ID = process.env.BETTING_USER_ID || "12";
const SECRET_KEY = process.env.BETTING_SECRET_KEY || "some-secret-key";


//  подпись HMAC SHA-512
 
function createSignature(body: Record<string, unknown> | null): string {
  const payload = JSON.stringify(body || {});
  return crypto.createHmac("sha512", SECRET_KEY).update(payload).digest("hex");
}


 // Установить баланс во внешней системе.
 

export async function setBalance(balance: number): Promise<{ message: string; balance: number }> {
  const body = { balance };
  const signature = createSignature(body);

  const response = await axios.post(
    `${BET_API_BASE_URL}/balance`,
    body,
    {
      headers: {
        "user-id": USER_ID,
        "x-signature": signature,
        "Content-Type": "application/json",
      }
    }
  );

  return response.data;
}


 //Получить текущий баланс во внешней системе тоже самое без бади.
 

export async function getBalance(): Promise<{ balance: number }> {
  const signature = createSignature(null); 

  const response = await axios.post(
    `${BET_API_BASE_URL}/balance`,
    {}, 
    {
      headers: {
        "user-id": USER_ID,
        "x-signature": signature,
        "Content-Type": "application/json",
      }
    }
  );

  return response.data;
}
