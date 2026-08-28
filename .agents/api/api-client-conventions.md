---
name: api-client-conventions
description: How an API client module in jwz is shaped: properties files for endpoints, placeholder substitution, return contract, and retries.
---

# API Client Conventions

Every module under `src/github/`, `src/gitlab/`, `src/ai/`, and
`src/mailer/` is an API client. They follow one shape. Match it.

## Endpoints Live In Properties Files

Never inline an endpoint URL in a function body for the Git platform clients.
URLs belong in `src/{platform}/properties/api.properties`, one comment line and
one `key=value` line each:

```
# get repo url
repourl=https://api.github.com/orgs/${organization}/repos
```

Keys are lowercase with no separators, for example `repourl`,
`repospecificurl`, `repocollaboratorurl`, `reporeleaseurl`.

Read the file with the shared helpers, never with a hand rolled parser:

```js
const path = require('path');
const { readPropertiesFile, requireHttpsUrl, resolveSecureUrl } = require('../essential');

const filePath = path.join(__dirname, 'properties', 'api.properties');
const config = readPropertiesFile(filePath);
```

Substitute `${placeholder}` segments with
`resolveSecureUrl(url, replacements, key)`, where the replacement keys are the
placeholder names, for example `{ organization: org, repository: repo }`, and `key`
is the properties key the template came from. That helper substitutes and then
re-checks the scheme, so the URL handed to the HTTP client is verified rather than
assumed.

`replacePlaceholders(url, replacements)` still exists and still substitutes, but it
performs no transport check. Do not call it directly to build a request URL.

The AI clients in `src/ai/` are the documented exception: they call one fixed
host each through `https.request` with an explicit `hostname` and `path`. Keep
that shape when editing them rather than converting them.

## Guard The Configuration

Before using a key, check it exists and throw a plain message if it does not:

```js
if (!config.repourl) {
    throw new Error("Repository URL is missing in the configuration.");
}
```

Immediately after that check, assert the endpoint is https:

```js
requireHttpsUrl(config.repourl, 'repourl');
```

Both guards belong there: at the top of the function and **outside any `try`**. Every
request carries the caller's credential, so an endpoint edited down to `http://` would
transmit that credential in cleartext.

Placing the https check inside the `try` that wraps the API call does not work. The
module's own error handling catches the throw, retries it to the retry limit, and
reports it as a generic failure, so the misconfiguration is hidden rather than
surfaced. The request is still not sent, but nobody learns why.

`resolveSecureUrl` re-checks the scheme at the request boundary as well. Keep both:
the guard above fails loudly on a downgraded file, and the boundary check keeps the
guarantee attached to the URL actually sent. Neither replaces the other.

## Shared Internal Helpers

One operation per file is the rule. A file under a platform folder that is **not** an
operation is allowed only when two or more operations would otherwise be near copies
of one another, and it has to earn that by removing duplication that already exists,
never by anticipating duplication that might.

`src/github/collaborators.js` is the worked example. Inviting a collaborator and
removing one differ only in the HTTP verb, so the endpoint guard, the iteration over
repositories and collaborators, and the per entity result shape live there once, and
`invite.js` and `remove.js` each supply their own request and nothing else.

When you extract one:

* Name it for what it holds, not for an operation, so it is not mistaken for one.
* **Keep it out of the folder's `index.js`.** It is not published, and adding it there
  changes the public surface.
* **Keep the guards in the helper**, not in the operations. The point of the
  extraction is that the endpoint is read and checked in one place.
* Leave each operation a wrapper that supplies only what differs between them.
* Do not give it a page on the documentation site. It is internal, and it appears
  there only as context inside the page of an operation that calls it.

Prove the extraction changed nothing: capture the requests issued and the resolved and
rejected values before and after, and compare them. A refactor that alters what a
caller sees is not a refactor.

Within one file, prefer the GitLab shape instead: `src/gitlab/remove.js` keeps a
generic function and its thin wrappers together, which is the right answer when the
variants belong to the same operation rather than to two.

## Return Contract

Platform operations resolve, they do not reject, for anything that happens **during
the call**. The configuration guards above are the exception and are meant to throw:
they run before the request, so a missing key or a non-https endpoint is a broken
installation rather than a failed operation. Return a plain object:

* Success: `{ success: true, message, ...context }` where the context names the
  entities involved, for example `repositoryName` and `organizationName`.
* Failure: `{ success: false, message, status }`.

A function that operates on an array of entities returns an array of these
objects, one per entity, produced with `Promise.all`.

The AI clients return the parsed provider response as is, with separate small
extractors such as `getCompletion(json)` and `getTokenUsage(json)` that return a
safe default rather than throwing when a field is missing.

## Retries

Where a platform call retries, it uses a local `const retryLimit = 3;` and an
inner recursive helper that takes `attempt = 1` and calls itself with
`attempt + 1` until the limit is reached. Do not add a retry library and do not
change the limit silently.

## Authentication

The token is always the caller's, passed in as a parameter, and sent as
`Authorization: Bearer ${token}` for GitHub and the AI providers. See
[`../security/secrets-and-tokens.md`](../security/secrets-and-tokens.md).

## Documentation

Every exported function carries JSDoc with `@async` where it applies, one `@param`
per argument with its type, `@returns`, and `@throws` when the function throws.
The website repository documents the same function; see
[`../skills/add-api-module.md`](../skills/add-api-module.md).
