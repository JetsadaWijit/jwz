# 3.0.2

Released 2026-08-27. Removes the duplication between the GitHub collaborator
operations. No public function, signature, or result shape changed.

## Added

* `src/github/collaborators.js`, holding `runCollaboratorRequests`: the endpoint
  guard, the iteration over repositories and collaborators, and the per collaborator
  result shape, in one place. It is internal machinery. It is not listed in
  `src/github/index.js`, is not reachable through the `exports` map, and is not part
  of the published surface.

## Changed

* `src/github/invite.js` and `src/github/remove.js` are now wrappers that supply only
  the request that differs between them, `axios.put` with an empty body and
  `axios.delete` respectively. Together they went from 42 non blank lines each to 18.
* `headers` is built once per operation rather than once per request. The object is
  not mutated, and the requests issued are unchanged.
* `wiki/information/architecture.md` and `.agents/wiki/context/repository-map.md`
  describe the one file under `src/github/` that is not an operation.
* `.agents/api/api-client-conventions.md` and `.agents/skills/add-api-module.md` state
  when a shared internal helper is allowed and what it must not do.

## Unchanged

* The published surface. `require('jwz/github')` exports the same five functions with
  the same signatures.
* Every observable behaviour, verified by capturing twelve scenarios against a
  recording HTTP stub before and after the change and comparing them byte for byte:
  three configurations, valid, downgraded to `http://`, and with the key removed, by
  two request outcomes, by both operations. The requests issued and the resolved and
  rejected values are identical.
* In particular: a failed request is still recorded against its collaborator and the
  remaining collaborators still run, and a missing or non https endpoint still rejects
  rather than resolving with a failure object.

## Why

Static analysis reported duplicated lines on new code in `invite.js` and `remove.js`.
The lines it named were an import and a guard call that cannot be deduplicated on
their own. The condition underneath was that the two files were about 71% identical
and had been since before that code was added. That is what this release removes.
