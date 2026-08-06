---
name: agents-index
description: Sole authority and registry for the .agents tree in jwz. Lists every instruction file and the folder it belongs to.
---

# .agents Index

This file is the sole authority for the `.agents/` tree. It indexes every
instruction file in the repository. Nothing outside `.agents/` may manage,
dictate, or write files inside this tree.

Any file added to or removed from `.agents/` must be reflected in this index in
the same commit. Any new folder must also be registered in
[`rules/directories.md`](rules/directories.md) in that same commit.

Route by reading the `name` and `description` frontmatter of the files below.
Open a body only once that instruction has been selected.

## rules/

| File | Purpose |
|---|---|
| [`rules/directories.md`](rules/directories.md) | Placement authority for `.agents/` and `wiki/`, including how to create a new folder when none fits. |
| [`rules/versioning.md`](rules/versioning.md) | Forbids self service version bumps and defines how to propose one. |
| [`rules/repository.md`](rules/repository.md) | Rules specific to this repository: layout, commands, conventions, and what must not be introduced. |

## git/

| File | Purpose |
|---|---|
| [`git/branching-strategy.md`](git/branching-strategy.md) | Branch naming, branch isolation, and pull request etiquette. |
| [`git/commit-conventions.md`](git/commit-conventions.md) | Conventional Commits format, types, scopes, and commit frequency. |

## prompts/

| File | Purpose |
|---|---|
| [`prompts/branch-and-commit.md`](prompts/branch-and-commit.md) | Standing prompt that keeps the branch and commit convention active for every task. |

## creators/

| File | Purpose |
|---|---|
| [`creators/instruction-creator.md`](creators/instruction-creator.md) | Creates and maintains instruction files under `.agents/`. |
| [`creators/information-creator.md`](creators/information-creator.md) | Creates and maintains documentation pages under `wiki/`. |
| [`creators/changelog-creator.md`](creators/changelog-creator.md) | Creates and maintains versioned logs under `wiki/logs/`. |

## api/

| File | Purpose |
|---|---|
| [`api/api-client-conventions.md`](api/api-client-conventions.md) | How an API client module is shaped: properties files, placeholder URLs, return contract, retries. |

## security/

| File | Purpose |
|---|---|
| [`security/secrets-and-tokens.md`](security/secrets-and-tokens.md) | Credential handling for a package whose callers supply their own tokens. |

## dependencies/

| File | Purpose |
|---|---|
| [`dependencies/package-policy.md`](dependencies/package-policy.md) | Runtime dependency policy, lockfile rules, and Dependabot handling. |

## skills/

| File | Purpose |
|---|---|
| [`skills/add-api-module.md`](skills/add-api-module.md) | Step by step procedure for adding a new module or function to the published surface. |
