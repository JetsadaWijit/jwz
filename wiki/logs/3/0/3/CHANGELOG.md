# 3.0.3

Released 2026-08-27. Makes STARTTLS mandatory in the Outlook mailer, closing a path
that could send the sender's account password in cleartext.

## Security

* `src/mailer/outlook/send.js` now sets `requireTLS: true` on the transport. The
  `Outlook365` service preset resolves to `smtp.office365.com` port 587 with
  `secure: false`, so the connection opens in cleartext and is upgraded by STARTTLS
  afterwards. By default `nodemailer` attempts that upgrade only when the server
  advertises STARTTLS, so a server that omitted the advertisement received
  `AUTH PLAIN` carrying the sender's password in the clear, and the send still
  succeeded. The upgrade is now compulsory, and the call rejects if it cannot be
  completed.
* The credential at risk was the sender's full Outlook account password, taken as a
  parameter, not a scoped or revocable token.
* Exploiting this required an active attacker on the network path who could alter the
  server's capability list. It was not exposed to a passive observer of a correctly
  behaving connection.

## Changed

* `wiki/information/architecture.md` and `.agents/wiki/context/repository-map.md`
  describe the cleartext start, what `requireTLS` does about it, and why port 465 is
  not an alternative: Microsoft 365 accepts SMTP authentication only on port 587 with
  STARTTLS.
* `.agents/security/secrets-and-tokens.md` no longer exempts the mailer from the
  transport rule, and states that a library preset is a default rather than a
  security guarantee.

## Correction to 3.0.1

The `3.0.1` log said the Outlook mailer "uses a nodemailer service preset, so neither
has a downgrade to guard against". **That was wrong.** The preset is what selects a
cleartext-by-default port, so the mailer did have a downgrade to guard against, and
the same reasoning excused it in this repository's own instructions until now.

A released log is never rewritten, so the correction is recorded here. The AI client
half of that statement still holds: each calls a fixed host through the Node.js
`https` module.

## Unchanged

* `sendEmail`'s signature and its return value. It still resolves with the
  `nodemailer` info object and still rethrows rather than returning a result object.
* Delivery through Microsoft 365. Verified against a local SMTP server that advertises
  STARTTLS and presents a trusted certificate: authentication happens only on the
  upgraded socket, the message is accepted, and the call resolves as before. Verified
  in the other direction too, against a server refusing STARTTLS: no credential is
  sent and the call rejects.
