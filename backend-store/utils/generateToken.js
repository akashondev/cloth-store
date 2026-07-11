import jwt from "jsonwebtoken";
import { env } from "./env.js";

export function generateVerificationToken(email) {
  return jwt.sign({ email, purpose: "verify-email" }, env("JWT_SECRET"), { expiresIn: "1d" });
}
