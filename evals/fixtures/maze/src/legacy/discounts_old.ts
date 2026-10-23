// Old discount engine, replaced in 2023. Kept for reference; not imported anywhere.
export function legacyDiscount(total: number, code: string): number {
  if (code === "OLD5") return total - 500;
  return total;
}
