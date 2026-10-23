# Packet example

Task: add idempotency keys to the payment webhook handler so a retried delivery is processed once.

## Traversal

Effect: see the failure before it happens (`seeds: [premortem, seam]`, `hops: 1`, `cap: 6`).

| depth | node | reached by |
|---|---|---|
| 0 | premortem | seed |
| 0 | seam | seed |
| 1 | tracer-bullet | `seam —precedes→ tracer-bullet` |

Stops: depth 1 equals `hops`, so `tracer-bullet`'s own edges are read for rendering but not followed. Edges kept: both endpoints collected, or target is a foil. Dropped: `tracer-bullet —precedes→ frontier` (frontier not collected). Three nodes, seven edges.

## Text the subagent receives

```
Think with this shape. It names what to reach for, never steps.

premortem — The change has shipped and failed, and the cause reads as obvious in hindsight. That cause is already visible from here, and it points at one place.
seam — The line where the change meets what already exists, where behaviour can be altered without editing either side. Joins hold or give at the seam.
tracer bullet — One thin shot end to end, cheap, visible where it lands. It lights a line through the dark and shows whether that line is the one worth widening.

premortem —sharpens→ seam: the hindsight cause points at the seam that gave
premortem —contrasts-with→ postmortem: the same question, asked while it is still cheap
premortem —fails-into→ risk register: every risk listed, none named as the one
seam —precedes→ tracer bullet: through the seam first, wide after
seam —contrasts-with→ the diff: where the change meets what exists, rarely where the most lines change
tracer bullet —contrasts-with→ big bang: thin and end to end first; wide after it lands
tracer bullet —sharpens→ seam: a seam is where the bullet goes through
```

Packet size: 185 words, roughly 250 tokens.
