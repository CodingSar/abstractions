---
term: blast radius
source: site reliability engineering; Google SRE book
effect: foresee
trigger: the task changes something shared: config, schema, a public interface, a widely imported module
evidence: untested
---
**Blast radius**: how far a failure reaches from the point of change. Salient: everything that reads or calls what is changing, the smallest change that still does the job, and how it would be undone.
