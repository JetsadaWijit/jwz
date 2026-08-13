---
name: repository-rules
description: Rules specific to the jwz package: source layout, publish surface, commands, coding conventions, and what must not be introduced.
---

# Repository Rules

`jwz` is a CommonJS Node.js package published to npm. This file is a hub. Where a
subject has its own instruction file, this file links to it instead of restating
it.

## Mode And Shared Set

This repository is a **consumer** (Mode B). The conventions that are true across
the organization — branching, commits, pull requests, task workflow, the creators,
the directory architecture — are served by the `lxagents-agents-base` MCP connector
and read over `agents://`. They are not stored here, and this file never restates
them. Only what is specific to this package belongs below.

## Source Layout

| Path | Holds |
|---|---|
| `src/index.js` | Package `main`. Currently a placeholder; consumers use subpath exports. |
| `src/essential.js` | Shared helpers: `readPropertiesFile` and `replacePlaceholders`. |
| `src/ai/` | One file per AI provider: `deepseek.js`, `openai.js`, `openrouter.js`. |
| `src/github/` | GitHub operations plus `properties/api.properties`. |
| `src/gitlab/` | GitLab operations plus `properties/api.properties`. |
| `src/mailer/outlook/` | Outlook mail sending. |

Each platform folder has an `index.js` that re-exports the folder's functions.
That `index.js` is the only thing the `exports` map in `package.json` points at
for that platform.

## Publish Surface

The public surface is the `exports` map in `package.json` and nothing else. A file
that is not reachable from that map is internal. Adding, renaming, or removing an
entry in that map is a breaking change for consumers, so treat it under
`{shared}/rules/versioning.md`.

`.npmignore` decides what ships in the tarball. Agent instructions (`AGENTS.md`,
`.agents/`) and documentation (`wiki/`) are excluded on purpose. Keep it that way
when adding new non runtime directories.

## Version Carriers Here

`{shared}/rules/versioning.md` gates every version change. These are the carriers
that actually exist in this repository, and the commands that rewrite them:

* the `version` field in `package.json`, and the matching field in
  `package-lock.json`;
* git tags and GitHub release drafts on this repository;
* a new `wiki/logs/{Major}/{Minor}/{Patch}/` directory, which is itself a version
  claim;
* `npm version` and `npm publish`, or any command that rewrites the version.

Because the package is published to npm, a bump is visible to every consumer the
moment it lands. Propose it and wait; never stage one.

## Commit Scopes Here

`{shared}/git/commit-conventions.md` defines the commit format. The scopes below are
the real subsystem names in this repository, and a commit touching one of them uses
it:

`github`, `gitlab`, `ai`, `mailer`, `agents`, `wiki`, `deps`

## Commands

| Command | Effect |
|---|---|
| `npm install` | Installs `axios` and `nodemailer`. |
| `npm test` | Currently a placeholder that exits non zero. There is no test runner in this repository. |

Do not claim a change is tested. There is no test suite. If a change needs proof,
write a throwaway script outside the repository or propose a testing setup through
the discovery protocol in [`../../AGENTS.md`](../../AGENTS.md).

## Coding Conventions Already In Use

Follow what the codebase already does. Do not reformat unrelated code.

* CommonJS only: `require` and `module.exports`. No ESM syntax.
* Four space indentation, single quotes, semicolons.
* JSDoc on every exported function, documenting `@param`, `@returns`, and
  `@throws` where it applies.
* One exported operation per file. The folder `index.js` composes them.
* Endpoint URLs are never inlined. See
  [`../api/api-client-conventions.md`](../api/api-client-conventions.md).
* Code and comments must not contain dashes.

## What Must Not Be Introduced

* No new runtime dependency without approval. See
  [`../dependencies/package-policy.md`](../dependencies/package-policy.md).
* No build step, bundler, or transpiler. The package publishes plain source.
* No hardcoded credentials, and no reading of tokens from the environment inside
  library code. See [`../security/secrets-and-tokens.md`](../security/secrets-and-tokens.md).
* No generated or build output committed to the repository. The only generated
  file tracked here is `package-lock.json`.
* No change to the `exports` map or the version without user approval.

## Finishing Work

Before finishing a task, review the security of every file you modified and
committed on the current branch, checking credential handling, injected input in
URLs, and error output that could leak a token.
