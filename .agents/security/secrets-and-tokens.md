---
name: secrets-and-tokens
description: Credential handling for a library whose callers supply their own tokens. No hardcoding, no env reads in library code, no leaking in errors.
---

# Secrets And Tokens

Every operation in this package acts on a credential that belongs to the caller: a
GitHub or GitLab access token, an AI provider API key, or Outlook mail
credentials. The package never owns a credential.

## Rules

* A credential is always a function parameter. Library code under `src/` must
  never read `process.env`, never read a dotfile, and never fall back to a default
  credential. Configuration of the caller's environment is the caller's job.
* Never hardcode a token, key, password, or account address in source, in
  properties files, in JSDoc, or in documentation examples. Use an obvious
  placeholder such as `"YOUR_TOKEN"`.
* Never commit a real credential, even briefly, and even in a file you plan to
  delete in the next commit. If one is committed, tell the user immediately so the
  credential can be revoked. Do not attempt history rewriting on your own.
* `.env` files are already ignored by `.gitignore`. Do not add an exception for
  them.

## Do Not Leak In Output

* Never log a token, a full `Authorization` header, or a whole request options
  object. The existing clients log `error.message` and return
  `error.response?.status`, which is the pattern to follow.
* Never place a credential into a URL, a query string, or a thrown error message.
* When adding a new error path, check what the message would contain if the caller
  printed it.

## Never Send A Credential Over Plaintext

Every operation here sends the caller's credential to an endpoint read at call time
from `src/{platform}/properties/api.properties`. That file ships inside the package
and is editable wherever it is installed, so the transport is configuration, and
configuration is checked rather than assumed.

* Assert the endpoint before using it: `requireHttpsUrl(config.{key}, '{key}')`
  beside the key-exists guard, outside any `try`. Build the request URL with
  `resolveSecureUrl`, which re-checks the scheme after substitution. Both throw on a
  non-https endpoint. See
  [`../api/api-client-conventions.md`](../api/api-client-conventions.md).
* Never send a credential to a URL whose scheme has not been checked.
* Never silently upgrade a plaintext endpoint to https. A downgraded endpoint is a
  misconfiguration to surface, not one to paper over — repairing it quietly leaves
  the broken file in place for the next caller.
* An error raised by these guards names the properties key and the protocol only.
  Never widen it to include the resolved URL, the request headers, or anything
  derived from the credential.

The AI clients in `src/ai/` are exempt because they have no scheme to get wrong: each
calls a fixed `hostname` through the Node.js `https` module. Converting one to a
configurable endpoint brings it under this rule.

### SMTP Is A Second Transport, And It Is Not Exempt

This file previously excused the Outlook mailer on the grounds that it "uses a
nodemailer service preset". That was wrong, and it is recorded here rather than
quietly deleted, because the reasoning is the kind that repeats.

`service: 'Outlook365'` resolves to port 587 with `secure: false`. The connection
opens in **cleartext** and is upgraded by STARTTLS afterwards, and by default
nodemailer attempts that upgrade only when the server advertises it. A server that
omits the advertisement receives the sender's password in the clear, and the send
still succeeds.

* **Set `requireTLS: true` on any SMTP transport that authenticates.** It makes the
  upgrade mandatory, so a transport that cannot be secured rejects instead of falling
  back to plaintext.
* **Never set `opportunisticTLS` or `ignoreTLS`.** The first continues unencrypted
  after a failed upgrade; the second skips the upgrade altogether. Either one restores
  exactly the hole `requireTLS` closes.
* **Never conclude a transport is safe because a library preset selected it.** Check
  what the preset resolves to. A preset is a convenience default, not a security
  guarantee, and the one here defaults to cleartext.

The third point is the general one, and it is not specific to mail: it applies to any
dependency whose defaults decide a transport on your behalf.

## Injected Values In URLs

Values that come from the caller, organization names, repository names,
collaborator names, are substituted into endpoint templates by `resolveSecureUrl`.
Substitute only into the placeholder positions defined in the properties file. Never
build a URL by concatenating caller input onto a base string, because that lets a
caller supplied value change the path or the host — and a value that reaches the
scheme or the authority defeats the transport guard, which is why the resolved URL is
re-checked rather than only the template.

## Before Finishing A Task

Review the security of every file you modified and committed on the branch:
credential handling, transport, injected input in URLs, and error output that could
expose a token.

## Dependencies

Security fixes in dependencies are handled under
[`../dependencies/package-policy.md`](../dependencies/package-policy.md). A
dependency update that closes a vulnerability is still a version decision for the
user; see `{shared}/rules/versioning.md`.
