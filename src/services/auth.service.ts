import jwt, { SignOptions } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { jwtConfig } from "../config/jwt.config";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

export const authenticateUser = async (username: string) => {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw new Error("User not found");

  const signOptions: SignOptions = {
    expiresIn: jwtConfig.access.expiresIn, 
  };

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    process.env.ACCESS_TOKEN_SECRET!,
    signOptions
  );

  return { token, expiresIn: jwtConfig.access.expiresIn };
};
