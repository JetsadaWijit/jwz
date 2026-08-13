---
name: memory-tasks-shared-set-adoption
description: Record of adopting the shared instruction set in jwz — the duplicate audit findings, what was deleted, and what was kept.
---

# Task: Adopt The Shared Instruction Set

## Goal

Remove everything `.agents/` duplicated from the shared set, keep only what belongs
to this repository, and rewire the entry points to resolve the shared set through
the `lxagents-agents-base` connector.

## Mode

Mode B — consumer. Confirmed by reading `agents://manifest.json` over the connector.

## Duplicate audit

Ran the audit in `{shared}/rules/duplicate-instruction-audit.md` against the shared
manifest. Ten local files shadowed a shared `name`. Every one was a **stale copy**:
the `name` matched, the normalized body hash did not, and no override row existed.
The identical files also existed byte-for-byte in `jwz-website`, which is the drift
this architecture exists to stop.

Deleted:

| File | Shadowed |
|---|---|
| `.agents/git/branching-strategy.md` | `agents://git/branching-strategy.md` |
| `.agents/git/commit-conventions.md` | `agents://git/commit-conventions.md` |
| `.agents/git/pull-request-template.md` | `agents://git/pull-request-template.md` |
| `.agents/rules/directories.md` | `agents://rules/directories.md` |
| `.agents/rules/versioning.md` | `agents://rules/versioning.md` |
| `.agents/prompts/branch-and-commit.md` | `agents://prompts/branch-and-commit.md` |
| `.agents/creators/changelog-creator.md` | `agents://creators/changelog-creator.md` |
| `.agents/creators/index-creator.md` | `agents://creators/index-creator.md` |
| `.agents/creators/information-creator.md` | `agents://creators/information-creator.md` |
| `.agents/creators/instruction-creator.md` | `agents://creators/instruction-creator.md` |

Kept as local-only, matching nothing shared: `rules/repository.md`,
`api/api-client-conventions.md`, `security/secrets-and-tokens.md`,
`dependencies/package-policy.md`, `skills/add-api-module.md`.

## Content rescued before deletion

Two deleted copies held facts true of this package rather than of the organization.
Those were moved into `rules/repository.md`, where they are local by definition:

* The commit scopes this repository actually uses (`github`, `gitlab`, `ai`,
  `mailer`, `agents`, `wiki`, `deps`).
* The version carriers specific to an npm package — the `version` field in
  `package.json` and `package-lock.json`, and the `npm version` / `npm publish`
  commands that rewrite them.

Nothing else in the deleted files was worth promoting upstream; the shared versions
were the same rules, more current.

## Structural change

Every `INDEX.md` was removed and replaced by the centralized index set under
`.agents/index/`, per the setup procedure — `INDEX.md` is not a permitted filename.
Added `.agents/wiki/context/repository-map.md` and this memory seed, both of which
the adoption checklist requires and neither of which existed.

## Decisions

* No overrides declared. The override table in `.agents/index/root-index.md` is
  deliberately empty.
* No version bump. This is an instruction change; `3.0.0` and the existing
  `wiki/logs/3/0/0/` are untouched.
* The matching change in `jwz-website` was done on a branch of the same name.
* `LXAgents/mcp-server` was not modified.
