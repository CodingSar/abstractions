import { users } from "../lib/store";

// Bulk import from a CSV export: id,email,name
export function importUsers(csv: string): number {
  let n = 0;
  for (const row of csv.split("\n")) {
    const [id, email, name] = row.split(",");
    if (!id || !email) continue;
    users.set(id, { id, email, name: name ?? "" });
    n++;
  }
  return n;
}
