---
name: memory-index
description: Index of .agents/memory/ — what jwz currently knows about its own state and the tasks already carried out.
---

# Memory Index

**Scope:** `.agents/memory/`
**Parent:** [Root Index](root-index.md)

This index is read at the start of every session. Load only the rows whose scope
matches the current request, so prior work is continued rather than restarted.
Memory is written freely and needs no approval — `{shared}/rules/memory-policy.md`
sets what may go in it, and it is never shared with another repository.

Any file added to or removed from `.agents/memory/` is reflected here in the same
commit.

## state/

| File | Purpose |
|---|---|
| [`../memory/state/repository-state.md`](../memory/state/repository-state.md) | The repository's current known state: what exists, what does not, and the next obvious step. |

## tasks/

| File | Purpose |
|---|---|
| [`../memory/tasks/shared-set-adoption.md`](../memory/tasks/shared-set-adoption.md) | Record of adopting the shared instruction set and removing the duplicated copies. |
