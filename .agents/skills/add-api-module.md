---
name: add-api-module
description: Step by step procedure for adding a new function or provider to the jwz published surface, from source file to website documentation.
---

# Skill: Add An API Module

Use this when adding a new operation to an existing platform, or a whole new
provider, to the published surface of the package.

## 1. Decide Where It Belongs

| Kind of addition | Location |
|---|---|
| New operation on GitHub or GitLab | `src/{platform}/{operation}.js`, one exported function per file. |
| New AI provider | `src/ai/{provider}.js`. |
| New mail transport | `src/mailer/{transport}/`. |
| Something that fits none of the above | Ask the user before creating a new top level folder under `src/`. |

Name the file after the operation, lowercase, no separators, matching the existing
files: `build.js`, `delete.js`, `invite.js`, `release.js`, `remove.js`.

A file that is not an operation is allowed only as a shared internal helper, under
"Shared Internal Helpers" in
[`../api/api-client-conventions.md`](../api/api-client-conventions.md). Do not create
one while adding a single operation. Extract it later, when a second operation would
otherwise duplicate the first, and never add it to the folder's `index.js`.

## 2. Add The Endpoint

For a Git platform operation, add the URL to
`src/{platform}/properties/api.properties` with a comment line above it, using
`${placeholder}` segments for caller supplied values. Do not inline the URL in the
function.

**The URL must be `https://`.** Never add a plaintext endpoint: the guards in step 3
reject one at runtime, and every request to it would carry the caller's credential.

## 3. Write The Function

Follow [`../api/api-client-conventions.md`](../api/api-client-conventions.md):
CommonJS, four space indentation, single quotes, semicolons, shared helpers from
`src/essential.js`, the `{ success, message, ... }` return contract, and the
existing retry shape. Credentials are parameters only, per
[`../security/secrets-and-tokens.md`](../security/secrets-and-tokens.md).

Guard the endpoint before using it. After the key-exists check, and outside any
`try`, assert the transport, then build the request URL through `resolveSecureUrl`:

```js
if (!config.repourl) {
    throw new Error("Repository URL is missing in the configuration.");
}

requireHttpsUrl(config.repourl, 'repourl');

// ...later, where the request is made
const url = resolveSecureUrl(config.repourl, replacements, 'repourl');
```

Do not build a request URL with `replacePlaceholders`; it substitutes without
checking the scheme. Do not move the `requireHttpsUrl` call inside the `try` that
wraps the API call, or the module's own error handling will swallow it and report a
misconfigured endpoint as a generic failure.

End the file with `module.exports = {functionName};` for a single operation, or an
object for a provider that exports several functions.

## 4. Write The JSDoc

Document the function above its definition: a one line summary, `@async` where it
applies, one `@param` per argument with its type and meaning, `@returns`, and
`@throws` where the function throws.

## 5. Re-export It

Add the function to the platform's `src/{platform}/index.js` re-export object.
That `index.js` is what the `exports` map points at, so a function that is not
re-exported is not published.

## 6. Update The Exports Map Only If Needed

Adding an operation to an existing platform needs no change to `package.json`,
because the platform entry already points at the folder `index.js`. Adding a new
provider or transport does need a new entry in the `exports` map. That changes the
public surface, so state it clearly when reporting the work, and never bump the
version yourself. See `{shared}/rules/versioning.md`.

## 7. Check What Ships

Confirm nothing you added is excluded by `.npmignore` and that no agent
instruction or documentation directory has become includable.

## 8. Document It On The Website

The function is not documented in this repository. The documentation site lives in
the `jwz-website` repository, one page per function under
`docs/{area}/{function}/index.html`, linked from `docs/index.html`. Adding a
function here means a page is missing there. Tell the user, or open that work as a
separate task in that repository, following its own instructions.

## 9. Commit

`feat({platform}): add {operation} for {platform}`, one logical change per commit,
diff reviewed first. See
`{shared}/git/commit-conventions.md`.

## Verify Before Reporting Done

* The file exports exactly one operation, or one provider object.
* The endpoint is in the properties file, not in the function, and it is `https://`.
* `requireHttpsUrl` runs beside the key-exists guard, outside any `try`, and the
  request URL is built with `resolveSecureUrl`.
* No credential is hardcoded, logged, or concatenated into a URL.
* The function is reachable from `src/{platform}/index.js`.
* The JSDoc is complete.
* The version is unchanged.
