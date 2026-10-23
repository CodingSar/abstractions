import { MemoryRepository } from "./repository";
import { ordersRepo } from "./orders";
export type Invoice = { id: string; orderId: string; paid: boolean };
export const invoicesRepo = new MemoryRepository<Invoice>();
export function invoiceAmount(id: string): number {
  const inv = invoicesRepo.find(id);
  if (!inv) return 0;
  return ordersRepo.find(inv.orderId)?.total ?? 0;
}
