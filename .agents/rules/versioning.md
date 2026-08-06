---
name: versioning-rules
description: Never change the project version on your own initiative. How to propose a bump and wait for explicit user approval.
---

# Versioning Rules

## Never Bump On Your Own Initiative

Never change the project version by yourself. Always ask the user first and wait
for an explicit answer. A version number is a public claim about this package, and
`jwz` is published to npm, so a bump is visible to every consumer.

## What This Covers

Every version carrier that exists in this repository, and every one that may exist
later:

* `package.json` `version` and the `version` field in `package-lock.json`.
* Any future `VERSION` file, `__version__` constant, chart or manifest version.
* Git tags and GitHub release drafts.
* Creating a new `wiki/logs/{Major}/{Minor}/{Patch}/` directory, because that
  directory is itself a version claim.

Running `npm version`, `npm publish`, or any command that rewrites the version is
covered by this rule.

## How To Propose A Bump

When a change looks like it warrants a bump, do not apply it. Present a proposal
that states:

1. the current version, read from `package.json`;
2. the proposed version;
3. whether it is major, minor, or patch, and why, using the same semantics as
   [`../git/commit-conventions.md`](../git/commit-conventions.md): `fix` is patch,
   `feat` is minor, a breaking API change is major;
4. every file that would change;
5. the `wiki/logs/` directory that would be created.

Then stop and wait for the user's answer.

## Released Versions Are Immutable

Never re-tag a released version. Never rewrite the log directory of a version that
has already been released. Corrections go into the next version's log.
