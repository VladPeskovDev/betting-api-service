import { Router, Request, Response } from "express";
import axios from "axios";
import { getExternalApiCredentials, createSignature } from "../utils/apiAuth";
import { verifyAccessToken } from "../middlewares/verifyTokens";


const router = Router();

const AUTH_API_URL = process.env.AUTH_API_URL || "https://bet-provider.coolify.tgapps.cloud/api/auth";

router.post("/", verifyAccessToken,  async (req: Request, res: Response): Promise<void> => {
  try {
    const user = res.locals.user as { userId?: number };
    if (!user?.userId) {
       res.status(401).json({ error: "No userId in token" });
       return;
    }

    const { externalUserId, secretKey } = await getExternalApiCredentials(user.userId);
    const body = {};
    const signature = createSignature(secretKey, body);

    const response = await axios.post(AUTH_API_URL, body, {
      headers: {
        "user-id": externalUserId,
        "x-signature": signature,
        "Content-Type": "application/json",
      },
    });

     res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error in authentication:", error);
    res.status(500).json({
      statusCode: 500,
      error: "Authentication Failed",
      message: (error as Error).message,
    });
  }
});

export default router;
