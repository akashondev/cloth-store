import jwt from "jsonwebtoken";

export function generateVerificationToken(email) {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });
}
