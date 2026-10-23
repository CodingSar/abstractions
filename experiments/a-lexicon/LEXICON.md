# Lexicon

Every term, grouped by effect. The orchestrator reads this file, applies the selection rule in `README.md`, and packs the bodies of the chosen entries from `terms/`.

## explore: the agent faces a codebase or problem it has no map of

| term | trigger |
|---|---|
| [fog of war](terms/fog-of-war.md) | the task names a codebase or problem the agent has no map of |
| [tracer bullet](terms/tracer-bullet.md) | the task spans layers the agent has not yet seen work together |

## foresee: the agent is about to build or change something

| term | trigger |
|---|---|
| [premortem](terms/premortem.md) | the task builds or changes something and no failure story has been told yet |
| [seam](terms/seam.md) | the task changes code that other code depends on |
| [blast radius](terms/blast-radius.md) | the task changes something shared: config, schema, a public interface, a widely imported module |
