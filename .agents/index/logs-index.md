---
name: logs-index
description: Versioned change logs for jwz, newest version first, with the documents each version directory contains.
---

# Logs Index

**Scope:** `wiki/logs/`
**Parent:** [Root Index](root-index.md)

One directory per released version, at `wiki/logs/{Major}/{Minor}/{Patch}/`.
Creating a directory here is itself a version claim, so it is gated by
`{shared}/rules/versioning.md` and never done without explicit user approval. A
released version is never rewritten; corrections go in the next version's log.

Any version directory added is reflected here in the same commit, newest first.

| Version | Documents | Covers |
|---|---|---|
| [`3.0.1`](../../wiki/logs/3/0/1/CHANGELOG.md) | `CHANGELOG.md` | Makes https a checked invariant on the GitHub and GitLab clients, closing a silent credential-downgrade path. |
| [`3.0.0`](../../wiki/logs/3/0/0/CHANGELOG.md) | `CHANGELOG.md` | First versioned log directory for the package, recording the agent instruction and documentation scaffold. |
