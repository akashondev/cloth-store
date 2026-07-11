import { resolveMx } from "node:dns/promises";

export async function validateEmailDomain(email, lookupMx = resolveMx) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const match = /^[^\s@]+@([^\s@]+\.[^\s@]+)$/.exec(normalizedEmail);
  if (!match) throw new Error("Enter a valid email address");
  try {
    const records = await lookupMx(match[1]);
    if (!Array.isArray(records) || records.length === 0) throw new Error("missing mx");
  } catch {
    throw new Error("This email domain cannot receive email");
  }
  return { normalizedEmail };
}
