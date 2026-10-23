# Abstractions steer indirectly; they never contain task instructions

An abstraction in this repo is a compact unit that makes latent, pretrained knowledge salient so an agent reaches the right ideas on its own, rather than a prompt or instruction that spells out the steps. We chose this over a prompt library because it costs far fewer tokens per use, transfers across tasks and repos, and leaves the agent's own judgement in charge. The price is precision: an abstraction cannot force a specific action, so anything that must happen in a fixed order belongs in a skill or a task, not here.
