---
name: memory-tasks-shared-set-sync
description: Record of syncing the agent instruction entry point with shared instruction set 0.10.0 — the audit rerun, the trigger row deleted, and the mandatory files made always-on.
---

# Task: Sync With Shared Instruction Set 0.10.0

## Goal

Bring this repository's `AGENTS.md` in step with the current shared set
(`LXAgents-MCP/shared-instruction` `0.10.0`) by applying every "Consumers must"
action from `agents://index/logs-index.md` that was still outstanding.

## Plan

| # | Title | Scope | Files |
|---|---|---|---|
| 1 | Sync the entry point with shared set 0.10.0 | delete the stale discovery-protocol trigger row, make the four mandatory standard files always-on beside the table, record this sync | `AGENTS.md`, `.agents/memory/tasks/shared-set-sync.md`, `.agents/index/memory-index.md` |

One work task: the two table edits are one logical change mandated by one release,
and everything rides in a single commit.

## Audit rerun

Ran `agents_check_duplicate_instructions` against the current manifest (26 files)
before editing. No local instruction shadows a shared `name`, content hash, or path;
every candidate is **local-only** (`rules/repository.md`,
`api/api-client-conventions.md`, `security/secrets-and-tokens.md`,
`dependencies/package-policy.md`, `skills/add-api-module.md`). Nothing to delete.

## Releases accounted for

* `0/3/0`, `0/4/0` — already absorbed; the `change-propagation` and `work-summary`
  rows were present.
* `0/5/0`–`0/7/0` — required nothing here.
* `0/8/0` — applied by this sync: deleted the discovery-protocol trigger row and
  added session-start step 5 plus the always-on paragraph naming the four mandatory
  standard files with the §H permission gates.
* `0/9/0`, `0/10/0` — behavioural only ("No trigger row changes"): re-read
  `{shared}/planning/task-workflow.md`. No further file changes in this repository.

### Task 1 — direct push to master

What landed: the two `AGENTS.md` edits above, this record, and its memory-index row,
in one commit pushed straight to the default branch.

Set aside at the user's explicit instruction ("only create push no pr"):
`{shared}/planning/task-workflow.md` §C stacked branches and §F pull requests and
merging gates. The commit-conventions granularity rule was kept as far as one commit
per logical group allows.

## Decisions

* No overrides declared; the override table stays empty.
* No version bump — an instruction change does not move the project version.
