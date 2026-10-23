---
effect: explore
schema: frontier
situation: asked to find where something happens in a codebase too large to read
cues: [where is, where does, find, locate, error, stack trace, which file, symptom, message]
evidence: untested
---
The error said `invoice total mismatch` and the tree had three hundred directories. He grepped the literal string: one hit, in a 60-line file. He read that file, then the two functions that called it, then stopped. The directory he had been about to open first, `billing/`, turned out to be a client for a service retired the year before; the mismatch lived in `ledger/reconcile.py`, four minutes from the string.
