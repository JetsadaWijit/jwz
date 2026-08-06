---
name: root-index
description: Root router for the jwz repository. Lists every index and the condition that makes each one the right branch to load.
---

# Root Index

| Index | Scope | Load when |
|---|---|---|
| [`.agents/INDEX.md`](.agents/INDEX.md) | Agent instruction set | You need a rule, convention, skill, or creator before doing work. |
| [`wiki/INDEX.md`](wiki/INDEX.md) | Project documentation | You need to read or write documentation about the package. |
| [`wiki/logs/INDEX.md`](wiki/logs/INDEX.md) | Versioned change logs | You need release history or must record a change. |

This file lists indexes only. It never carries rules, documentation, or links to
leaf content. Adding, removing, or renaming any `INDEX.md` in this repository
updates this table in the same commit. Read exactly one branch per task; do not
preload the others.
