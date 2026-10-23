import { users } from "../lib/store";

export function notifyUser(id: string, message: string): string {
  const u = users.get(id);
  if (!u) return "";
  return `to: ${u.email}\n\n${message}`;
}
