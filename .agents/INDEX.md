---
name: agents-index
description: Index of the agent instruction set for jwz. Sole authority for the .agents tree.
---

# Agents Index

**Scope:** `.agents/`
**Parent:** [Root Index](../INDEX.md)

This index is the sole authority for the `.agents/` tree. Nothing outside
`.agents/` may manage, dictate, or write files inside it. Any file added to or
removed from `.agents/` is reflected here in the same commit; see
[`creators/index-creator.md`](creators/index-creator.md).

Route on the Purpose column. Open a body only once that instruction is selected.

## rules/

| File | Purpose |
|---|---|
| [`rules/directories.md`](rules/directories.md) | Decide where a new file goes, in either tree. |
| [`rules/repository.md`](rules/repository.md) | Work inside this package: layout, commands, conventions, prohibitions. |
| [`rules/versioning.md`](rules/versioning.md) | Handle anything that would change the version. |

## git/

| File | Purpose |
|---|---|
| [`git/branching-strategy.md`](git/branching-strategy.md) | Name a branch or decide whether to open a new one. |
| [`git/commit-conventions.md`](git/commit-conventions.md) | Write a commit message. |
| [`git/pull-request-template.md`](git/pull-request-template.md) | Open a pull request: title, body, and what must never appear in it. |

## creators/

| File | Purpose |
|---|---|
| [`creators/instruction-creator.md`](creators/instruction-creator.md) | Add or change a file under `.agents/`. |
| [`creators/information-creator.md`](creators/information-creator.md) | Add or change a page under `wiki/`. |
| [`creators/changelog-creator.md`](creators/changelog-creator.md) | Add or change a log under `wiki/logs/`. |
| [`creators/index-creator.md`](creators/index-creator.md) | Add, change, split, or audit any `INDEX.md`. |

## prompts/

| File | Purpose |
|---|---|
| [`prompts/branch-and-commit.md`](prompts/branch-and-commit.md) | The standing branch and commit checklist, always active. |

## api/

| File | Purpose |
|---|---|
| [`api/api-client-conventions.md`](api/api-client-conventions.md) | Write or change an API client module. |

## security/

| File | Purpose |
|---|---|
| [`security/secrets-and-tokens.md`](security/secrets-and-tokens.md) | Handle a token, key, or anything that could leak one. |

## dependencies/

| File | Purpose |
|---|---|
| [`dependencies/package-policy.md`](dependencies/package-policy.md) | Add, update, or review a dependency. |

## skills/

| File | Purpose |
|---|---|
| [`skills/add-api-module.md`](skills/add-api-module.md) | Add a function or provider to the published surface. |
