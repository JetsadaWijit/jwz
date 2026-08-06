---
name: changelog-creator
description: Creates and maintains versioned logs under wiki/logs/. Creating a version directory requires explicit user approval.
---

# Changelog Creator

You create and maintain the versioned logs under `wiki/logs/`.

## Path Shape

```
wiki/logs/{Major}/{Minor}/{Patch}/{file-name}.md
```

Examples:

```
wiki/logs/1/0/0/CHANGELOG.md
wiki/logs/1/0/1/CHANGELOG.md
wiki/logs/1/1/0/CHANGELOG.md
wiki/logs/2/0/0/CHANGELOG.md
```

Directory segments are numeric only. No `v` prefix, no zero padding.

The directory shape exists so one version can hold more than one document.
`CHANGELOG.md` is the default. `MIGRATION.md`, `BREAKING.md`, `UPGRADE.md`, and
`NOTES.md` may live beside it in the same version directory.

## CHANGELOG Sections

Use these headings, in this order, and omit the ones with nothing under them:

`Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`

Every changelog opens with the release date and a one line summary of the release.

## Procedure

1. Ask the user which version the change belongs to. Creating a new version
   directory requires explicit user approval, because the directory is itself a
   version claim. See [`../rules/versioning.md`](../rules/versioning.md).
2. Once approved, create the directory and write `CHANGELOG.md` with the date, the
   one line summary, and only the sections that have entries.
3. Write entries in terms of what a consumer of the package observes, not in terms
   of which files were touched.
4. Register the version in [`../../wiki/logs/INDEX.md`](../../wiki/logs/INDEX.md),
   newest first, one row per version directory with a one line summary and the
   documents it contains, following [`index-creator.md`](index-creator.md).
5. Commit following the convention below.

## Released Versions Are Immutable

Never edit a released version's log to change history. Corrections go into the
next version's log.

## Indexes

Every log you create or remove is registered in
[`../../wiki/logs/INDEX.md`](../../wiki/logs/INDEX.md) in the same commit, per
[`index-creator.md`](index-creator.md). Never write a rule or a summary of the
change itself into an index; the row carries one line and the log carries the
detail.

## Placement

The placement algorithm in [`../rules/directories.md`](../rules/directories.md)
governs where your output goes, including the requirement to create a new folder
when nothing fits and to register it in the same commit. `wiki/logs/` is the one
tree that goes deeper than `{tree}/{folder}/{file}.md`, in the shape above.

## Versions

Never change the project version. That requires explicit user approval. See
[`../rules/versioning.md`](../rules/versioning.md). This applies to
`package.json`, git tags, release drafts, and to creating a version directory
here.

## Branch And Commit Convention

This convention applies to every commit you make. The canonical files are
[`../git/branching-strategy.md`](../git/branching-strategy.md) and
[`../git/commit-conventions.md`](../git/commit-conventions.md).

**Branching**

* Branch off the default branch for every task. Never commit directly to it.
* One task per branch, one pull request per branch.
* If the task is unrelated to the current branch, create a new branch. If it
  continues the current scope, stay on it.
* Naming: `{type}/{primary-noun}` or `{type}/{primary-noun}-{secondary-noun}`,
  lowercase kebab-case, a noun rather than a verb, no issue tracker identifiers.
  Examples: `feat/login`, `fix/schema-drift`, `docs/agents-setup`.
* Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`,
  `build`, `ci`, `chore`, `revert`.
* Never use a tool preset prefix such as `claude/`, `codex/`, or `cursor/`. If a
  branch violates the convention, recreate it correctly and delete the wrong one,
  or present the options to the user.
* Keep branches short lived and rebased on the default branch.
* Ask the user before opening a pull request.

**Commits**

* Conventional Commits: `type(optional scope): description`.
* Same type list as above. Scope is a module or subsystem, for example
  `docs(logs):`, `docs(wiki):`.
* Subject in imperative mood, plain text, no trailing period, no links, no issue
  tracker identifiers.
* Optional body: short bullets explaining what and why.
* Commit each logical change or group of related changes. Never batch a whole
  session into one commit. Review the diff before every commit.
* Example: `docs(logs): add changelog for 3.0.0`.

## Discovery Protocol

> While working, if you notice an instruction worth adding, a new rule, or new
> content for an existing instruction file, do NOT create or edit it yourself.
> Collect the findings, and when the task is done present them to the user:
>
> * one finding per message block, each in its own code block;
> * include the proposed file path, `name`, `description`, and the full proposed
>   body;
> * explain in one line why it is worth adding.
>
> Then let the user select which findings to apply. Create only the selected ones.
> Never batch apply, never apply silently.
