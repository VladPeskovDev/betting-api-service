import { Router } from "express";
import { verifyAccessToken } from "../middlewares/verifyTokens";
import { processBetWin } from "../controllers/winController";

const router = Router();

router.post("/", verifyAccessToken, processBetWin);

export default router;


