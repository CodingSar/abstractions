# Forms of representation: three experiments

Orchestrator's record of the ideation behind the experiments under `experiments/`. The writers of the three experiments did not see this file or each other's work.

## The axis

Every candidate form in `mechanism.md` answers one question differently: **where does the information live** that the agent recovers when it reads the abstraction? Three answers are mutually exclusive, which makes them the orthogonal set to test:

| Experiment | Information lives in | Compression comes from | Cognitive analogue |
|------------|---------------------|------------------------|--------------------|
| `a-lexicon` | the model: a name that points into pretraining | pointer: the file carries only the name, its source, and the trigger | semantic memory: a label recalls the concept |
| `b-graph` | the structure: typed relations between concepts | relation: an edge carries what neither endpoint carries alone, and the subgraph chunks as one shape | schema: a concept is fixed by its neighbours |
| `c-vignette` | the instance: a concrete scene that evokes the schema unnamed | recognition: one episode recruits the pattern plus its weight | episodic memory: a remembered near miss |

Forms left out, and why: persona, analogy, mnemonic and exemplar each reduce to one of the three (a persona is a name, a mnemonic is a structure, an exemplar is an instance); probe, skeleton and dial sharpen a unit rather than represent one; ontology and digest carry facts the model lacks, which is information, not steering.

## Shared constraints every experiment met

- Light YAML front matter, at most five fields, so an orchestrator selects and packs mechanically.
- Body ready to paste into a subagent brief.
- Two effects covered with at least two samples each: *explore without flailing* and *see the failure before it happens*.
- Every sample marked `untested`.
- A packet example with a token count, so the three can be compared on cost before any eval runs.

## What each must prove

The eval plan in `mechanism.md` applies to all three unchanged. The question each experiment answers:

- **Lexicon**: does a handful of well-aimed names move the salience probe as much as a paragraph of instruction, at a fraction of the tokens? Failure looks like a name the model half-remembers steering the wrong way.
- **Graph**: do relations add steering that the same names, listed flat, do not? The control for this experiment is the lexicon packet made from the same nodes. Failure looks like the subagent reading the relation list as a checklist.
- **Vignette**: does an unnamed scene recruit the schema at all, and does it transfer to a task that differs from the scene in surface detail? Failure looks like the subagent imitating the scene's specifics instead of its move.

## How the pick will be made

Same task bank, same three measures (salience probe, behavioural marker, outcome and cost), same neutral-text control arm. Compare per effect, not only overall: a form may win on one effect and lose on another, and a mixed result is a finding, not a tie. The pick is recorded as ADR 0002 and the losing experiments stay in `experiments/` with their results, because a negative result is evidence.

## What came back

All three writers met the constraints. Read side by side, before any eval:

| | a-lexicon | b-graph | c-vignette |
|---|---|---|---|
| Entry file | `LEXICON.md`: term and trigger per row | `EFFECTS.md`: seeds, hops, cap per effect | `SCENES.md`: situation per row |
| Unit body | one bold term, one gloss, one `Salient:` line | two-line gist plus outgoing typed edges | three to six sentences of past-tense scene, schema name kept out |
| Front-matter fields | 5: term, source, effect, trigger, evidence | 3: name, edges, evidence | 5: effect, schema, situation, cues, evidence |
| Selection | task verb → effect, then trigger match, cap 3 | breadth-first from seed nodes, bounded by hops and cap | cue substring count, sorted, cap 3 and 2 per effect |
| Example packet | ~170 tokens, 3 terms | ~250 tokens, 3 nodes and 7 edges | ~220 tokens, 2 scenes |
| Where it can go wrong | wrong sense of a word; a no-op word | foils name the shape to avoid; hinge bloat | surface match; copying the move literally |

Points the evals must settle, visible already:

- **Selection is the weak link in all three.** Verb classification, cue substrings, and seed choice are each a heuristic over the task line. A wrong selection costs more than a weak unit. The harness should score selection separately from steering: did the packet contain the right unit, and did the right unit then move the agent?
- **The graph's hypothesis is the most falsifiable.** Its control is its own node list rendered flat as a lexicon packet; if the edges add nothing, the relation lines are pure cost.
- **The vignette's hypothesis is the most distinct.** It is the only form where the salience probe can fail while the behavioural marker passes: the agent may act on the schema without being able to name it. Both measures are needed to read it.
- **Token cost is close enough to ignore for now** (170 to 250 per packet). The decision will turn on steering, not size.
