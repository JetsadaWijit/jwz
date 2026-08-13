---
name: root-index
description: Router for the jwz repository. Lists every index this repository can reach, plus the shared-override table.
---

# Root Index

## Indexes

| Index | Scope | Load when |
|---|---|---|
| [`agents-index.md`](agents-index.md) | This repository's instruction set | You need a rule specific to `jwz`. |
| `{shared}/index/root-index.md` | The shared instruction set | You need a branching, commit, pull request, planning, or creator convention. |
| [`agent-wiki-index.md`](agent-wiki-index.md) | `.agents/wiki/` agent knowledge | You need orientation, an SOP, or operating context written for agents. |
| [`project-wiki-index.md`](project-wiki-index.md) | `wiki/` human documentation | You need to read or write documentation a person will read. |
| [`memory-index.md`](memory-index.md) | `.agents/memory/` dynamic state | You need prior task state or must record progress. |
| [`logs-index.md`](logs-index.md) | `wiki/logs/` versioned change logs | You need release history or must record a change. |

## Shared Overrides

| `name` | Local file | Replaces | Why |
|---|---|---|---|

No overrides — this repository uses the shared set unchanged.

This file lists indexes only. It never carries rules, documentation, or links to
leaf content. Adding, removing, or renaming any index updates the table above in the
same commit, and adding or dropping an override updates the override table in the
same commit. Read exactly one branch per task, plus
[`memory-index.md`](memory-index.md).
