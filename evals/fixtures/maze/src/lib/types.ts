export type Line = { sku: string; cents: number; qty: number };
export type Order = { id: string; userId: string; lines: Line[]; coupon?: string; shippingCents: number };
export type User = { id: string; email: string; name: string };
