---
name: memory-tasks-github-collaborator-duplication
description: Record of removing the structural duplication between the GitHub invite and remove operations, raised by a static-analysis duplication finding.
status: in progress
---

# Task: Remove The GitHub Collaborator Duplication

## Why

Static analysis reported 4.0% duplicated lines on new code, with
`src/github/invite.js` and `src/github/remove.js` each at 50%. The two duplicated
lines in each were the `../essential` import and the `requireHttpsUrl` guard added by
the https enforcement work.

That framing is misleading and the measurement is a small-denominator artifact: each
file gained only four lines, so any shared line reads as a large percentage. The
underlying condition is older and larger.

| | `invite.js` non-blank lines | also present in `remove.js` |
|---|---|---|
| Before the https work | 41 | 29 (~71%) |
| After the https work | 42 | 30 (~71%) |

The ratio did not move. The two files are near-clones and were already near-clones.
Outside JSDoc wording and the exported function name, the only functional difference
is the verb:

```js
await axios.put(   url, {}, { headers })   // invite
await axios.delete(url,     { headers })   // remove
```

Neither flagged line can be deduplicated on its own — one is a CommonJS `require`,
which every module needs, and the other names an endpoint key the two files share
because they genuinely call the same endpoint. Making those lines differ would game
the metric and leave the real duplication in place, so the clone is what gets fixed.

The GitLab side already solves this shape: `src/gitlab/remove.js` holds one generic
function with thin `removeFromGroupRepos` and `removeFromPersonalRepos` wrappers. This
applies the same pattern to GitHub, across two files rather than within one, because
`{repo}/.agents/skills/add-api-module.md` requires one operation per file.

## Plan

| # | Title | Scope | Repository | Branch | PR |
|---|---|---|---|---|---|
| 1 | Task record | The plan, written before the work | `jwz` | `chore/github-collaborators-plan` | |
| 2 | Share the collaborator request loop | New internal helper; invite and remove become thin wrappers | `jwz` | `refactor/github-collaborators` | |
| 3 | Re-sync the two collaborator pages | The site quotes both files verbatim | `jwz-website` | `fix/github-collaborators` | |

## Constraints

* **The published surface must not change.** `src/github/index.js` keeps re-exporting
  `inviteCollaboratorsToRepos` and `removeCollaboratorsFromRepos`, with the same
  signatures and the same resolved shapes.
* **Behaviour must not change**, including the rejected promise on a missing or
  non-https endpoint, the per-collaborator `{ collaborator, success, error }` records,
  and the fact that a failed request is captured rather than thrown.
* The helper is internal. It is not added to `index.js` and not documented on the
  website, because it is not part of the published surface.

### Task 1 — chore/github-collaborators-plan

What landed: this record and its `memory-index.md` row, before any of the work.

Left for later: the `PR` column, and the version decision, which is the user's.
