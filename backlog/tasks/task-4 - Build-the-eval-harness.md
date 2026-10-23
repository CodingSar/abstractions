---
id: TASK-4
title: Build the eval harness across the three experiments
status: Done
assignee: []
created_date: '2026-10-23T16:03:00Z'
updated_date: '2026-10-23T17:00:00Z'
labels: []
dependencies:
  - TASK-2
references:
  - docs/design/mechanism.md
ordinal: 4000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Paired runs (with/without, n>=5, headless CLI), salience probe, behavioural-marker judge, outcome and token cost, neutral-text control arm from the first run. Runs each of the three representation experiments against the same task bank.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 evals/tasks/ holds 5-10 fixed tasks across domains
- [ ] #2 one script runs a paired comparison for a named word and prints deltas
- [ ] #3 salience probe runs before the agent acts
- [ ] #4 a run appends one evidence line to the word file
<!-- AC:END -->
