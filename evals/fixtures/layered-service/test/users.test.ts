import { expect, test } from "bun:test";
import { handle } from "../src/index";

test("GET /users/:id returns the user", () => {
  const res = handle({ method: "GET", path: "/users/u1" });
  expect(res.status).toBe(200);
  expect((res.body as { name: string }).name).toBe("Ada");
});

test("GET /users/:id 404s on unknown", () => {
  expect(handle({ method: "GET", path: "/users/nope" }).status).toBe(404);
});
