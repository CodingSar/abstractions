// In-memory tables. Seeded at import time.
type Row = Record<string, unknown>;
const tables = new Map<string, Map<string, Row>>();

export function table(name: string): Map<string, Row> {
  let t = tables.get(name);
  if (!t) {
    t = new Map();
    tables.set(name, t);
  }
  return t;
}

table("users").set("u1", { id: "u1", name: "Ada", email: "ada@example.com" });
table("users").set("u2", { id: "u2", name: "Grace", email: "grace@example.com" });
table("orders").set("o1", { id: "o1", userId: "u1", total: 1999, status: "paid" });
table("orders").set("o2", { id: "o2", userId: "u2", total: 250, status: "pending" });
