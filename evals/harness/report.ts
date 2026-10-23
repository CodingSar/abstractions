// Aggregate evals/results/runs.jsonl into evals/results/report.md.
//   bun run evals/harness/report.ts [--in evals/results/runs.jsonl] [--write-evidence]
import { readDocs } from "./frontmatter";

const ROOT = new URL("../..", import.meta.url).pathname.replace(/\/$/, "");
const flag = (name: string, dflt?: string) => { const i = process.argv.indexOf(`--${name}`); return i > -1 ? (process.argv[i + 1] ?? "true") : dflt; };
const IN = flag("in", `${ROOT}/evals/results/runs.jsonl`)!;
const rows = (await Bun.file(IN).text()).split("\n").filter(Boolean).map((l) => JSON.parse(l));
if (!rows.length) { console.log("no runs"); process.exit(0); }

const pct = (xs: any[], f: (r: any) => boolean | null) => { const v = xs.map(f).filter((x) => x !== null && x !== undefined); return v.length ? `${Math.round((100 * v.filter(Boolean).length) / v.length)}%` : "–"; };
const mean = (xs: any[], f: (r: any) => number) => { const v = xs.map(f).filter((x) => typeof x === "number" && !Number.isNaN(x)); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : NaN; };
const arms = ["none", "control", "lexicon", "graph", "vignette"].filter((a) => rows.some((r) => r.arm === a));
const effects = [...new Set(rows.map((r) => r.effect))];

let md = `# Eval report\n\nRuns: ${rows.length}. Generated ${new Date().toISOString().slice(0, 10)}.\n\n`;
const table = (xs: any[]) => {
  let t = "| arm | n | selection hit | salience | marker | outcome | mean $ | mean turns | mean in-tokens |\n|---|---:|---:|---:|---:|---:|---:|---:|---:|\n";
  for (const a of arms) {
    const r = xs.filter((x) => x.arm === a);
    if (!r.length) continue;
    t += `| ${a} | ${r.length} | ${a === "none" || a === "control" ? "–" : pct(r, (x) => x.selectionHit)} | ${pct(r, (x) => x.salienceHit)} | ${pct(r, (x) => x.marker)} | ${pct(r, (x) => x.outcome)} | ${mean(r, (x) => x.costUsd).toFixed(3)} | ${mean(r, (x) => x.turns).toFixed(1)} | ${Math.round(mean(r, (x) => x.inputTokens))} |\n`;
  }
  return t;
};
md += "## Overall\n\n" + table(rows) + "\n";
for (const e of effects) md += `## Effect: ${e}\n\n` + table(rows.filter((r) => r.effect === e)) + "\n";
md += "## Steering given a selection hit\n\nOnly runs where the experiment's packet contained the task's target schema.\n\n" + table(rows.filter((r) => r.arm === "none" || r.arm === "control" || r.selectionHit)) + "\n";
md += "## Selection per task\n\n| task | target | lexicon | graph | vignette |\n|---|---|---|---|---|\n";
for (const t of [...new Set(rows.map((r) => r.task))]) {
  const cell = (a: string) => { const r = rows.find((x) => x.task === t && x.arm === a); return !r ? "–" : r.selectionHit ? "hit" : r.covered ? "miss" : "not covered"; };
  md += `| ${t} | ${rows.find((r) => r.task === t).target} | ${cell("lexicon")} | ${cell("graph")} | ${cell("vignette")} |\n`;
}
await Bun.write(`${ROOT}/evals/results/report.md`, md);
console.log(md);

if (process.argv.includes("--write-evidence")) {
  const date = new Date().toISOString().slice(0, 10);
  const dirs: Record<string, { dir: string; key: (d: any) => string }> = {
    lexicon: { dir: `${ROOT}/experiments/a-lexicon/terms`, key: (d) => d.data.term },
    graph: { dir: `${ROOT}/experiments/b-graph/nodes`, key: (d) => d.path.split("/").pop()!.replace(/\.md$/, "") },
    vignette: { dir: `${ROOT}/experiments/c-vignette/vignettes`, key: (d) => d.data.schema },
  };
  const { slug } = await import("./frontmatter");
  for (const [arm, { dir, key }] of Object.entries(dirs)) {
    for (const d of await readDocs(dir)) {
      const unit = slug(String(key(d)));
      const used = rows.filter((r) => r.arm === arm && r.units.includes(unit));
      if (!used.length) continue;
      const base = rows.filter((r) => r.arm === "none" && used.some((u) => u.task === r.task));
      const line = `${date} n=${used.length} salience ${pct(used, (x) => x.salienceHit)} (none ${pct(base, (x) => x.salienceHit)}), marker ${pct(used, (x) => x.marker)} (none ${pct(base, (x) => x.marker)}), outcome ${pct(used, (x) => x.outcome)} (none ${pct(base, (x) => x.outcome)})`;
      const text = await Bun.file(d.path).text();
      await Bun.write(d.path, text.replace(/^evidence:.*$/m, `evidence: "${line}"`));
      console.log(`evidence → ${d.path}`);
    }
  }
}
