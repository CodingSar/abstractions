import { users, orders } from "../lib/store";

export function report(): string {
  return `${users.size} users, ${orders.size} orders`;
}
