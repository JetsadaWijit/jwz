---
name: agents-entry-point
description: Entry point for agents working in the jwz repository. Overview and routing only, never detailed rules.
---

# AGENTS

`jwz` is a Node.js utility package published to npm. It wraps several common HTTP
APIs behind one consistent interface: Git platform operations for GitHub and
GitLab, chat clients for DeepSeek, OpenAI and OpenRouter, and an Outlook mailer.
The published surface is defined by the `exports` map in `package.json`, and the
source lives under `src/`.

This file is an overview. It contains no rules of its own.

## Reading Order

1. Read this file, `AGENTS.md`.
2. Read the root [`INDEX.md`](INDEX.md), and nothing else at this stage.
3. From its routing table, pick the ONE index whose scope matches the task, and
   read that index.
4. If that index delegates to a child index, follow the one branch that matches.
5. Only then open the specific file or files you need.

## Routing Protocol

Route by reading index tables, not by reading files. Do NOT load every `INDEX.md`.
Do NOT bulk scan `.agents/**` to build a registry. Do NOT read an instruction body
until that instruction has been selected. Each index row's purpose text is what you
route on; the file body is what you load after choosing. This is the whole point of
the index tree, so never defeat it by reading ahead.

## Iron Rule: Separation of Concerns

* `AGENTS.md` and `README.md` are overviews. They must never carry detailed rules
  or detailed documentation.
* The root [`INDEX.md`](INDEX.md) is a router only. It lists other indexes. It
  must never contain rules, documentation, prose, or direct links to leaf content,
  and it must never be used to dictate or write files inside any subtree.
* [`.agents/INDEX.md`](.agents/INDEX.md) is the sole authority that indexes and
  manages `.agents/`. Nothing outside `.agents/` may dictate or write files inside
  it.
* [`wiki/INDEX.md`](wiki/INDEX.md) indexes `wiki/` and must never write into
  `.agents/`.

## Placement

* New instructions go to `.agents/{folder}/{file}.md`.
* New documentation goes to `wiki/{folder}/{file}.md`.
* The placement authority is
  [`.agents/rules/directories.md`](.agents/rules/directories.md).
* New or updated indexes follow
  [`.agents/creators/index-creator.md`](.agents/creators/index-creator.md).

## Discovery Protocol

While working, if you find an instruction worth adding, a new rule, or content
that belongs in an existing instruction file, you must NOT create or edit it on
your own. Present each finding to the user separately, each in its own code
block, including the proposed file path, `name`, `description`, and full body.
Let the user select which ones to apply. Create only what the user selects.

## Standing Conventions

Every branch and every commit follows
[`.agents/git/branching-strategy.md`](.agents/git/branching-strategy.md) and
[`.agents/git/commit-conventions.md`](.agents/git/commit-conventions.md). The
standing prompt is
[`.agents/prompts/branch-and-commit.md`](.agents/prompts/branch-and-commit.md).
The user never has to restate these.

## Version Rule

Never change the project version without explicit user approval. See
[`.agents/rules/versioning.md`](.agents/rules/versioning.md).
