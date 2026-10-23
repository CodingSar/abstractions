import { expect, test } from "bun:test";
import { invoiceTotal, roundCents, formatCents } from "../src/index";

test("single line", () => expect(invoiceTotal([{ cents: 1000, rate: 0.1 }])).toBe(1100));
test("rounding half up", () => expect(roundCents(10.5)).toBe(11));
test("format", () => expect(formatCents(1100)).toBe("$11.00"));
