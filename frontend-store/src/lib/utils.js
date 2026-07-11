export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatCurrency(value) {
  if (value === null || value === undefined || value === "") return "₹—";
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "₹—";
  return inrFormatter.format(amount).replace(/\s/g, "");
}
