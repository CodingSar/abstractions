---
effect: foresee
schema: premortem
situation: about to run a multi-step plan whose failure is costly to undo
cues: [migrate, migration, deploy, rollout, release, cutover, runbook, schedule, irreversible]
evidence: untested
---
The migration was scheduled for Monday 06:00 and the runbook had twelve steps. On Friday afternoon the lead opened the channel with: it is Monday 09:00 and the migration failed, what happened? Three answers came inside a minute: the backfill locked the orders table, the feature flag defaulted to on for everyone, nobody had ever run the rollback script. They ran the rollback script on staging at 16:00; it failed at step two, on a permission the production role had and staging did not.
