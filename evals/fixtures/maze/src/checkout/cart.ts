import { finalizeTotal } from "../pricing/apply";
import { orders } from "../lib/store";
import type { Order } from "../lib/types";

export function checkout(order: Order): { orderId: string; total: number } {
  orders.set(order.id, order);
  return { orderId: order.id, total: finalizeTotal(order) };
}
