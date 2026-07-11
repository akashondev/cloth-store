import test from "node:test";
import assert from "node:assert/strict";
import { validateEmailDomain } from "../utils/emailValidation.js";

test("email validation rejects malformed addresses and domains without MX", async () => {
  await assert.rejects(() => validateEmailDomain("fake", async () => []), /valid email/);
  await assert.rejects(() => validateEmailDomain("a@example.test", async () => []), /receive email/);
});

test("email validation normalizes addresses with MX records", async () => {
  const result = await validateEmailDomain(" User@Example.com ", async () => [{ exchange: "mail.example.com" }]);
  assert.equal(result.normalizedEmail, "user@example.com");
});
