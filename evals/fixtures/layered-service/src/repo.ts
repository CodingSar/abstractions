import { table } from "./db";

export type User = { id: string; name: string; email: string };

export function findUser(id: string): User | undefined {
  return table("users").get(id) as User | undefined;
}
