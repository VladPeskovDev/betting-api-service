import { prisma } from "../../prisma/client";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BET_API_BASE_URL = process.env.BETTING_API_URL || "https://bet-provider.coolify.tgapps.cloud/api";

export async function checkHealth() {
  const services = {
    api: "ok", 
    database: "unknown",
    external_api: "unknown",
  };

  // 1. Проверка базы данных
  try {
    await prisma.$queryRaw`SELECT 1`;
    services.database = "ok";
  } catch (error) {
    console.error("Database check failed:", (error as Error).message);
    services.database = "error";
  }

  // 2. Проверка внешнего API
  try {
    const response = await axios.get(`${BET_API_BASE_URL}/health`);

    if (response.data.status === "ok") {
      services.external_api = "ok";
    } else {
      services.external_api = "error";
    }
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("External API check failed:", errMsg);
    services.external_api = "error";
  }

  return services;
}
