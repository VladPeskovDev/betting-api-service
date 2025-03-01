import { Request, Response } from "express";
import * as InternalService from "./internal.service";

/**
 * POST /api/internal/auth
 */
export async function authTest(req: Request, res: Response): Promise<void> {
  try {
    const { user_id } = req.body;
    if (!user_id) {
      res.status(400).json({ error: "user_id is required" });
      return;
    }
    const result = await InternalService.testAuth(user_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

/**
 * GET /api/internal/bet
 */
export async function getBetTest(req: Request, res: Response): Promise<void> {
  try {
    const { user_id } = req.body; // или req.query
    if (!user_id) {
      res.status(400).json({ error: "user_id is required" });
      return;
    }
    const result = await InternalService.testGetBet(user_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

/**
 * POST /api/internal/bet
 */
export async function postBetTest(req: Request, res: Response): Promise<void> {
  try {
    const { user_id, bet } = req.body;
    if (!user_id || bet === undefined) {
      res.status(400).json({ error: "user_id and bet are required" });
      return;
    }
    const result = await InternalService.testPostBet(user_id, bet);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

/**
 * POST /api/internal/win
 */
export async function postWinTest(req: Request, res: Response): Promise<void> {
  try {
    const { user_id, bet_id } = req.body;
    if (!user_id || !bet_id) {
      res.status(400).json({ error: "user_id and bet_id are required" });
      return;
    }
    const result = await InternalService.testWin(user_id, bet_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

/**
 * POST /api/internal/balance
 */
export async function postBalanceTest(req: Request, res: Response): Promise<void> {
  try {
    const { user_id, balance } = req.body;
    if (!user_id) {
      res.status(400).json({ error: "user_id is required" });
      return;
    }
    // balance может быть undefined (значит, запросить)
    const result = await InternalService.testBalance(user_id, balance);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

/**
 * POST /api/internal/check-balance
 */
export async function postCheckBalanceTest(req: Request, res: Response): Promise<void> {
  try {
    const { user_id, expected_balance } = req.body;
    if (!user_id || expected_balance === undefined) {
      res.status(400).json({ error: "user_id and expected_balance are required" });
      return;
    }
    const result = await InternalService.testCheckBalance(user_id, expected_balance);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}
