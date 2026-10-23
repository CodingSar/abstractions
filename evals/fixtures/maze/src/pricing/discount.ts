// Percentage discounts for promotional campaigns.
export function applyDiscount(total: number, percent: number): number {
  return Math.round(total * (1 - percent / 100));
}
