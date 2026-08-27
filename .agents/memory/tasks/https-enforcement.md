---
name: memory-tasks-https-enforcement
description: Record of making https a checked invariant in the API clients — the audit that found no plaintext endpoint, the guard added in its place, and the documentation re-synced with it.
---

# Task: Enforce https At The Request Boundary

## Goal

Close the credential-leak path behind issue "Using http protocol is insecure. Use
https instead." Every request this package makes carries the caller's token, so a
request issued over `http://` leaks that token in cleartext.

## Audit before planning

The literal reading of the issue — replace `http://` with `https://` — has nothing
to act on. Every endpoint in the package is already `https://`:

| File | Endpoints | Scheme |
|---|---|---|
| `src/github/properties/api.properties` | 4 | all `https://api.github.com` |
| `src/gitlab/properties/api.properties` | 5 | all `https://gitlab.com` |
| `src/ai/*.js` | 3 hosts | `https.request`, no scheme string to get wrong |
| `src/mailer/outlook/send.js` | — | nodemailer service preset, no endpoint |

The defect is the absence of enforcement, not the presence of plaintext. Endpoints
are not constants: `readPropertiesFile` reads them at call time from a file that
ships inside the package and is editable in `node_modules`, `replacePlaceholders`
interpolates caller values into them unvalidated, and the result goes straight to
`axios` alongside `Authorization: Bearer ${token}`. Nothing checks the scheme
survived, and a downgrade would succeed silently.

## Out of scope, deliberately

Two `http://` strings in `jwz-website` match a find-and-replace but must not change:

* `xmlns="http://www.w3.org/2000/svg"` in `docs/js/site.js` — an XML namespace
  name. It is a constant identifier, never dereferenced; rewriting it to `https`
  breaks SVG rendering.
* `http://localhost:8000/` in `wiki/environments/setup.md` — a loopback address
  served by `python3 -m http.server`, which does not speak TLS.

Recorded here so a future pass does not "fix" them.

## Plan

| # | Title | Scope | Repository | Branch | Files / areas | PR |
|---|---|---|---|---|---|---|
| 1 | Task record | The confirmed plan, written before any of it is built | `jwz` | `chore/https-enforcement-plan` | `.agents/memory/tasks/https-enforcement.md`, `.agents/index/memory-index.md` | |
| 2 | Enforce https at the request boundary | Scheme guard in the shared helper, wired into all ten platform modules; agent docs re-synced | `jwz` | `fix/https-enforcement` | `src/essential.js`, `src/github/*.js`, `src/gitlab/*.js`, `.agents/api/api-client-conventions.md`, `.agents/security/secrets-and-tokens.md` | |
| 3 | Re-sync the embedded code samples | The site quotes module source verbatim, so task 2 makes ten pages stale | `jwz-website` | `fix/https-enforcement` | `docs/github/*/index.html`, `docs/gitlab/*/index.html` | |
| 4 | Release | Patch version, changelog, index rows, close this record | `jwz` | `chore/https-enforcement-release` | `package.json`, `wiki/logs/3/0/1/`, `.agents/index/logs-index.md`, this record | |

Tasks 1, 2 and 4 stack in order within `jwz`. Task 3 is in another repository, so it
cannot stack; it is ordered after task 2 because it copies the source task 2 writes,
and its branch carries the same name per the branching strategy.

## Decisions confirmed with the user before starting

* **Fail loudly, do not auto-upgrade.** A non-https endpoint throws rather than
  being silently rewritten, so a misconfiguration surfaces instead of being masked.
* **Patch bump to `3.0.1`.** No valid usage changes behaviour; the guard can only
  fire on configuration that was already unsafe.
* **Pull requests opened, nothing merged.** The merge gate stays with the user.

### Task 1 — chore/https-enforcement-plan

What landed: this record and its `memory-index.md` row, in one commit, before any of
the work it plans.

Left for later: the `PR` column above, filled by task 4 per
`{shared}/planning/task-workflow.md` §F.

Next task depends on: nothing beyond this record existing.
