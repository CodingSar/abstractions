---
term: seam
source: Michael Feathers, Working Effectively with Legacy Code
effect: foresee
trigger: the task changes code that other code depends on
evidence: untested
---
**Seam**: a place where behaviour can be altered without editing in that place. Salient: where the change can be isolated, where a test can hook in, and which dependencies the edit drags along.
