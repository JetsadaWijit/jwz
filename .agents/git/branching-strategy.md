---
name: branching-strategy
description: Branch off the default branch for every task, name branches {type}/{primary-noun}, and never commit to the default branch.
---

# Branching Strategy

## Rules

* Branch off the default branch for every task. Never commit directly to it. If
  you are on the default branch and about to modify a file, check out a new branch
  first.
* One task per branch, one pull request per branch.
* Check whether the prompt you were given belongs on the current branch. If the
  task is unrelated to the branch you are on, create a new branch for it. If the
  work continues the current scope, for example adding a function or fixing an
  error in work already on this branch, stay on it.
* Keep branches short lived and rebased on the default branch.
* Always ask the user for permission before opening a pull request. Open pull
  requests sequentially, in the order their changes depend on each other.

## Naming

```
{type}/{primary-noun}
{type}/{primary-noun}-{secondary-noun}
```

Lowercase kebab-case. A noun, not a verb. No issue tracker identifiers, no
personal names, no dates.

Allowed types:

`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`,
`chore`, `revert`

Examples:

```
feat/login
fix/schema-drift
docs/agents-setup
refactor/github-client
```

## No Tool Preset Prefixes

Branch names must never carry a tool preset prefix such as `claude/`, `codex/`,
or `cursor/`. Those are not types in the list above.

If a branch already violates the convention, recreate it correctly, move the work
to the new branch, and delete the wrong one. If the wrong branch has already been
pushed or reviewed, present the options to the user instead of deleting anything.
