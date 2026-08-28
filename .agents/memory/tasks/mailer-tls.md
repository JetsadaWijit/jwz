---
name: memory-tasks-mailer-tls
description: Record of making STARTTLS mandatory in the Outlook mailer, and correcting the exemption this repository had wrongly granted it.
status: in progress
---

# Task: Require STARTTLS In The Outlook Mailer

## The finding, and why it is true

Static analysis flagged `src/mailer/outlook/send.js` line 5,
`nodemailer.createTransport`, as using an insecure protocol. It is correct.

Verified three ways rather than assumed:

1. **What the preset resolves to.** `service: 'Outlook365'` resolves to
   `smtp.office365.com`, port `587`, `secure: false`, with `requireTLS` unset.
   `secure: false` means the socket opens in cleartext and is upgraded afterwards, if
   it is upgraded at all.
2. **The library mechanism.** In nodemailer's `smtp-connection`, the upgrade is
   conditional: `if (!this.secure && !this.options.ignoreTLS && (/[ -]STARTTLS\b/im.test(str) || this.options.requireTLS))`.
   Without `requireTLS`, STARTTLS is sent **only when the server advertises it**, so
   removing one line from the EHLO response is enough to prevent the upgrade.
3. **Demonstrated.** Against a local SMTP server that advertises `AUTH` but not
   `STARTTLS`, the shipped configuration sent
   `AUTH PLAIN` with the account password in the clear. With `requireTLS: true` it
   sent no credentials at all.

The credential at stake is the sender's full Outlook account password, passed in as a
parameter, not a scoped token. The failure is silent: mail still sends.

## The exemption this repository got wrong

The https enforcement work explicitly excused this file.
`.agents/security/secrets-and-tokens.md` says the mailer is exempt because it "uses a
nodemailer service preset", and `wiki/logs/3/0/1/CHANGELOG.md` repeats it. That
reasoning is backwards: the preset is what selects a cleartext-by-default port. An
agent reading the instruction today would conclude this file needs no transport guard.

The claim reached five places. Four are correctable. The fifth,
`wiki/logs/3/0/1/CHANGELOG.md`, is a released log and is never rewritten, so the
correction is carried in the next version's log instead.

## The fix

`requireTLS: true` on the transport, keeping `service: 'Outlook365'`.

Rejected alternatives:

* **Port 465 with `secure: true`.** Microsoft 365 SMTP AUTH supports only port 587
  with STARTTLS, so this would stop mail working.
* **Hardcoding host and port instead of the preset.** The preset is maintained
  upstream against Microsoft's settings; `requireTLS` is the control that matters, and
  replacing the preset trades a real dependency for a stale copy.
* **`opportunisticTLS`.** It does the opposite of what is needed: nodemailer logs
  "Failed STARTTLS upgrade, continuing unencrypted" and proceeds. It must stay unset.

## Plan

| # | Title | Scope | Repository | Branch | PR |
|---|---|---|---|---|---|
| 1 | Task record | The plan, written before the work | `jwz` | `chore/mailer-tls-plan` | |
| 2 | Require STARTTLS | The one line fix, and the memory and documentation it makes stale | `jwz` | `fix/mailer-tls` | |
| 3 | Correct the security instruction | The exemption is false and tells the next agent this file is safe | `jwz` | `docs/mailer-tls-instruction` | |
| 4 | Widen the Security Note | The page warns about storing the password, not sending it | `jwz-website` | `fix/mailer-tls` | |
| 5 | Release | Patch version and changelog, carrying the correction to 3.0.1 | `jwz` | `chore/mailer-tls-release` | |

## Constraints

* `sendEmail`'s signature and return shape do not change.
* A working deployment against Microsoft 365 must keep working: 587 with STARTTLS is
  what Microsoft supports, and `requireTLS` only makes the upgrade mandatory rather
  than optional.

### Task 1 — chore/mailer-tls-plan

What landed: this record and its `memory-index.md` row, before any of the work.
