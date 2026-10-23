import { orders } from "../lib/store";
import { subtotal } from "../pricing/apply";

export function receipt(orderId: string): string {
  const o = orders.get(orderId);
  if (!o) return "no such order";
  return `order ${o.id}: subtotal ${subtotal(o)} cents`;
}
