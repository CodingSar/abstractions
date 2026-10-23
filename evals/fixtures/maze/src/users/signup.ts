import { users } from "../lib/store";

export function signup(id: string, email: string, name: string): void {
  users.set(id, { id, email: email.trim().toLowerCase(), name });
}
