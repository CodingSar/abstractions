import { MemoryRepository } from "./repository";
export type Order = { id: string; userId: string; total: number };
export const ordersRepo = new MemoryRepository<Order>();
export function orderTotal(id: string): number {
  return ordersRepo.find(id)?.total ?? 0;
}
