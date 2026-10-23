// Thin wrapper around `claude -p`. Every call is headless, session-less, and
// ignores user and project settings so the fixture directory is the only context.
export type RunResult = {
  text: string;
  toolCalls: { name: string; summary: string }[];
  costUsd: number;
  inputTokens: number;
  outputTokens: number;
  turns: number;
  durationMs: number;
  exitCode: number;
  stderr: string;
};

const BASE = ["--print", "--no-session-persistence", "--setting-sources", "", "--strict-mcp-config"];

export async function structured<T>(prompt: string, schema: object, opts: { cwd?: string; model?: string } = {}): Promise<T | null> {
  const args = ["claude", ...BASE, "--output-format", "json", "--tools", "", "--max-turns", "1", "--json-schema", JSON.stringify(schema)];
  if (opts.model) args.push("--model", opts.model);
  const proc = Bun.spawn([...args, prompt], { cwd: opts.cwd, stdout: "pipe", stderr: "pipe", env: { ...process.env, CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: "1" } });
  const out = await new Response(proc.stdout).text();
  await proc.exited;
  try {
    const j = JSON.parse(out);
    return (j.structured_output ?? (typeof j.result === "string" ? JSON.parse(j.result) : j.result)) as T;
  } catch {
    return null;
  }
}

export async function agentRun(prompt: string, opts: { cwd: string; maxTurns: number; budgetUsd: number; model?: string }): Promise<RunResult> {
  const args = ["claude", ...BASE, "--output-format", "stream-json", "--verbose", "--dangerously-skip-permissions", "--max-turns", String(opts.maxTurns), "--max-budget-usd", String(opts.budgetUsd)];
  if (opts.model) args.push("--model", opts.model);
  const started = Date.now();
  const proc = Bun.spawn([...args, prompt], { cwd: opts.cwd, stdout: "pipe", stderr: "pipe", env: { ...process.env, CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: "1" } });
  const out = await new Response(proc.stdout).text();
  const stderr = await new Response(proc.stderr).text();
  const exitCode = await proc.exited;
  const r: RunResult = { text: "", toolCalls: [], costUsd: 0, inputTokens: 0, outputTokens: 0, turns: 0, durationMs: Date.now() - started, exitCode, stderr: stderr.slice(-2000) };
  for (const line of out.split("\n")) {
    if (!line.trim()) continue;
    let ev: any;
    try { ev = JSON.parse(line); } catch { continue; }
    if (ev.type === "assistant" && ev.message?.content) {
      for (const c of ev.message.content) {
        if (c.type === "tool_use") r.toolCalls.push({ name: c.name, summary: summarize(c.name, c.input) });
      }
    }
    if (ev.type === "result") {
      r.text = typeof ev.result === "string" ? ev.result : JSON.stringify(ev.result ?? "");
      r.costUsd = ev.total_cost_usd ?? 0;
      r.turns = ev.num_turns ?? 0;
      const u = ev.usage ?? {};
      r.inputTokens = (u.input_tokens ?? 0) + (u.cache_read_input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0);
      r.outputTokens = u.output_tokens ?? 0;
    }
  }
  return r;
}

function summarize(name: string, input: any): string {
  if (!input) return "";
  const s = input.command ?? input.file_path ?? input.path ?? input.pattern ?? input.query ?? JSON.stringify(input);
  return String(s).slice(0, 160);
}
