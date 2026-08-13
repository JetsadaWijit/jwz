---
name: agents-index
description: Index of the instruction files local to jwz. Shared conventions are not listed here; they resolve through the connector.
---

# Agents Index

**Scope:** `.agents/` instruction folders
**Parent:** [Root Index](root-index.md)

This index owns the instruction files that belong to `jwz` alone. Branching,
commits, pull requests, planning, and the creators are **not** here — they are
served by the `lxagents-agents-base` connector, and the route to them is the
`{shared}/index/root-index.md` row in [`root-index.md`](root-index.md).

Any file added to or removed from these folders is reflected here in the same
commit. Route on the Purpose column; open a body only once that instruction is
selected.

## rules/

| File | Purpose |
|---|---|
| [`../rules/repository.md`](../rules/repository.md) | Work inside this package: layout, publish surface, commands, conventions, prohibitions. |

## api/

| File | Purpose |
|---|---|
| [`../api/api-client-conventions.md`](../api/api-client-conventions.md) | Write or change an API client module. |

## security/

| File | Purpose |
|---|---|
| [`../security/secrets-and-tokens.md`](../security/secrets-and-tokens.md) | Handle a token, key, or anything that could leak one. |

## dependencies/

| File | Purpose |
|---|---|
| [`../dependencies/package-policy.md`](../dependencies/package-policy.md) | Add, update, or review a dependency. |

## skills/

| File | Purpose |
|---|---|
| [`../skills/add-api-module.md`](../skills/add-api-module.md) | Add a function or provider to the published surface. |
