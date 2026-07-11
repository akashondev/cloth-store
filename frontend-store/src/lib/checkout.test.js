import { createCheckoutSession, createCodOrder } from "./checkout";

test("creates checkout with normalized cart and coupon", async () => {
  const fetchImpl = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ url: "https://checkout.stripe.com/test" }) });
  await expect(createCheckoutSession({ userId: 7, cart: [{ id: 4, qty: 2, price: 1 }], couponCode: "SAVE10", fetchImpl })).resolves.toBe("https://checkout.stripe.com/test");
  expect(JSON.parse(fetchImpl.mock.calls[0][1].body)).toEqual({ userId: 7, cart: [{ id: 4, qty: 2 }], couponCode: "SAVE10" });
});

test("creates a COD order with the authoritative checkout payload", async () => {
  const fetchImpl = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ order: { id: "cod_1" }, message: "COD placed" }) });
  const result = await createCodOrder({ userId: 7, cart: [{ id: 4, qty: 2 }], couponCode: "FLAT50", fetchImpl });
  expect(result.order.id).toBe("cod_1");
  expect(fetchImpl.mock.calls[0][0]).toContain("create-cod-order");
  expect(JSON.parse(fetchImpl.mock.calls[0][1].body)).toEqual({ userId: 7, cart: [{ id: 4, qty: 2 }], couponCode: "FLAT50" });
});

test("surfaces backend checkout errors", async () => {
  const fetchImpl = jest.fn().mockResolvedValue({ ok: false, json: async () => ({ error: "Address required" }) });
  await expect(createCheckoutSession({ userId: 7, cart: [{ id: 4, qty: 1 }], fetchImpl })).rejects.toThrow("Address required");
});
