import { formatCurrency } from "./utils";

test("formats valid values as Indian rupees", () => {
  expect(formatCurrency(1899)).toBe("₹1,899");
  expect(formatCurrency(0)).toBe("₹0");
  expect(formatCurrency("1250.4")).toBe("₹1,250");
});

test("returns a safe placeholder for invalid prices", () => {
  expect(formatCurrency(undefined)).toBe("₹—");
  expect(formatCurrency("bad")).toBe("₹—");
});
