---
name: memory-tasks-claude-md-pointer
description: Record of adding .claude/CLAUDE.md as an import of the root AGENTS.md, so Claude Code reads the same instructions as every other agent.
status: done
---

# Task: Point Claude Code At The Root AGENTS.md

## 2026-08-27

### Task 1 — chore/claude-md-pointer

**Why.** Claude Code reads `CLAUDE.md` and does not read `AGENTS.md`. This
repository's instructions live in the root `AGENTS.md`, so Claude Code was reading
none of them. The documented bridge is a `CLAUDE.md` that imports the other file,
which is what landed.

What landed:

* `.claude/CLAUDE.md`, containing the single import `@../AGENTS.md` and a maintainer
  comment. `./CLAUDE.md` and `./.claude/CLAUDE.md` are both valid project instruction
  locations; the user asked for the second.
* `.npmignore` now excludes `.claude/`. This is not optional here:
  `.agents/wiki/context/repository-map.md` states that a new non runtime directory
  must be added to `.npmignore`, and without it the directory would have shipped in
  the published tarball.

**The import path is `../AGENTS.md`, not `AGENTS.md`.** Claude Code resolves a
relative import against the file that contains it, not against the working directory.
From `.claude/CLAUDE.md`, `@AGENTS.md` would resolve to `.claude/AGENTS.md`, which
does not exist. This was checked against the documentation rather than assumed,
because the failure mode is a file that looks correct and silently imports nothing.

**Nothing was copied.** The file is an import and a comment, so there is no second
copy of the instructions to go stale. That is the same rule the shared set applies to
itself: a local copy overrides the original by name and then drifts.

The maintainer comment is a block level HTML comment, which Claude Code strips before
injecting the file, so it explains the file to a human reader at no cost in context.

No version carrier was touched. This is repository configuration, not shipped code.
