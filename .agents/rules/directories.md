---
name: directory-architecture
description: Placement authority for the .agents and wiki trees, including the algorithm for creating a new folder when no existing folder fits.
---

# Directory Architecture

This file decides where a new file goes. It covers both trees: `.agents/` for
instructions an agent follows, and `wiki/` for documentation a human reads.

Instructions live at `.agents/{folder}/{file}.md`. Documentation lives at
`wiki/{folder}/{file-name}.md`. All file and folder names in both trees are
lowercase kebab-case with no spaces.

## A. `.agents/` Baseline Folders

Folders marked **in use** exist in this repository today. The rest are the
baseline vocabulary: use one when the project grows into it, and register it here
and in [`../INDEX.md`](../INDEX.md) in the same commit.

| Folder | Holds | Status |
|---|---|---|
| `rules/` | Repository wide rules and the directory architecture itself. | in use |
| `git/` | Branching strategy, commit format, pull request etiquette. | in use |
| `creators/` | The instruction, information, and changelog creator agents. | in use |
| `prompts/` | Standing prompt templates and few shot examples. | in use |
| `api/` | API design standards and specification guidelines. | in use |
| `security/` | Security policy, secret handling, vulnerability prevention. | in use |
| `dependencies/` | Package management and version update policy. | in use |
| `skills/` | Step by step procedures for recurring tasks. | in use |
| `docs/` | Rules for writing README, wiki, and index files. | baseline |
| `tools/` | Tool definitions and schemas. | baseline |
| `knowledge/` | Domain context an agent needs to reason correctly. | baseline |
| `personas/` | Roles and behaviors to adopt. | baseline |
| `ethics/` | Safety boundaries and constraints. | baseline |
| `planning/` | Task breakdown, estimation, prioritization procedures. | baseline |
| `architecture/` | System design guidelines and structural constraints. | baseline |
| `database/` | Schema design, migrations, query constraints. | baseline |
| `performance/` | Performance, memory, and bottleneck guidelines. | baseline |
| `compliance/` | Licensing, legal, and privacy policy. | baseline |
| `deploy/` | Deployment, environments, containerization. | baseline |
| `workflows/` | CI and CD automation rules. | baseline |
| `testing/` | Test strategy, coverage, fixtures. | baseline |

## B. `wiki/` Baseline Folders

| Folder | Holds | Status |
|---|---|---|
| `information/` | What the project is, architecture, features, concepts. | in use |
| `environments/` | Setup, runtime, configuration, and CI pages. | in use |
| `logs/` | Versioned change logs. See the shape below. | in use |
| `guides/` | Task oriented how tos. | baseline |
| `reference/` | Commands, config keys, API surface, schema. | baseline |

## C. Placement Algorithm

1. Pick the existing folder whose topic actually contains the new file's subject.
2. If no existing folder fits, do NOT force the file into the closest one and do
   NOT rename the file to pretend it fits. Create a new folder that fits:
   lowercase kebab-case, a plain topic noun, for example `.agents/observability/`
   or `wiki/integrations/`, and put the file there.
3. Whenever you create a new folder, register it in the table above AND in the
   matching index, [`../INDEX.md`](../INDEX.md) or
   [`../../wiki/INDEX.md`](../../wiki/INDEX.md), in the same commit. The tables
   above are a baseline, not a closed set.
4. If an existing file already covers the subject, extend that file instead of
   adding a near duplicate. This is still subject to the discovery protocol:
   propose the change, do not self apply it.
5. Never place a loose file at the root of `.agents/` except `INDEX.md`, and never
   at the root of `wiki/` except `INDEX.md`.
6. Depth is `{tree}/{folder}/{file}.md`. Go deeper only for `wiki/logs/`, which
   has its own required shape.

## D. Log Directory Shape

`wiki/logs/{Major}/{Minor}/{Patch}/{file-name}.md`, for example
`wiki/logs/3/0/0/CHANGELOG.md`. Directory segments are numeric only: no `v`
prefix, no zero padding. A version directory may hold more than one document.
See [`../creators/changelog-creator.md`](../creators/changelog-creator.md).

Creating a new version directory is a version claim and requires user approval.
See [`versioning.md`](versioning.md).

## E. File Format

* Every `.md` file under `.agents/`, plus the root `AGENTS.md`, starts with YAML
  frontmatter carrying a unique kebab-case `name` and a one line `description` of
  at most 140 characters, followed by a single `#` H1 title and the body.
* Files under `wiki/` are plain documentation with no frontmatter.
* One topic per file. If a file needs two H1 level subjects, it is two files.
* Keep links relative and clickable.
