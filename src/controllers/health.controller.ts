import { Request, Response } from "express";
import { checkHealth } from "../services/health.service";


export async function getHealthStatus(req: Request, res: Response) {
  try {
    const services = await checkHealth();
    const overallStatus = Object.values(services).includes("error") ? "error" : "ok";
    const responseBody = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      services,
    };

    return res.status(200).json(responseBody);
  } catch (error) {
    console.error("Health check error:", error);
    return res.status(500).json({
      statusCode: 500,
      error: "Internal Server Error",
      message: (error as Error).message,
    });
  }
}
