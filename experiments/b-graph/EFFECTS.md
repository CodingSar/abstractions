# Effects

Entry point. Each effect is a node whose only edges are `seeds`. The orchestrator picks the effect that matches the subagent's task, then runs the traversal in `README.md` with the budgets below.

```yaml
- effect: explore without flailing
  when: the subagent faces a codebase or problem it has not seen
  seeds: [fog-of-war, frontier]
  hops: 1
  cap: 6
- effect: see the failure before it happens
  when: the subagent is about to build or change something
  seeds: [premortem, seam]
  hops: 1
  cap: 6
```

Raise `hops` to 2 for a task that spans both exploring and building; the hinge node `tracer-bullet` joins the two constellations.
