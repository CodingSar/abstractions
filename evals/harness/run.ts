// Paired runs: every task x arm x repetition in a fresh copy of the fixture.
// Records one JSONL line per run in evals/results/runs.jsonl.
//
//   bun run evals/harness/run.ts [--tasks e1,f2] [--arms none,control,lexicon,graph,vignette]
//                                [--n 5] [--concurrency 4] [--max-turns 30] [--budget 1.5]
//                                [--model <id>] [--dry-run] [--out evals/results/runs.jsonl]
import { mkdtemp, cp, rm, mkdir, appendFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ARMS, select, coverage, approxTokens, type Arm } from "./select";
import { agentRun, structured } from "./claude";

const ROOT = new URL("../..", import.meta.url).pathname.replace(/\/$/, "");
type Check = { type: "test"; file: string } | { type: "answer_contains"; all?: string[]; none?: string[] } | { type: "file_exists"; path: string };
type Task = { id: string; effect: string; fixture: string; target: string; target_terms: string[]; line: string; marker: string; checks: Check[] };

const flag = (name: string, dflt?: string) => { const i = process.argv.indexOf(`--${name}`); return i > -1 ? (process.argv[i + 1] ?? "true") : dflt; };
const DRY = process.argv.includes("--dry-run");
const N = Number(flag("n", "5"));
const CONC = Number(flag("concurrency", "4"));
const MAX_TURNS = Number(flag("max-turns", "30"));
const BUDGET = Number(flag("budget", "1.5"));
const MODEL = flag("model");
const OUT = flag("out", `${ROOT}/evals/results/runs.jsonl`)!;
const armsWanted = (flag("arms", ARMS.join(","))!.split(",") as Arm[]).filter((a) => ARMS.includes(a));
const tasksWanted = flag("tasks")?.split(",");

const tasks = (Bun.YAML.parse(await Bun.file(`${ROOT}/evals/tasks.yaml`).text()) as Task[]).filter((t) => !tasksWanted || tasksWanted.includes(t.id));

const PROBE = "Before doing anything else, and without using any tools, name the three concepts guiding how you will approach this task, as short phrases.";
const probeSchema = { type: "object", properties: { concepts: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 3 } }, required: ["concepts"] };
const judgeSchema = { type: "object", properties: { verdict: { type: "string", enum: ["yes", "no"] }, reason: { type: "string" } }, required: ["verdict", "reason"] };

function brief(task: Task, packet: string): string {
  const head = `## Task\n\n${task.line}\n\nYou are working in the current directory, which holds the whole project. When finished, end with a short final answer.`;
  return packet ? `${head}\n\n${packet}` : head;
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
function salienceHit(concepts: string[], terms: string[]): boolean {
  const joined = norm(concepts.join(" | "));
  return terms.some((t) => joined.includes(norm(t)));
}

async function runChecks(task: Task, cwd: string, finalText: string): Promise<{ pass: boolean; detail: string[] }> {
  const detail: string[] = [];
  let pass = true;
  for (const c of task.checks) {
    if (c.type === "test") {
      await mkdir(join(cwd, "test"), { recursive: true });
      const name = c.file.split("/").pop()!;
      await cp(`${ROOT}/evals/${c.file}`, join(cwd, "test", name));
      const p = Bun.spawn(["bun", "test"], { cwd, stdout: "pipe", stderr: "pipe" });
      const out = (await new Response(p.stdout).text()) + (await new Response(p.stderr).text());
      const ok = (await p.exited) === 0;
      pass &&= ok;
      detail.push(`test ${name}: ${ok ? "pass" : "FAIL"} ${(out.match(/\d+ fail/) ?? [""])[0]}`);
    } else if (c.type === "answer_contains") {
      const t = finalText.toLowerCase();
      const missing = (c.all ?? []).filter((s) => !t.includes(s.toLowerCase()));
      const forbidden = (c.none ?? []).filter((s) => t.includes(s.toLowerCase()));
      const ok = missing.length === 0 && forbidden.length === 0;
      pass &&= ok;
      detail.push(`answer: ${ok ? "pass" : `FAIL missing=[${missing}] forbidden=[${forbidden}]`}`);
    } else if (c.type === "file_exists") {
      const ok = await Bun.file(join(cwd, c.path)).exists();
      pass &&= ok;
      detail.push(`file ${c.path}: ${ok ? "pass" : "FAIL"}`);
    }
  }
  return { pass, detail };
}

async function one(task: Task, arm: Arm, rep: number) {
  const sel = await select(arm, task.line);
  const cov = await coverage(arm);
  const prompt = brief(task, sel.packet);
  const record: any = {
    ts: new Date().toISOString(), task: task.id, effect: task.effect, arm, rep,
    target: task.target, units: sel.units, covered: arm === "lexicon" || arm === "graph" || arm === "vignette" ? cov.includes(task.target) : null,
    selectionHit: sel.units.includes(task.target), packetTokens: approxTokens(sel.packet),
  };
  if (DRY) { console.log(`[dry] ${task.id} ${arm} #${rep} packet~${record.packetTokens} units=[${sel.units}]`); return; }
  const work = await mkdtemp(join(tmpdir(), `abstractions-eval-${task.id}-${arm}-${rep}-`));
  try {
    await cp(`${ROOT}/evals/fixtures/${task.fixture}`, work, { recursive: true });
    const probe = await structured<{ concepts: string[] }>(`${prompt}\n\n${PROBE}`, probeSchema, { cwd: work, model: MODEL });
    record.concepts = probe?.concepts ?? null;
    record.salienceHit = probe ? salienceHit(probe.concepts, task.target_terms) : null;
    const run = await agentRun(prompt, { cwd: work, maxTurns: MAX_TURNS, budgetUsd: BUDGET, model: MODEL });
    Object.assign(record, { costUsd: run.costUsd, inputTokens: run.inputTokens, outputTokens: run.outputTokens, turns: run.turns, durationMs: run.durationMs, exitCode: run.exitCode, toolCalls: run.toolCalls.length, finalText: run.text.slice(0, 4000) });
    const checks = await runChecks(task, work, run.text);
    record.outcome = checks.pass; record.checkDetail = checks.detail;
    const transcript = run.toolCalls.map((c, i) => `${i + 1}. ${c.name}: ${c.summary}`).join("\n").slice(0, 8000);
    const judge = await structured<{ verdict: string; reason: string }>(
      `You are judging a transcript of an AI agent working on a task. Answer the one question with yes or no and a one-sentence reason, from the evidence in the transcript only.\n\nTask given to the agent:\n${task.line}\n\nQuestion: ${task.marker}\n\nTool calls, in order:\n${transcript || "(none)"}\n\nAgent's final answer:\n${run.text.slice(0, 3000)}`,
      judgeSchema, { model: MODEL });
    record.marker = judge ? judge.verdict === "yes" : null; record.markerReason = judge?.reason ?? null;
  } finally {
    await rm(work, { recursive: true, force: true });
  }
  await appendFile(OUT, JSON.stringify(record) + "\n");
  console.log(`${task.id} ${arm.padEnd(8)} #${rep}  sel=${record.selectionHit ? "hit" : "-"} sal=${record.salienceHit ? "hit" : "-"} mark=${record.marker ? "yes" : "no"} out=${record.outcome ? "pass" : "FAIL"} $${record.costUsd?.toFixed(3)} ${record.turns}t`);
}

const jobs: (() => Promise<void>)[] = [];
for (const t of tasks) for (const arm of armsWanted) for (let i = 1; i <= N; i++) jobs.push(() => one(t, arm, i));
console.log(`${jobs.length} runs (${tasks.length} tasks x ${armsWanted.length} arms x n=${N})${DRY ? " [dry run]" : ""}`);
if (!DRY) await mkdir(`${ROOT}/evals/results`, { recursive: true });
let next = 0;
await Promise.all(Array.from({ length: Math.min(CONC, jobs.length) }, async () => { while (next < jobs.length) await jobs[next++](); }));
