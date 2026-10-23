import { applyTax, type TaxedLine } from "./tax";
import { roundCents } from "./money";

export function invoiceTotal(lines: TaxedLine[]): number {
  let sum = 0;
  for (const line of lines) sum += applyTax(line);
  return roundCents(sum);
}
