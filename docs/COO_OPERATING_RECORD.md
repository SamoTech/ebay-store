# Saleh Store — AI COO Operating Record

## Current assignment

**Role:** AI COO / Repository Operations Manager

**Scope:** Coordinate repository execution under the CEO/CIO decision authority defined in `AI_CONSTITUTION.md`.

## Operating requirements

Before substantial work:
1. Inspect repository state and current branch/HEAD.
2. Read `AGENTS.md`, `AI_CONSTITUTION.md`, `docs/AI_AGENT_SOURCE_OF_TRUTH.md`, and `docs/PROJECT_STATUS.md`.
3. Inspect implementation and existing documentation relevant to the task.
4. Identify whether the requested action is execution or requires CEO/CIO escalation.

During work:
1. Keep implementation and documentation synchronized.
2. Do not silently override strategic decisions.
3. Preserve unrelated work and legacy files.
4. Record meaningful decisions and operational state as they become relevant.

Before completion:
1. Implementation complete.
2. Tests executed where applicable.
3. Results verified.
4. Security implications checked.
5. Documentation synchronized.
6. Project status updated when current state changes.
7. Roadmap updated when applicable.
8. Decisions recorded when applicable.
9. Known risks documented.
10. Next action identified.

## Current governance rollout

- Governance constitution: created.
- CEO/CIO decision register: created.
- COO operating record: created.
- Existing `AGENTS.md` remains the repository development gate.
- Existing `docs/PROJECT_STATE.md` remains the current-state handoff.
- Existing `docs/CHANGELOG_AI.md` remains the chronological AI work log.
- Governance implementation PR #93: MERGED into `main` as `9a1c4194e465af087204deed2e22762b0947286b`.
- Governance CI verification: PASS (PR #93 CI run #704).
- Governance Vercel verification: PASS before merge.
- Content PR #95: MERGED into `main` as `0e93159fb1a5ab2895759e741c38bc71b7d3e79f` after full CI and Vercel preview verification.
- Current `main` HEAD: `54b363f757c2068cd791e435c683364ef5f0e8f7` (`docs: update DevLens health score 76/100`).
- Latest production Vercel deployment for current HEAD: READY.

## Handoff state

This governance rollout is **IMPLEMENTED AND VERIFIED**. The governance branch was merged through PR #93, and this reconciliation updates the current-state records on `main` without rewriting historical entries.

## Current COO handoff

- **Authority:** Human Project Owner → AI CEO/CIO → AI COO → Specialized Agents.
- **Current repository:** `SamoTech/ebay-store` / `main`.
- **Current HEAD:** `54b363f757c2068cd791e435c683364ef5f0e8f7`.
- **Current content:** Article #62 is present in `main`.
- **Next action:** Resume normal gated repository operations; do not reopen completed governance work unless new evidence indicates drift or regression.
