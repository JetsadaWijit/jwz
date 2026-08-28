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

### Task 2 — refactor/github-collaborators

What landed: `src/github/collaborators.js`, holding `runCollaboratorRequests` — the
endpoint guard, the iteration and the result shape, once. `invite.js` and `remove.js`
each became a wrapper that supplies its own request and nothing else.

Measured effect on the condition that prompted this:

| | `invite.js` non-blank lines | shared with `remove.js` |
|---|---|---|
| Before | 42 | 30 (~71%) |
| After | 18 | 6 (~33%) |

The six that remain are irreducible: `/**`, `*/`, `}`, the two `require` lines, and
the call into the helper. There is no way to make two CommonJS modules that call the
same helper share fewer lines than that.

**Verified by behavioural snapshot rather than by reading.** Twelve scenarios were
captured against a recording `axios` stub before the refactor and replayed after:
three configurations (valid, downgraded to `http://`, key removed) by two request
outcomes (success, failure) by both operations. Every recorded call — verb, resolved
URL, body, headers — and every resolved or rejected value is byte identical across the
two runs. That covers the details easiest to lose in this kind of change:

* `resolveSecureUrl` stays *inside* the `try`, so a resolution failure is still
  recorded against its collaborator instead of rejecting the whole operation;
* a failed request still resolves with `{ collaborator, success: false, error }` for
  that collaborator and continues with the rest;
* a missing or non https endpoint still rejects the returned promise rather than
  resolving with a failure object.

The published surface was checked directly: `require('jwz/github')` exports the same
five functions with the same arities, and the helper is not among them.

`headers` is now built once per operation instead of once per request. The snapshot
shows the serialized headers unchanged on every call, and `axios` does not mutate the
object it is given.

Not done here, and deliberately: `.agents/api/api-client-conventions.md` and
`.agents/skills/add-api-module.md` both say one exported function per file, which the
new helper does not fit. Correcting an instruction is gated by
`{shared}/rules/discovery-protocol.md`, so it is reported as a finding rather than
edited.

### Task 4 — docs/internal-helper-convention

What landed: the finding raised in task 2, once the user selected it.

`.agents/api/api-client-conventions.md` gains a "Shared Internal Helpers" section: when
a non-operation file is allowed, that it is named for what it holds, that it stays out
of the folder's `index.js`, that the guards live in it rather than in the operations,
that it gets no page of its own on the site, and that the extraction has to be proved
behaviour preserving. It also points at `src/gitlab/remove.js` as the right answer when
the variants belong to one operation rather than two, so the two shapes are not
confused.

`.agents/skills/add-api-module.md` points at that rule and adds the timing constraint:
do not create a helper while adding a single operation, extract it when a second one
would otherwise duplicate the first.

Both were previously stale in the same way — each said one exported function per file,
which `collaborators.js` does not fit — so an agent reading either would have treated
the new helper as a violation rather than a deliberate exception.

No file was added, moved or removed, so no index row changed.
