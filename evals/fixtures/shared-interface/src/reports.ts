import { ordersRepo } from "./orders";
import { usersRepo } from "./users";
export function orderReport(orderId: string): string {
  const o = ordersRepo.find(orderId);
  if (!o) return "no order";
  const u = usersRepo.find(o.userId);
  return `${o.id} for ${u?.name ?? "?"}: ${o.total}`;
}
