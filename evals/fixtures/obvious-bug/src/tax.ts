export type TaxedLine = { cents: number; rate: number };

// Returns the taxed amount for one line.
export function applyTax(line: TaxedLine): number {
  return line.cents * (1 + line.rate);
}
