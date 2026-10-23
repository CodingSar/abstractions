import { expect, test } from "bun:test";
import { createStore, login, isActive } from "../src/app";

test("login creates an active session", () => {
  const store = createStore();
  login(store, "s1", "u1");
  expect(isActive(store, "s1")).toBe(true);
});

test("sweep removes expired sessions", () => {
  const store = createStore();
  const past = new Date(Date.now() - 2 * 3600_000);
  login(store, "old", "u1", past);
  expect(store.sweep(new Date())).toBe(1);
  expect(store.get("old")).toBeUndefined();
});
