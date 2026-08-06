# Overview

`jwz` is a Node.js utility package that wraps several common APIs behind one
consistent interface, so routine automation does not have to be rewritten in every
project. It is published to npm as `jwz` and is written in plain CommonJS with no
build step.

## What It Covers

| Area | Provider | What it does |
|---|---|---|
| Git platforms | GitHub, GitLab | Create repositories, delete them, invite and remove collaborators, read release versions. |
| AI providers | DeepSeek, OpenAI, OpenRouter | Send a chat completion request and read the answer and the token usage. |
| Mailer | Outlook | Send an email through Outlook365. |

## Published Entry Points

Every entry point is a subpath export declared in `package.json`. Nothing outside
this table is part of the public surface.

| Import path | Exports |
|---|---|
| `jwz/github` | `buildRepos`, `deleteRepos`, `inviteCollaboratorsToRepos`, `getReleaseVersion`, `removeCollaboratorsFromRepos` |
| `jwz/gitlab` | `buildRepos`, `deleteGroupRepos`, `deletePersonalRepos`, `inviteToGroupRepos`, `inviteToPersonalRepos`, `getReleaseVersion`, `removeFromGroupRepos`, `removeFromPersonalRepos` |
| `jwz/deepseek` | `askAi`, `getCompletion`, `getTokenUsage` |
| `jwz/openai` | `askAi`, `getCompletion`, `getTokenUsage` |
| `jwz/openrouter` | `askAi`, `getCompletion`, `getTokenUsage` |
| `jwz/mailer/outlook/send` | `sendEmail` |

GitLab exposes group and personal variants of the collaborator operations because
the GitLab API treats group projects and personal projects differently. GitHub
uses one organization scoped form.

## Credentials

Every function takes the credential it needs as a parameter. The package never
reads an environment variable, never stores a token, and never ships a default
credential. Supplying and protecting the token is the caller's responsibility.

## Function Reference

Per function parameters, return values, and runnable examples live on the
documentation website, which is maintained in the `jwz-website` repository:

https://jetsadawijit.github.io/jwz-website/

## Related Pages

* [`architecture.md`](architecture.md) for how the source is organized.
* [`../environments/setup.md`](../environments/setup.md) for installing and
  working on the package.
