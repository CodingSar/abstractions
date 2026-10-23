# abstractions

A personal knowledge base of abstractions: compact units of knowledge handed to an agent to steer it indirectly. An abstraction makes latent knowledge salient and lets the agent chunk a task, instead of spelling the task out. Everything here is Markdown; there is no code to build or test.

## Layout

Three tiers of disclosure, so an agent pulls only what a task needs: `CATALOG.md` (one line per effect) → `effects/<effect>.md` (one line per leading word) → `words/<slug>.md` (the word itself). Design explorations live in `docs/design/`; the current one is `docs/design/mechanism.md`, which also holds the word template and the evaluation plan.

Another repo uses this one with a single line in its CLAUDE.md: scan `CATALOG.md` before a task and pull the words whose trigger fits.

## Workflow

- Design a new abstraction, category, or convention through `/grill-with-docs`. Resolved terms land in `GLOSSARY.md`; hard-to-reverse choices in `docs/adr/`.
- Every file here is read by agents, so write it with `writing-for-agents`: front-load the leading word, state the positive behaviour, keep one meaning in one place, and prune lines that only restate what the model does by default.
- Keep an abstraction free of task instructions. The test: it steers which knowledge the model reaches for, never which steps it takes.

## Domain docs

- Read `GLOSSARY.md` and `docs/adr/` before adding or renaming anything. If they don't exist yet, proceed silently.
- Use the glossary's term for every concept you name; a word listed under _Avoid_ stays out. A concept missing from the glossary is a gap to raise with `domain-modeling`, not a licence to coin a word.
- When a change contradicts an ADR, say so ("Contradicts ADR-0002 because…") and let the human reopen it.
- Layout is single-context: one root `GLOSSARY.md`; ADRs are `docs/adr/NNNN-slug.md`, numbered from the highest existing one.

## Decisions

This repo has one author. Ask them in the terminal, one round of numbered questions at a time, with a recommended answer each.

## Tools

- Tasks: Backlog.md (`backlog` CLI, tasks in `backlog/tasks/`). Install with `bun add -g backlog.md` when a container lacks it.
- Engineering and writing skills: the mattpocock-skills plugin, enabled in `.claude/settings.json`.
