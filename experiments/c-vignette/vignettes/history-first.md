---
effect: explore
schema: chesterton's fence
situation: facing code that looks pointless, dead or wrong, before deciding what it is for
cues: [why, legacy, dead code, unused, pointless, odd, remove, clean up, intent, who added]
evidence: untested
---
The retry loop around the export call had no comment and a hard-coded sleep of 7 seconds, and the ticket said to clean up the module. Before touching it she ran the file's history: five commits, the third titled "export: retry, vendor drops connections at 6s during their nightly job". The author was still on the team and confirmed the nightly job still ran. The loop stayed; the ticket got a comment with the commit hash.
