const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatCurrency(amount: number) {
  return currencyFormatter.format(amount);
}

export function discountPercent(mrp: number, price: number) {
  return Math.round(((mrp - price) / mrp) * 100);
}
