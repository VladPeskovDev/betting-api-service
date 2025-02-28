import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { authenticateUser } from "../services/auth.service";
import { convertExpiresToSeconds } from "../utils/convertExpires";


export const signin = asyncHandler(async (req: Request, res: Response) => {
    const { username } = req.body;
    if (!username) {
      res.status(400).json({ error: "Missing username" });
      return; 
    }

    try {
      const { token, expiresIn } = await authenticateUser(username);
      const numericExpires = convertExpiresToSeconds(expiresIn);
      res.json({ token, expiresIn: numericExpires }); 
    } catch (error) {
        void error;
        res.status(404).json({
          statusCode: 404,
          error: "Not Found",
          message: "User not found",
      });
    }
  });
  