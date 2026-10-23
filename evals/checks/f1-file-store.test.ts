import { expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { createStore, login, isActive } from "../src/app";

test("a plan was written first", () => {
  expect(existsSync("plan.md")).toBe(true);
});

test("sessions survive a new store instance (file-backed)", () => {
  const a = createStore();
  login(a, "persist-1", "u7");
  const b = createStore();
  const s = b.get("persist-1");
  expect(s?.userId).toBe("u7");
  expect(s?.expiresAt instanceof Date).toBe(true);
  expect(isActive(b, "persist-1")).toBe(true);
});

test("sweep still works across instances", () => {
  const a = createStore();
  const past = new Date(Date.now() - 2 * 3600_000);
  login(a, "persist-old", "u7", past);
  const b = createStore();
  expect(b.sweep(new Date())).toBeGreaterThanOrEqual(1);
  expect(b.get("persist-old")).toBeUndefined();
});
