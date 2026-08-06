# 3.0.0

Released 2026-08-06. First versioned log directory for the package, recording the
agent instruction and documentation scaffold added at the current version.

## Added

* `AGENTS.md` as a routing overview with a reading order, the routing protocol,
  the separation of concerns rule, and the discovery protocol.
* Root `INDEX.md`, a router that lists every index in the repository and the
  condition for loading each one, and never links to leaf content.
* An index in every owned scope: `.agents/INDEX.md`, `wiki/INDEX.md`, and
  `wiki/logs/INDEX.md`, each naming its parent.
* `.agents/creators/index-creator.md`, owning the index template, the split
  threshold, the maintenance rules, and the orphan audit.
* `.agents/git/pull-request-template.md`, defining a human readable pull request
  title, the body sections, and what must never appear in one.
* `.agents/` instruction tree with `INDEX.md` as its sole authority, covering
  directory architecture, versioning, repository rules, branching strategy, commit
  conventions, the standing branch and commit prompt, and the instruction,
  information, changelog, and index creators.
* `.agents/api/api-client-conventions.md` describing the properties file and
  placeholder URL pattern, the result object contract, and the retry shape.
* `.agents/security/secrets-and-tokens.md` covering caller supplied credentials,
  leak prevention in logs and errors, and injected values in URLs.
* `.agents/dependencies/package-policy.md` covering runtime dependency limits,
  lockfile handling, and Dependabot updates.
* `.agents/skills/add-api-module.md`, the procedure for adding a function or
  provider to the published surface.
* `wiki/` documentation tree with an index, a package overview, an architecture
  page, and a local setup page.
* `LICENSE` retained as MIT with the copyright year updated to 2026.

## Removed

* `CLAUDE.md` and `SKILLS.md`. Their content is now covered by `AGENTS.md` and the
  `.agents/` tree.

## Changed

* `README.md` reduced to an overview with a documentation table pointing into
  `wiki/`.
* `.npmignore` now also excludes `.agents/` and `wiki/`, so instruction and
  documentation files stay out of the published tarball.

No runtime source file changed, and the package version is unchanged.
