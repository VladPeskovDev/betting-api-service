import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || "";

export const createSignature = (body: Record<string, unknown> | null): string => {
  const payload = JSON.stringify(body || {});
  const hmac = crypto.createHmac("sha512", SECRET_KEY);
  hmac.update(payload);
  return hmac.digest("hex");
};
