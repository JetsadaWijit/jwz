---
name: dependency-policy
description: Keep runtime dependencies minimal, handle Dependabot updates deliberately, and never bump the package version alongside them.
---

# Dependency Policy

## Runtime Dependencies Stay Minimal

The package currently depends on `axios` for HTTP and `nodemailer` for mail.
Everything else uses the Node.js standard library, for example `https`, `fs`, and
`path`.

Before adding a runtime dependency, check whether the standard library or an
existing dependency already covers the need. If a new dependency is genuinely
required, propose it to the user first and state what it does, how large its own
dependency tree is, its license, and why the standard library is not enough. Do
not add it unilaterally.

Do not add a development dependency, a bundler, a transpiler, or a formatter
without approval either. The package publishes plain source with no build step.

## Version Ranges And The Lockfile

* Runtime dependencies use a caret range, for example `^1.6.2`. Keep that style.
* `package-lock.json` is committed and must be kept in sync. When you change
  `package.json` dependencies, run `npm install` and commit the resulting lockfile
  in the same commit.
* Never edit `package-lock.json` by hand.

## Dependabot

`.github/dependabot.yml` is configured for this repository, so dependency update
pull requests arrive automatically.

* Read what actually changed before merging one. A patch or minor bump on a direct
  runtime dependency is still a change to what consumers install.
* A major bump on `axios` or `nodemailer` can change behavior at the call sites in
  `src/`. Check those call sites before accepting it.
* Security updates take priority. Note in the commit or the pull request what the
  update fixes, in plain words and without an issue reference.

## Never Bundle A Version Bump

Updating a dependency does not authorize changing the package version. Keep the
two separate and ask the user before any version change. See
`{shared}/rules/versioning.md`.

## Commit Style

Use the `deps` scope: `chore(deps): update axios to 1.7.0`, or `fix(deps):` when
the update closes a vulnerability. See
`{shared}/git/commit-conventions.md`.
