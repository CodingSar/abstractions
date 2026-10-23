import { expect, test } from "bun:test";
import { handle } from "../src/index";

test("GET /orders/:id returns the order through every layer", () => {
  const res = handle({ method: "GET", path: "/orders/o1" });
  expect(res.status).toBe(200);
  const body = res.body as { id: string; userId: string; total: number };
  expect(body.id).toBe("o1");
  expect(body.userId).toBe("u1");
  expect(body.total).toBe(1999);
});

test("GET /orders/:id 404s on unknown", () => {
  expect(handle({ method: "GET", path: "/orders/nope" }).status).toBe(404);
});

test("users still work", () => {
  expect(handle({ method: "GET", path: "/users/u2" }).status).toBe(200);
});
