# Packet example

Task: "Change the `UserRepository.find` signature to take an options object; it is imported across the monorepo and you have not worked in this repo before."

## Selection

1. Effect: the verb is _change_, so `foresee`; "you have not worked in this repo" also matches `explore`'s heading, so both.
2. Trigger, over both groups:
   - fog of war: holds ("have not worked in this repo").
   - tracer bullet: holds only if the task spans layers; a signature change does not. Dropped.
   - premortem: holds (a change, no failure story told).
   - seam: holds ("imported across the monorepo" is code other code depends on).
   - blast radius: holds (a public interface, widely imported).
   Four hold; cap is three. Keep the ones whose trigger names a noun in the task sentence: _seam_ (code, depends) and _blast radius_ (interface, imported) do; _fog of war_ (codebase) does; _premortem_ names none. Dropped.

Packed: fog of war, seam, blast radius.

## Text the subagent receives

```
Think with:
- **Fog of war**: the map is dark except where you have been, and the surprises live in the dark. Salient: revealed versus unrevealed ground, cheap scouting before commitment, the frontier between the two, and the part of the map the objective actually runs through.
- **Seam**: a place where behaviour can be altered without editing in that place. Salient: where the change can be isolated, where a test can hook in, and which dependencies the edit drags along.
- **Blast radius**: how far a failure reaches from the point of change. Salient: everything that reads or calls what is changing, the smallest change that still does the job, and how it would be undone.
```

Token count: about 170 tokens (678 characters at roughly 4 per token). The task line itself is about 35.
