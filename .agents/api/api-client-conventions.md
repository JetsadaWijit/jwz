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
const { readPropertiesFile, replacePlaceholders } = require('../essential');

const filePath = path.join(__dirname, 'properties', 'api.properties');
const config = readPropertiesFile(filePath);
```

Substitute `${placeholder}` segments with `replacePlaceholders(url, replacements)`
where the replacement keys are the placeholder names, for example
`{ organization: org, repository: repo }`.

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

## Return Contract

Platform operations resolve, they do not reject. Return a plain object:

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
