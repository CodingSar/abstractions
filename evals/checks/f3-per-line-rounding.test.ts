import { expect, test } from "bun:test";
import { invoiceTotal, roundCents } from "../src/index";

test("each line is rounded before summing", () => {
  // 100 cents at 7.25% = 107.25 -> 107 per line; three lines -> 321, not round(321.75) = 322
  expect(invoiceTotal([{ cents: 100, rate: 0.0725 }, { cents: 100, rate: 0.0725 }, { cents: 100, rate: 0.0725 }])).toBe(321);
});
test("half up per line", () => {
  // 50 cents at 1% = 50.5 -> 51 per line; two lines -> 102, not round(101) = 101
  expect(invoiceTotal([{ cents: 50, rate: 0.01 }, { cents: 50, rate: 0.01 }])).toBe(102);
});
test("roundCents unchanged", () => {
  expect(roundCents(10.5)).toBe(11);
  expect(roundCents(10.4)).toBe(10);
});
