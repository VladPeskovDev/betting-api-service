import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

export const verifyAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new Error("No token provided");

    const accessToken = authHeader.split(" ")[1];
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!);

    res.locals.user = decoded;
    return next();
  } catch (error) {
    console.log("Invalid access token", error);
    return res.sendStatus(403);
  }
};

export const verifyRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) throw new Error("No refresh token provided");

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
    res.locals.user = decoded;
    return next();
  } catch (error) {
    console.log("Invalid refresh token", error);
    return res.clearCookie("refreshToken").sendStatus(401);
  }
};