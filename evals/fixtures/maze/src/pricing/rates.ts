export const couponRates: Record<string, number> = { WELCOME10: 0.1, FRIEND: 0.15 };

export function couponRate(code: string | undefined): number {
  if (!code) return 0;
  return couponRates[code] ?? 0;
}
