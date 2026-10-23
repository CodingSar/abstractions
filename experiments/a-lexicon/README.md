# Lexicon

A lexicon is a flat list of pretrained terms, each used as a token to think with. The information lives in the model, not in the file: every entry names a schema the model already holds (_tracer bullet_, _premortem_, _seam_), says where the model knows it from, glosses it in one line, states what it makes salient, and gives the trigger under which an orchestrator pulls it. The orchestrator reads `LEXICON.md`, picks terms whose trigger holds for the subagent's task, and pastes their bodies into the brief. Nothing in an entry says what to do; it says what to think with.

## Hypothesis

A pretrained term is the densest unit of knowledge per token available: one word recruits a whole region of behaviour the model already learned, and recruits it the same way every run. Naming the term chunks the task (the agent holds "fire a tracer bullet" as one thing instead of six steps) and keeps the knowledge salient as the context fills. A handful of well-aimed terms should therefore keep a subagent in "smart" context longer than a paragraph of steps covering the same ground, at a tenth of the tokens.

## Costs

- At rest: one entry is 90 to 115 tokens including front matter; `LEXICON.md` is about 230 tokens and is read by the orchestrator only.
- Loaded: a packed term is 45 to 60 tokens in the subagent's brief. A three-term packet is about 170 tokens. The orchestrator pays the index once per dispatch; the subagent never sees it.

## Failure modes

- Coined or obscure term: recruits no priors, so the gloss has to carry everything and the entry collapses into a definition. Every term must be checkable against `source`.
- Wrong sense: _seam_ reaches sewing, _frontier_ reaches history. The `source` field and the gloss pin the sense; a term whose dominant sense is wrong for the task is cut.
- No-op term: a word too weak to beat the model's default (_be careful_). The fix is a stronger term, not more words.
- Gloss drift: a "Salient" line that grows into steps. The test from the ADR holds: the line names what to look at, never what to do next.
- Dilution: more than three terms per brief and each one anchors less. Selection caps at three.

## Front matter

Five fields, every one used by the selection rule or the human reading the catalog.

```yaml
term: tracer bullet          # the token itself; the file is named after it
source: Hunt & Thomas, The Pragmatic Programmer   # where the model knows it from; proves the schema exists in pretraining
effect: explore              # explore | foresee; the first filter an orchestrator applies
trigger: the task spans layers the agent has not yet seen work together   # one condition on the task sentence; the second filter
evidence: untested           # glossary term; a file without it is a candidate, not an abstraction
```

Body: one bold term, one gloss sentence, one `Salient:` line. The body is pasted verbatim into the subagent brief, so it carries no headings and no task-specific wording.

## Selection

Mechanical, two passes over `LEXICON.md`:

1. Effect: a task whose verb reads, maps, finds, locates, or diagnoses gets `explore`; one that adds, changes, removes, refactors, or migrates gets `foresee`; a task doing both gets both.
2. Trigger: within the chosen effect(s), keep every term whose `trigger` holds for the task sentence as written. Keep at most three; if more hold, keep the ones whose trigger names a noun present in the task sentence.

## Packet

The packet is the bodies of the selected entries under one heading, bullet per term, in the order they appear in `LEXICON.md`:

```
Think with:
- <body of term 1>
- <body of term 2>
```

Nothing else is added. See `PACKET-EXAMPLE.md`.
