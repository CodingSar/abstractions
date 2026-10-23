# Evals

Paired runs that measure whether a packet from one of the three representation experiments moves an agent, compared with no packet and with a neutral packet of the same length. Nothing here is run automatically; the budget is spent on purpose.

## Run

```bash
bun run evals/harness/select.ts                      # free: what each experiment selects per task
bun run evals/harness/run.ts --dry-run               # free: every run's packet, no API calls
bun run evals/harness/run.ts --tasks e1 --arms none,lexicon --n 1   # one smoke pair
bun run evals/harness/run.ts                         # full: 6 tasks x 5 arms x n=5 = 150 runs
bun run evals/harness/report.ts                      # evals/results/report.md
bun run evals/harness/report.ts --write-evidence     # also fills each unit's evidence field
```

Needs the Claude Code CLI on PATH and signed in. Runs happen in a temp copy of the fixture outside this repo, with user and project settings disabled, so the task line and packet are the agent's only context. Defaults: 30 turns and $1.50 per run, four runs at a time; `--max-turns`, `--budget`, `--concurrency`, `--model` override them.

## Measures

Each run records, in `evals/results/runs.jsonl`:

- **Selection hit**: the experiment's packet contained the task's target schema. "Not covered" when the experiment has no unit for it at all. Scored apart from steering, so a weak selection rule is not mistaken for a weak representation.
- **Salience**: a separate no-tool call with the same brief asks the agent to name the three concepts guiding its approach; a hit is any of the task's `target_terms` appearing. The most direct test of the thesis.
- **Marker**: a judge call reads the tool-call transcript and final answer and answers the task's one yes/no behaviour question.
- **Outcome**: deterministic checks, a hidden test copied into the fixture or required strings in the final answer.
- **Cost**: dollars, turns, input and output tokens.

The report shows every measure per arm, per effect, and for the subset of runs where selection hit.

## Arms

| arm | packet |
|---|---|
| none | task only |
| control | task plus `control-packet.md`, about 170 tokens of neutral prose |
| lexicon, graph, vignette | task plus the packet that experiment's selection rule builds |

The packet follows the task line in every arm, which is where each experiment's README places it.

## Tasks and coverage

| task | effect | fixture | target | lexicon | graph | vignette |
|---|---|---|---|---|---|---|
| e1 | explore | layered-service | tracer-bullet | yes | yes | yes |
| e2 | explore | maze | fog-of-war | yes | yes | no |
| e3 | explore | maze | frontier | no | yes | yes |
| f1 | foresee | sessions | premortem | yes | yes | yes |
| f2 | foresee | shared-interface | seam | yes | yes | no |
| f3 | foresee | obvious-bug | red-before-green | no | no | yes |

Coverage gaps are a finding about each experiment's five samples, not a harness defect; a "not covered" task still runs and shows what the experiment's rule picks instead.

## Harness decisions

Where an experiment's README left a step to judgement, the harness made it mechanical and says so here:

- **Lexicon trigger match** uses the README's own tie-break as the rule: a trigger holds when one of its content words (plural-stemmed) appears in the task line.
- **Graph effect pick** reuses the lexicon's verb classifier, since the graph README leaves the pick to the orchestrator.
- **Vignette** matching is implemented exactly as written (cue substrings, cap three, two per effect).
- **Salience probe** is a separate call rather than a prefix to the real run, so the run's prompt is identical across arms except for the packet.
- **Hidden checks** fail on the untouched fixture; verified before the first run.
