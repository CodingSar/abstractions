import { users } from "../lib/store";

export function updateProfile(id: string, patch: { email?: string; name?: string }): void {
  const u = users.get(id);
  if (!u) throw new Error("no user");
  if (patch.name !== undefined) u.name = patch.name;
  if (patch.email !== undefined) u.email = patch.email.trim().toLowerCase();
}
