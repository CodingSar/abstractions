# abstractions

A personal knowledge base of abstractions that steer an agent indirectly, so it reaches the right internalised knowledge without a written-out task instruction.

## Language

**Abstraction**:
A compact unit of knowledge, passed to an agent, that makes latent knowledge salient and steers behaviour indirectly. It names what to think with, never the steps to take.
_Avoid_: Prompt, instruction, template

**Effect**:
The change in behaviour you want from the model, such as exploring without flailing. The catalog is organised by effect, and the leading words on one effect page are meant to be pulled together.
_Avoid_: Category, topic, domain

**Chunk**:
A grouping of several things under one abstraction so an agent holds more in working context at once, as in the psychological effect of chunking.
_Avoid_: Batch, summary

**Salience**:
The state of internalised knowledge being active and reachable while the agent works on a task. Making knowledge salient is what an abstraction is for.
_Avoid_: Awareness, attention

**Evidence**:
The line on an abstraction recording where it was tried and what changed. "Untested" is a valid value; one without evidence is a candidate, not an abstraction.
_Avoid_: Proof, validation
