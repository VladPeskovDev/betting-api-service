import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt.config";
import dotenv from "dotenv";

dotenv.config();

export const generateTokens = (payload: object) => ({
  accessToken: jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, jwtConfig.access),
  refreshToken: jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, jwtConfig.refresh),
});
