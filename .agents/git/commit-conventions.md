---
name: commit-conventions
description: Conventional Commits format for this repository, with the allowed types, scope rules, subject rules, and commit frequency.
---

# Commit Conventions

## Format

```
type(optional scope): description

[optional body]

[optional footer]
```

## Types

| Type | Meaning |
|---|---|
| `feat` | Introduces a new feature. Minor in semantic versioning. |
| `fix` | Patches a bug. Patch in semantic versioning. |
| `docs` | Documentation only. |
| `style` | Formatting that does not change behavior. |
| `refactor` | Restructuring that neither fixes a bug nor adds a feature. |
| `perf` | Improves performance. |
| `test` | Adds or corrects tests. |
| `build` | Build system or packaging. |
| `ci` | Continuous integration configuration. |
| `chore` | Maintenance that does not touch source behavior. |
| `revert` | Reverts a previous commit. |

A breaking API change is marked with `!` after the type or scope, and explained in
a `BREAKING CHANGE:` footer. A breaking change is major in semantic versioning,
but the version itself is never bumped without approval. See
[`../rules/versioning.md`](../rules/versioning.md).

## Scope

The scope is a module or subsystem, written lowercase in parentheses. Use the real
names in this repository: `github`, `gitlab`, `ai`, `mailer`, `agents`, `wiki`,
`deps`.

## Subject

* Imperative mood: "add", not "added" or "adds".
* Plain text. No links, no pull request references, no issue references with `#`.
* No trailing period.
* Keep it short enough to read at a glance.

## Body

Optional. Short bullets explaining what changed and why. Never a transcript of the
session.

## Frequency

Commit each logical change or each group of related changes as you go. Never batch
a whole session into one commit. Always review the diff before creating a commit.

## Worked Example

A change that adds a retry to the GitLab release lookup and documents it:

```
git add src/gitlab/release.js
git commit -m "fix(gitlab): retry release lookup on transient failure"

git add wiki/information/architecture.md
git commit -m "docs(wiki): describe retry behavior of the gitlab client"
```

Two logical changes, two commits, each reviewed before it was made.
