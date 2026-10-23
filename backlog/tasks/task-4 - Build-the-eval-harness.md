---
id: TASK-4
title: Build the eval harness
status: To Do
assignee: []
created_date: '2026-10-23T16:03:00Z'
labels: []
dependencies:
  - TASK-2
references:
  - docs/design/mechanism.md
ordinal: 4000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Task bank in evals/tasks/, paired-run script (with and without the word, n>=5, headless CLI), salience probe, behavioural-marker judge, outcome and token cost, evidence writer.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 evals/tasks/ holds 5-10 fixed tasks across domains
- [ ] #2 one script runs a paired comparison for a named word and prints deltas
- [ ] #3 salience probe runs before the agent acts
- [ ] #4 a run appends one evidence line to the word file
<!-- AC:END -->
