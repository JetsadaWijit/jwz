---
name: memory-state-repository-state
description: Current known state of jwz — what exists, what does not, how the shared set resolves, and the next obvious step.
---

# Repository State

## What exists

* A published npm package at version `3.0.0`, CommonJS, MIT licensed.
* Six subpath exports: three AI providers, GitHub, GitLab, and the Outlook mailer.
* Two runtime dependencies, `axios` and `nodemailer`.
* A checked https invariant on the ten GitHub and GitLab modules: endpoints are
  configuration, so `requireHttpsUrl` and `resolveSecureUrl` in `src/essential.js`
  reject a non-https endpoint before any credential is used. The AI clients are
  structurally exempt, calling a fixed host through the `https` module.
* Mandatory STARTTLS in the Outlook mailer. The `Outlook365` preset opens in cleartext
  on port 587, so `requireTLS: true` makes the upgrade compulsory and the call rejects
  rather than sending the password in the clear. The mailer was wrongly recorded as
  exempt from the transport rule until 2026-08-27.
* A human wiki under `wiki/` with overview, architecture, setup, and one version log
  directory at `wiki/logs/3/0/0/`.
* A local instruction set under `.agents/` covering only what is specific to this
  package: repository rules, API client conventions, secrets handling, dependency
  policy, and the add-an-API-module skill.

## What does not exist

* **No test suite.** `npm test` is a placeholder that exits 1.
* No CI workflow. `.github/` holds only `FUNDING.yml` and `dependabot.yml`.
* No build step, bundler, or transpiler, by policy.

## How the shared set resolves

Mode B, consumer. The shared conventions — branching, commits, pull requests, task
workflow, the creators, the directory architecture — are served by the
`lxagents-agents-base` MCP connector and read over `agents://`. Nothing from that set
is stored in this repository, and no local file overrides one.

## Next obvious step

The absent test suite is the largest gap, and the `npm test` placeholder actively
misreports it. Proposing a test runner is the next thing worth raising with the
maintainer; it is a decision for them, not a change to make unprompted.
