import { prisma } from "../../prisma/client";

// Логирует запросы к внешнему API в таблицу ApiLog.
 
export async function logApiRequest({
  userId,
  endpoint,
  method,
  requestBody,
  responseBody,
  statusCode,
  requestDuration,
  ipAddress = "unknown",
}: {
  userId: number;
  endpoint: string;
  method: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  requestBody: any; // eslint-disable-next-line @typescript-eslint/no-explicit-any
  responseBody: any; 
  statusCode: number;
  requestDuration: number;
  ipAddress?: string;
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

    console.log(`API Log ok: ${method} ${endpoint} (User: ${userId})`);
  } catch (error) {
    console.error("Error saving API log:", error);
  }
}
