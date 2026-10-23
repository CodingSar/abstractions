import { expect, test } from "bun:test";
import { MemoryRepository } from "../src/repository";
import { usersRepo, getUserName } from "../src/users";
import { ordersRepo, orderTotal } from "../src/orders";
import { invoicesRepo, invoiceAmount } from "../src/invoices";
import { orderReport } from "../src/reports";
import { lookup } from "../src/cli";
import { auditLine } from "../src/audit";

usersRepo.save({ id: "u9", name: "Lin" });
ordersRepo.save({ id: "o9", userId: "u9", total: 42 });
invoicesRepo.save({ id: "i9", orderId: "o9", paid: true });

test("find takes an options object", () => {
  const r = new MemoryRepository<{ id: string; v: number }>();
  r.save({ id: "x", v: 1 });
  expect(r.find({ id: "x" })?.v).toBe(1);
  expect(r.find({ id: "nope" })).toBeUndefined();
});
test("every importer still works", () => {
  expect(getUserName("u9")).toBe("Lin");
  expect(orderTotal("o9")).toBe(42);
  expect(invoiceAmount("i9")).toBe(42);
  expect(orderReport("o9")).toBe("o9 for Lin: 42");
  expect(lookup("order", "o9")).toContain("42");
  expect(auditLine("u9", "pay")).toBe("Lin pay");
});
