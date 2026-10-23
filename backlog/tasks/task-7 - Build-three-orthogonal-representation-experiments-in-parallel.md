---
id: TASK-7
title: Build three orthogonal representation experiments in parallel
status: Done
assignee: []
created_date: '2026-10-23T16:15:00Z'
updated_date: '2026-10-23T16:20:00Z'
labels: []
dependencies: []
ordinal: 5000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Three writer agents, one per method, minimal signal sharing, each in experiments/<name>/: README (method, hypothesis, costs, orchestrator-to-subagent packet), entry file, five sample abstractions, packet example. Front matter light.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 three directories under experiments/, each self-contained
- [ ] #2 each has a packet example an orchestrator can push to a subagent
- [ ] #3 no experiment references another
<!-- AC:END -->
