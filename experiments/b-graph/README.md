# b-graph: abstractions as a relation graph

Method: each abstraction is a node holding one leading word and a two-line gist; the payload is the typed edges between nodes. A word's meaning for the agent is fixed by its neighbours (tracer bullet beside fog of war is a probe; beside premortem it is a proof), so the orchestrator never ships a word alone. It starts at an effect, walks a bounded number of hops, and renders the subgraph as a relation list the subagent chunks as one shape.

## Hypothesis

A relation carries information neither endpoint carries: `frontier —contrasts-with→ exhaustive scan` steers in eight tokens what a paragraph on "how to explore" would take a hundred to say, because both words already live in pretraining and the edge only has to pick which reading of each to activate. A subgraph of five such lines is one chunk, not five, so the agent holds the whole stance in working context while the task runs. Cost per token falls as the graph grows: a new node adds meaning to every node it links, without a word of either being rewritten.

## Costs

- At rest: ~90 tokens per node (front matter plus gist), ~140 for `EFFECTS.md`. Five nodes and the entry file: ~600 tokens.
- Loaded: a one-hop packet is three or four nodes, ~250 tokens in the subagent's brief. Two hops: ~400. The hop budget, not the catalog size, bounds the packet.
- Orchestrator read cost equals packet cost: traversal opens only the files it collects.

## Failure modes

- Hinge bloat: a node with many out-edges reads as everything at once. Cap out-degree at three.
- Silent drop: edges to nodes outside the hop budget are omitted, so a word the author meant to pair can arrive unpaired. Seeds are chosen so that one hop reaches the pair.
- Foil pull: `contrasts-with` and `fails-into` name the shape to avoid, and a named shape is more available, not less. Every such edge leads with the positive node and the clause states the positive move.
- Reverse lookup: edges live in the source node, so "what points at X" scans the folder. Acceptable at tens of nodes; generate an index past that.
- Edge ambiguity: a type alone under-determines a relation; the clause fixes it, at four to ten tokens each.

## Node file

One file per node at `nodes/<slug>.md`. Front matter, three fields (cap is five; two are held in reserve):

```yaml
---
name: tracer bullet      # the leading word as the subagent reads it; the slug is the file stem
edges:                   # outgoing only: [type, target, "clause"]; target is a slug or a foil
  - [precedes, frontier, "where it lands, the edge moves"]
evidence: untested       # where it was tried and what changed
---
Gist: two lines at most, ready to paste.
```

- `name` is what the packet prints; spaces, so it recruits the pretrained token.
- `edges` sits in the node, not an edge file, because a relation's meaning belongs beside the word it qualifies, adding or removing a node is a one-file edit, and traversal reads only what it collects. A target with a space is a foil: a named opposite that gets no file and is never expanded.
- `evidence` is the field that makes this an abstraction rather than a candidate.

The body is the gist and nothing else. It describes what the word sees, never what to do.

## Edge types

Directed, closed set. Source → target.

- `seeds`: effect → node; the only edge an effect node emits, the traversal's start.
- `sharpens`: reading the target next to the source narrows the target to one meaning.
- `contrasts-with`: source and target are the two ends of one choice; naming both makes the agent choose.
- `precedes`: source is the mode before target; a cycle of `precedes` is a loop.
- `fails-into`: source, overdone, becomes target; the target names the failure's shape.

## Traversal

Input: an effect from `EFFECTS.md` (seeds, `hops`, `cap`). Breadth-first: seeds sit at depth 0; for each collected node in order, follow its edges in file order and collect each unvisited slug target at depth+1, while depth < `hops` and collected < `cap`. Foils are never collected or expanded. Output: the collected nodes and every edge whose source and target are both collected, or whose target is a foil.

Two effects on one task: run both, union the sets, apply the larger `cap`.

## Packet

```
Think with this shape. It names what to reach for, never steps.

<name> — <gist>
...

<name> —<type>→ <name or foil>: <clause>
...
```

Nodes in collection order, edges in the order they were collected. Paste into the subagent's brief under its task line.
