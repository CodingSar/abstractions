# Packet example

Task line: "Migrate the sessions table from Postgres to Redis and remove the old session middleware."

## Selection

| scene | cue hits | score | body words | taken |
|---|---|---|---|---|
| `history-first.md` | `remove` | 1 | 76 | yes (shorter body wins the tie) |
| `premortem.md` | `migrate` | 1 | 84 | yes |
| `frontier.md` | | 0 | | |
| `red-first.md` | | 0 | | |
| `tracer-bullet.md` | | 0 | | |

Two taken, one per effect: the subagent is about to change something (foresee) and must first decide what the middleware it will remove is for (explore).

## Text the subagent receives

Appended after the task and its constraints, verbatim:

```
## Scenes from other work

The retry loop around the export call had no comment and a hard-coded sleep of 7 seconds, and the ticket said to clean up the module. Before touching it she ran the file's history: five commits, the third titled "export: retry, vendor drops connections at 6s during their nightly job". The author was still on the team and confirmed the nightly job still ran. The loop stayed; the ticket got a comment with the commit hash.

The migration was scheduled for Monday 06:00 and the runbook had twelve steps. On Friday afternoon the lead opened the channel with: it is Monday 09:00 and the migration failed, what happened? Three answers came inside a minute: the backfill locked the orders table, the feature flag defaulted to on for everyone, nobody had ever run the rollback script. They ran the rollback script on staging at 16:00; it failed at step two, on a permission the production role had and staging did not.
```

## Size

165 words, roughly 220 tokens, including the heading.
