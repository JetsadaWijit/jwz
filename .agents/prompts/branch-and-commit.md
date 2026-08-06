---
name: branch-and-commit-prompt
description: Standing prompt that keeps the branch and commit convention active for every task, so the user never has to restate it.
---

# Standing Prompt: Branch And Commit

This applies to every task in this repository. Assume it is always active; the
user does not need to repeat it.

## Checklist

1. Create a branch off the default branch named `{type}/{primary-noun}`.
2. Do the work.
3. Commit each logical change with `type(scope): description`. Review the diff
   before every commit.
4. Push with `git push -u origin {branch}`.
5. Ask the user before opening a pull request. Never open one on your own.

## Types

`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`,
`chore`, `revert`

## Naming Rules

* `{type}/{primary-noun}` or `{type}/{primary-noun}-{secondary-noun}`.
* Lowercase kebab-case, a noun rather than a verb, no issue tracker identifiers.
* Examples: `feat/login`, `fix/schema-drift`, `docs/agents-setup`.

## Message Rules

* `type(optional scope): description`, subject in imperative mood.
* Plain text: no links, no pull request or issue references with `#`.
* No trailing period on the subject.
* Optional body of short bullets explaining what and why.
* A breaking change is marked with `!` and a `BREAKING CHANGE:` footer.

## Never

Never commit to the default branch, and never use a tool preset branch prefix such
as `claude/`, `codex/`, or `cursor/`.

The full rules live in
[`../git/branching-strategy.md`](../git/branching-strategy.md) and
[`../git/commit-conventions.md`](../git/commit-conventions.md).
