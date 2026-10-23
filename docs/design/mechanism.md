# Mechanism: how an abstraction carries information to a model

Design exploration behind the choice of unit for this knowledge base. Method: generate candidate mechanisms from several unrelated seed disciplines, score each on the same criteria, aggregate, then plan the winner. The decision itself is recorded as an ADR once confirmed.

## Candidates

Seeds: prompting practice, cognitive science, linguistics, software documentation, information theory. Each candidate names one way to hand a model more information per token.

| # | Candidate | One-line description | Example |
|---|-----------|----------------------|---------|
| A | **Leading word** | A single term the model already knows, used as a token to think with. | _tracer bullet_, _fog of war_, _legwork_ |
| B | **Frame** | A named schema from a known source, importing its parts and relations, not just one concept. | _OODA loop_, _Ousterhout's deep modules_, _premortem_ |
| C | **Constellation** | Three to seven terms that co-occur in pretraining and together fence one region of behaviour. | _frontier, fog of war, tracer bullet, legwork_ (an exploring posture) |
| D | **Analogy** | "Treat X as Y": a mapping between the task and a domain the model knows well. | "treat the test suite as a smoke alarm" |
| E | **Persona** | A role that bundles priorities and taste. | "a staff engineer running a post-mortem" |
| F | **Probe** | One question that forces a stance before acting. | "what would make this fail silently?" |
| G | **Mnemonic** | An acronym or rhyme that compresses a checklist. | _FIRST_ for tests, _SOLID_ |
| H | **Skeleton** | An output scaffold whose headings order the reasoning. | "Observation / Hypothesis / Test / Result" |
| I | **Exemplar** | A one-line example of the pattern in action, standing in for a rule. | one good commit message instead of a style guide |
| J | **Dial** | An intensity word that sets how hard an existing behaviour runs. | _relentless_, _tight_, _terse_ |
| K | **Ontology** | A small graph of project terms and their relations. | a glossary with _Avoid_ lists |
| L | **Digest** | A pre-computed summary of a corpus at several zoom levels. | a codebase map |

## Scoring

Criteria, each 1 (worst) to 5 (best):

- **Rest cost**: how little the catalog pointer costs on every turn it sits in context.
- **Load cost**: how little the unit costs once pulled in.
- **Recruitment**: how much pretrained structure one unit activates per token. This is the thesis.
- **Chunking**: how many separate things the unit lets the agent hold as one.
- **Precision**: how reliably it steers to the intended behaviour and not a neighbour.
- **Portability**: works across tasks, repos, and models.
- **Testability**: a before/after can be measured.
- **Authoring**: how cheap it is to write one well.

| Candidate | Rest | Load | Recruit | Chunk | Precision | Portable | Testable | Authoring | Total |
|-----------|-----:|-----:|--------:|------:|----------:|---------:|---------:|----------:|------:|
| A Leading word | 5 | 5 | 4 | 3 | 3 | 5 | 4 | 4 | **33** |
| B Frame | 5 | 4 | 5 | 5 | 4 | 4 | 4 | 3 | **34** |
| C Constellation | 4 | 4 | 5 | 4 | 2 | 4 | 3 | 2 | 28 |
| D Analogy | 4 | 4 | 4 | 4 | 3 | 3 | 3 | 3 | 28 |
| E Persona | 4 | 4 | 3 | 3 | 2 | 3 | 2 | 4 | 25 |
| F Probe | 5 | 5 | 2 | 1 | 4 | 5 | 4 | 4 | 30 |
| G Mnemonic | 5 | 4 | 3 | 5 | 3 | 3 | 3 | 2 | 28 |
| H Skeleton | 3 | 3 | 1 | 3 | 5 | 3 | 5 | 4 | 27 |
| I Exemplar | 4 | 4 | 2 | 2 | 4 | 2 | 4 | 3 | 25 |
| J Dial | 5 | 5 | 2 | 1 | 2 | 4 | 3 | 5 | 27 |
| K Ontology | 2 | 2 | 2 | 3 | 5 | 1 | 4 | 2 | 21 |
| L Digest | 1 | 1 | 1 | 4 | 4 | 1 | 4 | 1 | 17 |

Reading the table rather than the totals:

- **A and B are one mechanism at two grains.** A leading word is a frame whose name is a single term; _tracer bullet_ recruits a whole chapter of _The Pragmatic Programmer_, not one idea. Both win on the thesis (recruitment) at near-zero cost. Their shared weakness is model dependence: a frame the model half-remembers steers wrong, which is why every unit carries evidence.
- **C is the composition rule, not a unit.** A constellation is several leading words pointed at one effect, which is what a category in the catalog already is once the catalog is organised by effect. Its low precision score is the cost of fencing a region instead of naming a point; it buys breadth.
- **F, H, J are complements, not competitors.** A probe fixes a stance, a skeleton fixes an order, a dial fixes an intensity. None recruits much knowledge on its own; each sharpens a leading word when paired with it ("_premortem_, then: what would make this fail silently?"). They belong inside a unit as optional fields, not as separate units.
- **K and L are information, not steering.** A glossary or a codebase digest hands the model facts it lacks. Useful, already covered by `GLOSSARY.md` and by tools like Groma, and outside this repo's thesis.
- **E, D, G, I** score mid-table for the same reason: each works, each is broad or lossy, and each is easy to re-express as a frame (a persona is a frame over priorities; a mnemonic is a frame over a checklist). Fold them into B when they fit, skip them when they don't.

## Pick

**One unit: the leading word, defined as a term or short phrase that names a schema the model already holds.** A single term and a named frame are the same unit; the file records which source the model knows it from. Everything else in the table is either a composition of units (constellation, catalog category) or an optional sharpener inside a unit (probe, skeleton, dial).

Rules that fall out of the pick:

1. Every unit names something the model knows from pretraining. A coined word recruits nothing and pays its definition in tokens.
2. The unit is phrased positively: it names what to reach for, never what to avoid.
3. A unit carries evidence or is marked untested. A word that sounds right is not yet an abstraction.

## Overarching design

Three tiers of disclosure, so an agent pulls only what the task needs:

```
abstractions/
├── CLAUDE.md
├── GLOSSARY.md
├── CATALOG.md                  tier 1: one line per effect, with its trigger, pointing at the effect page
├── effects/
│   └── <effect>.md             tier 2: one line per unit in that effect, with its trigger, pointing at the unit
├── words/
│   └── <slug>.md               tier 3: the leading word itself
├── docs/adr/                   decisions
├── docs/design/                explorations like this one
├── evals/                      task bank and results, once the harness exists
└── backlog/                    Backlog.md tasks
```

- **Tier 1, `CATALOG.md`**, is the only file another repo points at. One line in that repo's `CLAUDE.md` ("Before a task, scan `CATALOG.md` in abstractions and pull the units whose trigger fits") is the entire integration. The catalog stays short enough to read every time.
- **Tier 2, an effect page**, is read only when its trigger fires. Effects are what you want the model to do: _explore without flailing_, _see the failure before it happens_, _hold a large task as one shape_, _stop over-building_. An effect page is also where a constellation lives: the units on one page are meant to be pulled together.
- **Tier 3, a word file**, is the template below. Short enough that the file is itself an example of its own thesis.

Unit template:

```md
# <leading word>

source: <where the model knows it from, e.g. The Pragmatic Programmer, ch. 2>
effect: <effect slug>

**Gloss**: one sentence, what the word means in its source.
**Makes salient**: what the model reaches for once the word is in context.
**Reach for it when**: the trigger, as a condition the agent can recognise.
**Sharpener** (optional): a probe, skeleton, or dial that pairs with it.
**Example**: one line showing the word in use in a task.
**Evidence**: untested | <date>, <model>, <task>, n=<runs>, <what changed>
```

## Evaluation plan

The effect is "touchy feely" by nature, so the plan measures it indirectly from three angles and reports deltas, not absolutes.

**Design**: paired runs. The same task, same model, same settings, with and without the unit in context, repeated n times (five is the floor; variance between runs of the same prompt is large). Headless runs through the CLI (`claude -p`) make this a script, not a ritual.

**Three measures per pair**:

1. **Salience probe**. Before the agent acts, the harness asks it to name the three concepts guiding its approach. Score: does the target schema, or a near synonym, appear? This is the most direct test of the thesis and the cheapest: it needs no judge.
2. **Behavioural marker**. Each unit declares one observable in its file ("built an end-to-end slice before widening", "listed failure modes before coding"). A judge model reads the transcript against that one marker and answers yes or no.
3. **Outcome and cost**. Task score from a rubric (deterministic where possible: tests pass, file exists; a judge otherwise), plus input and output tokens and turn count. The thesis predicts equal or better outcomes at lower cost.

**Task bank**: five to ten small, fixed tasks in `evals/tasks/`, reused across units so results compare. Mix domains, since effects should transfer.

**Reporting**: each run appends one line to the unit's evidence field. A unit whose salience probe fails to move across two task types is demoted to the effect page's "retired" list rather than deleted, so the negative result is kept.

**What this cannot show**: that the word did the steering rather than the extra tokens. A control arm with a neutral word of equal length ("consider this carefully") answers that, and is worth adding once the harness runs.

## Implementation plan

Ordered so each step is usable on its own:

1. Write `CATALOG.md` with the first two effects and the `effects/` pages for them.
2. Write the first five words from the `writing-for-agents` vocabulary, which already has field use: _tracer bullet_, _fog of war_, _frontier_, _legwork_, _premortem_. All marked untested.
3. Point `jippitese/CLAUDE.md` at `CATALOG.md` and use it on one real task there. That is the first integration test.
4. Build the eval harness: task bank, paired-run script, salience probe, evidence writer.
5. Run every unit through the harness; retire what fails; record the control-arm result.
6. Record the mechanism choice as ADR 0002 once confirmed.
