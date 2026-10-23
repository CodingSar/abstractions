# Vignette

A vignette hands an agent one remembered episode instead of a rule: a concrete situation, the move someone made in it, and the moment that showed the move was right. The agent recognises its own situation in the scene and the whole schema arrives with it, name unspoken.

## Hypothesis

Pretraining already holds every schema this catalogue could name, but a name recruits it thinly: "premortem" lands as a definition the model can recite and then drop. An instance recruits it the way a memory does, with the near miss and the wasted hour attached, so it stays salient under the pull of the task. Recognition is the compression: sixty tokens of scene carry the pattern, the condition that triggers it, and its weight, and the agent chunks its own task as "that situation" while its judgement keeps the steps (ADR-0001).

## Costs

At rest a scene is 60–100 tokens of body plus about 40 of front matter; the five here and `SCENES.md` total under 1,000. Loaded, a packet is one to three bodies under a heading, 80–300 tokens of the subagent's brief. The orchestrator reads `SCENES.md` (about 200 tokens) to select and opens only the files it packs.

## Failure modes

- Mis-recognition: the scene matches on surface (a migration) while the subagent's situation has another shape, and the agent imports the wrong schema with full confidence. Cues therefore name the shape of the situation, never the technology.
- Literalism: the agent copies the move (adds two log lines) instead of the schema. Scenes end on the payoff, so the why outweighs the what.
- Drift into instruction: a scene gains "she always did this first" and becomes an order. The form bans imperatives, morals and second person.
- Saturation: three scenes of one effect read as a lesson plan. Packing caps at two per effect.
- Cue rot: matching is only as good as the cue lists. Zero hits yields an empty packet; a default scene is worse than silence.

## Front matter

Five fields, nothing else.

| field | value | why |
|---|---|---|
| `effect` | `explore` or `foresee` | The catalogue's axis (GLOSSARY: Effect). Groups `SCENES.md` and caps packing at two per effect. |
| `schema` | conventional name, e.g. `premortem` | For the orchestrator and the human only. It stays out of the body so the scene works on a reader who has never heard it. |
| `situation` | one line, a situation not a task | The row `SCENES.md` shows; the human-readable match target. |
| `cues` | list of 5–9 lowercase phrases | What a script greps the task line for. Each names the shape of the situation (`unfamiliar`, `migrate`, `reproduce`); `situation` is the sentence they are drawn from. |
| `evidence` | `untested` until a run records what changed | GLOSSARY: Evidence. Without it the file is a candidate, not an abstraction. |

## The form

A scene is three to six sentences of past-tense prose with one actor, specific enough to be a memory: a file name, a count, a clock time.

It contains, in order:

1. Situation: one sentence that places the actor in the bind.
2. Move: what the actor did instead of the obvious thing, told as events, with the reason left for the reader to see.
3. Moment: the sentence that shows the move was right (the near miss, the hour kept, the counterfactual made visible). The scene ends on it.

It leaves out: the schema's name and its synonyms; imperatives, second person and morals ("always", "the lesson"); a closing summary; a title.

## Selection

Scriptable rule, run once per subagent brief:

1. Lowercase the subagent's task line.
2. Score each scene: the number of its `cues` that occur as substrings in the task line.
3. Keep scenes scoring at least 1; sort by score descending, then body length ascending.
4. Walk the sorted list, taking a scene when fewer than three are taken and fewer than two of its `effect` are taken.
5. Zero taken: the brief gets no packet.

## Packet

Appended after the task and its constraints, bodies only, in selection order:

```
## Scenes from other work

<body of scene 1>

<body of scene 2>
```

The heading is the whole framing; the packet carries no sentence about what to do with the scenes, so they read as context. `PACKET-EXAMPLE.md` shows one in full.
