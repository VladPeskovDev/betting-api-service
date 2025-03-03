import crypto from "crypto";
import { prisma } from "../../prisma/client";

// Создаёт  подпись на всех
 
export function createSignature(secretKey: string, body: Record<string, unknown> | null): string {
  const payload = JSON.stringify(body || {});
  return crypto.createHmac("sha512", secretKey).update(payload).digest("hex");
}

// Получает API-учетные данные пользователя
 
export async function getExternalApiCredentials(userId: number) {
  const externalAccount = await prisma.externalApiAccount.findUnique({
    where: { userId },
  });

  if (!externalAccount) {
    throw new Error(`External API credentials not found for user ${userId}`);
  }

  return {
    externalUserId: externalAccount.externalUserId,
    secretKey: externalAccount.externalSecretKey,
  };
}
