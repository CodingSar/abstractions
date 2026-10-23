import { couponRate } from "./rates";
import type { Order } from "../lib/types";

export function subtotal(order: Order): number {
  return order.lines.reduce((s, l) => s + l.cents * l.qty, 0);
}

export function finalizeTotal(order: Order): number {
  const sub = subtotal(order);
  const rate = couponRate(order.coupon);
  const reduced = sub - Math.round(sub * rate);
  return reduced + order.shippingCents;
}
