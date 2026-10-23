---
effect: explore
schema: tracer bullet
situation: handed a large unfamiliar system and asked how one thing moves through it
cues: [unfamiliar, how does, flow, end to end, pipeline, architecture, walk through, moves through]
evidence: untested
---
The repo was 40,000 lines and the brief was to explain how an upload became a thumbnail. An hour into reading `services/` top-down she had notes on nine modules and no path. She added one log line where the HTTP handler received the file and one where the row was written, sent a single upload, and read the two timestamps and the stack between them. The path touched four files. Two of the nine modules she had summarised were never called.
