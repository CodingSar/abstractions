// The three experiments' selection rules, each implemented from its README,
// plus the two control arms. Input: the task line only. Output: a packet and
// the schema slugs it contains, so selection can be scored apart from steering.
import { readDoc, readDocs, slug, type Doc } from "./frontmatter";

export type Arm = "none" | "control" | "lexicon" | "graph" | "vignette";
export const ARMS: Arm[] = ["none", "control", "lexicon", "graph", "vignette"];
export type Selection = { arm: Arm; units: string[]; packet: string; note?: string };

const ROOT = new URL("../..", import.meta.url).pathname.replace(/\/$/, "");
const EXP = `${ROOT}/experiments`;

// Shared verb classifier (lexicon README, step 1). The graph README leaves the
// effect pick to the orchestrator, so the harness reuses this rule there too.
const EXPLORE_VERBS = /\b(read|map|find|locate|diagnose|trace|understand|explain|where|how does|report)\b/i;
const FORESEE_VERBS = /\b(add|change|remove|refactor|migrate|fix|implement|rename|replace|write|build|update|move)\b/i;
export function effectsOf(task: string): ("explore" | "foresee")[] {
  const out: ("explore" | "foresee")[] = [];
  if (EXPLORE_VERBS.test(task)) out.push("explore");
  if (FORESEE_VERBS.test(task)) out.push("foresee");
  return out.length ? out : ["explore", "foresee"];
}

const STOP = new Set("the a an of to and or in on at by for with is are has have not no yet it its that this as from into about something shared code task agent".split(" "));
const contentWords = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w)).map((w) => w.replace(/s$/, ""));

// ---- a-lexicon --------------------------------------------------------------
// Trigger match is made mechanical the way the README's own tie-break does it:
// a trigger holds when one of its content words appears in the task line.
export async function selectLexicon(task: string): Promise<Selection> {
  const terms = await readDocs(`${EXP}/a-lexicon/terms`);
  const effects = effectsOf(task);
  const taskWords = new Set(contentWords(task));
  const scored = terms
    .filter((t) => effects.includes(t.data.effect))
    .map((t) => ({ t, hits: contentWords(String(t.data.trigger)).filter((w) => taskWords.has(w)).length }))
    .filter((x) => x.hits > 0)
    .sort((a, b) => b.hits - a.hits);
  const chosen = scored.slice(0, 3).map((x) => x.t);
  const packet = chosen.length ? "Think with:\n" + chosen.map((t) => `- ${t.body}`).join("\n") : "";
  return { arm: "lexicon", units: chosen.map((t) => slug(t.data.term)), packet };
}

// ---- b-graph ----------------------------------------------------------------
type Edge = [string, string, string];
export async function selectGraph(task: string): Promise<Selection> {
  const entry = await Bun.file(`${EXP}/b-graph/EFFECTS.md`).text();
  const yaml = entry.match(/```yaml\n([\s\S]*?)```/)![1];
  const effects = Bun.YAML.parse(yaml) as { effect: string; seeds: string[]; hops: number; cap: number }[];
  const want = effectsOf(task);
  const picked = effects.filter((e) => (e.effect.startsWith("explore") && want.includes("explore")) || (e.effect.startsWith("see") && want.includes("foresee")));
  const nodes = new Map<string, Doc>();
  for (const d of await readDocs(`${EXP}/b-graph/nodes`)) nodes.set(d.path.split("/").pop()!.replace(/\.md$/, ""), d);
  const hops = Math.max(...picked.map((e) => e.hops), 1);
  const cap = Math.max(...picked.map((e) => e.cap), 1);
  const collected: string[] = [];
  const depth = new Map<string, number>();
  const queue: string[] = [];
  for (const e of picked) for (const s of e.seeds) if (!depth.has(s) && nodes.has(s)) (depth.set(s, 0), queue.push(s), collected.push(s));
  while (queue.length && collected.length < cap) {
    const cur = queue.shift()!;
    const d = depth.get(cur)!;
    if (d >= hops) continue;
    for (const [, target] of (nodes.get(cur)!.data.edges ?? []) as Edge[]) {
      if (target.includes(" ") || depth.has(target) || !nodes.has(target)) continue; // foil or seen
      if (collected.length >= cap) break;
      depth.set(target, d + 1);
      queue.push(target);
      collected.push(target);
    }
  }
  const lines: string[] = [];
  for (const s of collected) {
    for (const [type, target, clause] of (nodes.get(s)!.data.edges ?? []) as Edge[]) {
      const isFoil = target.includes(" ");
      if (isFoil || collected.includes(target)) lines.push(`${nodes.get(s)!.data.name} —${type}→ ${isFoil ? target : nodes.get(target)!.data.name}: ${clause}`);
    }
  }
  const packet = collected.length
    ? "Think with this shape. It names what to reach for, never steps.\n\n" + collected.map((s) => `${nodes.get(s)!.data.name} — ${nodes.get(s)!.body}`).join("\n") + "\n\n" + lines.join("\n")
    : "";
  return { arm: "graph", units: collected, packet };
}

// ---- c-vignette -------------------------------------------------------------
export async function selectVignette(task: string): Promise<Selection> {
  const scenes = await readDocs(`${EXP}/c-vignette/vignettes`);
  const line = task.toLowerCase();
  const scored = scenes
    .map((s) => ({ s, score: ((s.data.cues ?? []) as string[]).filter((c) => line.includes(c.toLowerCase())).length }))
    .filter((x) => x.score >= 1)
    .sort((a, b) => b.score - a.score || a.s.body.length - b.s.body.length);
  const taken: Doc[] = [];
  const perEffect: Record<string, number> = {};
  for (const { s } of scored) {
    if (taken.length >= 3) break;
    if ((perEffect[s.data.effect] ?? 0) >= 2) continue;
    taken.push(s);
    perEffect[s.data.effect] = (perEffect[s.data.effect] ?? 0) + 1;
  }
  const packet = taken.length ? "## Scenes from other work\n\n" + taken.map((s) => s.body).join("\n\n") : "";
  return { arm: "vignette", units: taken.map((s) => slug(String(s.data.schema))), packet };
}

// ---- controls ---------------------------------------------------------------
export async function selectControl(): Promise<Selection> {
  const packet = (await Bun.file(`${ROOT}/evals/control-packet.md`).text()).trim();
  return { arm: "control", units: [], packet };
}

export async function select(arm: Arm, task: string): Promise<Selection> {
  switch (arm) {
    case "none": return { arm, units: [], packet: "" };
    case "control": return selectControl();
    case "lexicon": return selectLexicon(task);
    case "graph": return selectGraph(task);
    case "vignette": return selectVignette(task);
  }
}

// Which schema slugs each experiment can offer at all, for coverage scoring.
export async function coverage(arm: Arm): Promise<string[]> {
  if (arm === "lexicon") return (await readDocs(`${EXP}/a-lexicon/terms`)).map((d) => slug(d.data.term));
  if (arm === "graph") return (await readDocs(`${EXP}/b-graph/nodes`)).map((d) => d.path.split("/").pop()!.replace(/\.md$/, ""));
  if (arm === "vignette") return (await readDocs(`${EXP}/c-vignette/vignettes`)).map((d) => slug(String(d.data.schema)));
  return [];
}

export const approxTokens = (s: string) => Math.round(s.length / 4);

if (import.meta.main) {
  const tasks = Bun.YAML.parse(await Bun.file(`${ROOT}/evals/tasks.yaml`).text()) as { id: string; target: string; line: string }[];
  for (const t of tasks) {
    console.log(`\n=== ${t.id} (target ${t.target}) effects=${effectsOf(t.line).join("+")}`);
    for (const arm of ["lexicon", "graph", "vignette"] as Arm[]) {
      const s = await select(arm, t.line);
      const cov = (await coverage(arm)).includes(t.target);
      const hit = s.units.includes(t.target);
      console.log(`  ${arm.padEnd(8)} ~${String(approxTokens(s.packet)).padStart(3)} tok  ${hit ? "HIT " : cov ? "MISS" : "n/a "}  [${s.units.join(", ")}]`);
    }
  }
}
