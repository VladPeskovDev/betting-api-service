import { prisma } from "../../prisma/client";

/**
 * Логирует запросы к внешнему API в таблицу ApiLog.
 */
export async function logApiRequest({
  userId,
  endpoint,
  method,
  requestBody,
  responseBody,
  statusCode,
  requestDuration,
  ipAddress,
}: {
  userId: number;
  endpoint: string;
  method: string;
  requestBody: unknown;
  responseBody: unknown;
  statusCode: number;
  requestDuration: number;
  ipAddress: string;
}) {
  try {
    await prisma.apiLog.create({
      data: {
        userId,
        endpoint,
        method,
        requestBody,
        responseBody,
        statusCode,
        requestDuration,
        ipAddress,
      },
    });

    console.log(`📝 API Log recorded: ${method} ${endpoint} (User: ${userId})`);
  } catch (error) {
    console.error("❌ Error saving API log:", error);
  }
}
