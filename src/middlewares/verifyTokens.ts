import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();


//  Проверяем JWT-токен из заголовка Authorization: Bearer 
 
export const verifyAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error("No token provided");
    }

    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) {
      throw new Error("No token provided");
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!);

    res.locals.user = decoded;
    

    next();
  } catch (error) {
    console.log("Invalid access token:", error);
    res.sendStatus(403);
  }
};
