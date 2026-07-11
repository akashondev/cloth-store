import test from "node:test";
import assert from "node:assert/strict";

import { allowedOrigins, corsOptions } from "../utils/corsConfig.js";

test("allows the deployed storefront and supported local frontend origins", () => {
  assert.deepEqual(allowedOrigins, [
    "https://styllin.onrender.com",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
  ]);
});

test("does not enable credentialed CORS when auth uses local storage tokens", () => {
  assert.equal(corsOptions.credentials, undefined);
});
