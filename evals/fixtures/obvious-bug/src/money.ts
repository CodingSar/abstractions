// Round a cent amount that may carry a fraction. Half up.
export function roundCents(n: number): number {
  return Math.round(n);
}

export function formatCents(n: number): string {
  return `$${(n / 100).toFixed(2)}`;
}
