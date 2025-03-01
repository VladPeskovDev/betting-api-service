import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers["user-id"];

  if (!userId || userId !== process.env.USER_ID) {
    return res.status(403).json({
      statusCode: 403,
      error: "Forbidden",
      message: "Invalid user-id",
    });
  }

  next();
};
