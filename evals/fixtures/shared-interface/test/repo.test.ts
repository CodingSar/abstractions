import { expect, test } from "bun:test";
import { usersRepo, getUserName } from "../src/users";
import { ordersRepo, orderTotal } from "../src/orders";
import { invoicesRepo, invoiceAmount } from "../src/invoices";
import { orderReport } from "../src/reports";
import { lookup } from "../src/cli";
import { auditLine } from "../src/audit";

usersRepo.save({ id: "u1", name: "Ada" });
ordersRepo.save({ id: "o1", userId: "u1", total: 1999 });
invoicesRepo.save({ id: "i1", orderId: "o1", paid: false });

test("users", () => expect(getUserName("u1")).toBe("Ada"));
test("orders", () => expect(orderTotal("o1")).toBe(1999));
test("invoices", () => expect(invoiceAmount("i1")).toBe(1999));
test("reports", () => expect(orderReport("o1")).toBe("o1 for Ada: 1999"));
test("cli", () => expect(lookup("user", "u1")).toContain("Ada"));
test("audit", () => expect(auditLine("u1", "login")).toBe("Ada login"));
test("direct find", () => expect(usersRepo.find("u1")?.name).toBe("Ada"));
