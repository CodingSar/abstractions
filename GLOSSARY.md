# abstractions

A personal knowledge base of abstractions that steer an agent indirectly, so it reaches the right internalised knowledge without a written-out task instruction.

## Language

**Abstraction**:
A compact unit of knowledge, passed to an agent, that makes latent knowledge salient and steers behaviour indirectly. It names what to think with, never the steps to take.
_Avoid_: Prompt, instruction, template

**Leading word**:
A term or short phrase naming a schema the model already holds from pretraining, such as _tracer bullet_ or _OODA loop_. The one kind of abstraction this repo stores; each lives in `words/`.
_Avoid_: Keyword, trigger word, buzzword, unit

**Effect**:
The change in behaviour you want from the model, such as exploring without flailing. The catalog is organised by effect, and the leading words on one effect page are meant to be pulled together.
_Avoid_: Category, topic, domain

**Catalog**:
The one file (`CATALOG.md`) another repo points at: one line per effect with its trigger. The first tier of disclosure.
_Avoid_: Index, registry

**Sharpener**:
An optional probe, skeleton, or dial paired with a leading word to fix its stance, order, or intensity. Never a leading word on its own.
_Avoid_: Modifier, prompt

**Chunk**:
A grouping of several things under one abstraction so an agent holds more in working context at once, as in the psychological effect of chunking.
_Avoid_: Batch, summary

**Salience**:
The state of internalised knowledge being active and reachable while the agent works on a task. Making knowledge salient is what an abstraction is for.
_Avoid_: Awareness, attention

**Evidence**:
The line on a leading word recording where it was tried and what changed. "Untested" is a valid value; a word without evidence is a candidate, not an abstraction.
_Avoid_: Proof, validation
