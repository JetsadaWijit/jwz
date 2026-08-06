---
name: repository-rules
description: Rules specific to the jwz package: source layout, publish surface, commands, coding conventions, and what must not be introduced.
---

# Repository Rules

`jwz` is a CommonJS Node.js package published to npm. This file is a hub. Where a
subject has its own instruction file, this file links to it instead of restating
it.

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
[`versioning.md`](versioning.md).

`.npmignore` decides what ships in the tarball. Agent instructions (`AGENTS.md`,
`.agents/`) and documentation (`wiki/`) are excluded on purpose. Keep it that way
when adding new non runtime directories.

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
