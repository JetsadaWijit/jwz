---
name: agent-wiki-context-repository-map
description: Orientation for an agent about to work in jwz — what lives where, which commands exist, what the published surface is, and the known gotchas.
---

# Repository Map

Read this before touching anything in `jwz`. It states where things are and what is
true of the project today. Underlying explanation lives in
[`../../../wiki/information/architecture.md`](../../../wiki/information/architecture.md);
this page does not restate it.

## What this repository is

A CommonJS Node.js utility package published to npm as `jwz`, currently at version
`3.0.0`, MIT licensed. It wraps HTTP APIs behind one interface. There is no
framework, no build step, no bundler, and no runtime state — each published function
is a standalone async call to one HTTP API.

## Where things live

| Path | Holds |
|---|---|
| `src/index.js` | The `main` entry. A placeholder; consumers use subpath exports. |
| `src/essential.js` | Shared helpers `readPropertiesFile` and `replacePlaceholders`, plus the transport guards `requireHttpsUrl` and `resolveSecureUrl`. |
| `src/ai/` | One file per AI provider: `deepseek.js`, `openai.js`, `openrouter.js`. |
| `src/github/` | GitHub operations, composed by `index.js`, with endpoints in `properties/api.properties`. `collaborators.js` is shared machinery for `invite.js` and `remove.js`, not an operation and not published. |
| `src/gitlab/` | GitLab operations, same shape as `src/github/`. |
| `src/mailer/outlook/` | Outlook mail sending, composed by `index.js`. |
| `wiki/` | Documentation for people. Not published to npm. |
| `.agents/` | This repository's own instructions, indexes, agent knowledge, and memory. Not published to npm. |
| `.github/` | `FUNDING.yml` and `dependabot.yml`. There is no CI workflow. |

## Entry points

The published surface is the `exports` map in `package.json` and nothing else:

| Subpath | Resolves to |
|---|---|
| `jwz/deepseek`, `jwz/openai`, `jwz/openrouter` | The matching file in `src/ai/`. |
| `jwz/github`, `jwz/gitlab` | That platform's `index.js`, which re-exports the folder's operations. |
| `jwz/mailer/outlook/send` | `src/mailer/outlook/index.js`. |

A file not reachable from that map is internal. Changing the map is a breaking
change for consumers.

## Commands

| Command | Effect |
|---|---|
| `npm install` | Installs the two runtime dependencies, `axios` and `nodemailer`. |
| `npm test` | **A placeholder that prints an error and exits 1.** There is no test runner. |

Do not claim a change is tested — there is nothing to run. If a change needs proof,
write a throwaway script outside the repository, or propose a testing setup through
the discovery protocol in [`../../../AGENTS.md`](../../../AGENTS.md).

## Generated and tracked paths

`package-lock.json` is the only generated file tracked here. There is no build
output, no `dist/`, and nothing to regenerate before committing.

## Known gotchas

* **Endpoint URLs are never inlined.** They live in each platform's
  `properties/api.properties` as templates with `${placeholder}` tokens, read by
  `readPropertiesFile` and filled by `resolveSecureUrl`. Adding an endpoint means
  adding a properties line, not a string literal — see
  [`../../api/api-client-conventions.md`](../../api/api-client-conventions.md).
* **https is checked, not assumed.** Because endpoints are configuration read at
  call time, every platform module calls `requireHttpsUrl` beside its
  key-exists guard, and resolves the request URL through `resolveSecureUrl`. A
  non-https endpoint throws before any credential is used, rather than sending the
  caller's token in cleartext. This is why a new endpoint is added as a properties
  line and never assembled by hand.
* **Credentials are always parameters.** Library code never reads an environment
  variable and never stores a token.
* **`.npmignore` decides the tarball.** `AGENTS.md`, `.agents/`, and `wiki/` are
  excluded on purpose. A new non-runtime directory must be added there too.
* **The codebase avoids dashes in code and comments.** Match what is already there.
* Style already in use: four-space indent, single quotes, semicolons, JSDoc on every
  exported function, one exported operation per file.

## How the shared set resolves

This repository is a **consumer** (Mode B). Branching, commits, pull requests,
planning, and the creators are not stored here — they are served by the
`lxagents-agents-base` MCP connector and read over `agents://`. See the bootstrap
block in [`../../../AGENTS.md`](../../../AGENTS.md).
