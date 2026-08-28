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

### Task 2 — fix/mailer-tls

What landed: `requireTLS: true` on the transport in `src/mailer/outlook/send.js`, with
a comment saying why it is there and naming the two options that would undo it.

Verified against the real exported function, not a copy of it, by redirecting the
well known preset's host and port to a local server through the require cache:

* **Hostile server**, advertising `AUTH` and refusing `STARTTLS`: no credential is
  sent at all, and the call rejects with
  `Error upgrading connection with STARTTLS: 454 TLS not available`. Before the fix
  the same server received `AUTH PLAIN` carrying the password.
* **Cooperative server**, advertising `STARTTLS` and presenting a certificate trusted
  for the test: `AUTH` appears only on the TLS socket and never on the plaintext one,
  the message is accepted, and `sendEmail` resolves with an info object as before.

The second case is the one that mattered most: `requireTLS` must not break a working
deployment, and it does not.

Corrected in the same commit, because this fix disproves them:

* `wiki/information/architecture.md` — the mailer section now explains the cleartext
  start, what `requireTLS` does about it, and why port 465 is not an option.
* `.agents/wiki/context/repository-map.md` — the `src/mailer/outlook/` row.
* `.agents/memory/decisions/https-guard-placement.md` — this is the file that recorded
  the wrong exemption. It now says so, and carries the lesson: "it uses a preset" is a
  reason to check what the preset resolves to, not a reason to skip the check.
* `.agents/memory/state/repository-state.md` — the mailer is no longer listed as
  structurally exempt.
* `.agents/memory/tasks/https-enforcement.md` — a correction note. The wrong audit row
  is deliberately left in place, because it records what was assessed at the time and
  rewriting it would hide that the assessment was made.

Not done here: `.agents/security/secrets-and-tokens.md` still states the exemption.
That is an instruction, gated by `{shared}/rules/discovery-protocol.md`, and it is
task 3.

### Task 3 — docs/mailer-tls-instruction

What landed: the finding raised in task 2, once the user selected it.

`.agents/security/secrets-and-tokens.md` no longer excuses the mailer. The AI clients
keep their exemption, which is still true. A new "SMTP Is A Second Transport, And It
Is Not Exempt" section replaces the wrong claim with three rules: set `requireTLS` on
any authenticating SMTP transport, never set `opportunisticTLS` or `ignoreTLS`, and
never treat a library preset as a security guarantee.

The wrong reasoning is stated in the file rather than quietly deleted. The failure
was not a typo, it was an inference that sounded right, and an instruction that shows
the inference it is correcting is harder to re-derive.

`.agents/skills/add-api-module.md` gains a checklist item, because that skill covers
adding a new mail transport and its checklist is what an agent verifies against.

**Possible promotion to the shared set.** The third rule, that a library preset is a
default and not a guarantee, is not specific to this repository or to mail. It is
written locally because a consuming repository never writes into the shared set, and
it is noted here as a candidate to raise against `LXAgents-MCP/shared-instruction`
later. It is not being proposed there as part of this task.

### Task 5 — chore/mailer-tls-release

What landed: the patch bump to `3.0.3`, `wiki/logs/3/0/3/CHANGELOG.md`, and its row at
the top of the logs index.

Patch rather than minor: no signature or return value changed, and a deployment
against Microsoft 365 is unaffected because 587 with STARTTLS is what Microsoft
supports. The only case that now behaves differently is one that was already sending
the password in the clear.

The log carries a `Correction to 3.0.1` section. That release stated the mailer had no
downgrade to guard against, which was false. A released log is never rewritten, so the
correction goes in the next version's log, and it is a section of its own rather than
a footnote because a consumer who read the 3.0.1 claim needs to find it.

The `Security` section states the exploit conditions honestly: an active attacker able
to alter the server's capability list, not a passive observer. Overstating it would be
as unhelpful as the original omission.
