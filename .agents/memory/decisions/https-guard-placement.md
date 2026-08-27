---
name: memory-decisions-https-guard-placement
description: Why the https check sits in two places — at the config guard and again at the request boundary — and why the call site alone was not enough.
---

# Decision: Where The https Guard Lives

## 2026-08-27

**Decision.** Each platform module checks the endpoint twice: `requireHttpsUrl`
beside the existing key-exists guard, and `resolveSecureUrl` where the request URL
is built. Both throw.

**Why not the request boundary alone.** That was the first implementation, and it
was measurably wrong. Every module resolves its URL *inside* the try/catch that
wraps the API call, so the guard's throw was caught by the module's own error
handling, retried up to the local limit of three, and returned to the caller as
`{ success: false, message: 'Internal server error' }`. Verified against a stubbed
`axios`: the request was correctly never sent, but the reason was reduced to a
generic failure and three pointless retries. A maintainer reading that result would
look for an outage, not a downgraded endpoint.

Moving the check to the config guard fixes that. It runs before the try/catch,
before any credential is in scope, and it throws the way the neighbouring
"missing in the configuration" guard already throws — so a downgrade is loud and
names the offending key.

**Why keep the call-site check as well.** The config check validates the template.
`resolveSecureUrl` validates the string actually handed to `axios`, after
substitution. Today no template could have its scheme changed by substitution —
every one hardcodes `https://` and the placeholders sit in path positions — so the
second check is defence in depth rather than a live path. It is cheap, and it keeps
the guarantee attached to the request rather than to the current shape of the
templates.

**Do not collapse these into one.** Removing the config-time check restores the
swallowing bug described above. Removing the call-site check makes the guarantee
depend on every future template keeping its placeholders out of the scheme and
authority.

**Not applied to `src/ai/`.** Those clients call `https.request` with a fixed
`hostname` and no scheme string, so there is nothing to downgrade and no guard to
add. `src/mailer/outlook/send.js` uses a nodemailer service preset for the same
reason.
