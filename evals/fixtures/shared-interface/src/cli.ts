import { usersRepo } from "./users";
import { ordersRepo } from "./orders";
export function lookup(kind: "user" | "order", id: string): string {
  const item = kind === "user" ? usersRepo.find(id) : ordersRepo.find(id);
  return item ? JSON.stringify(item) : "not found";
}
