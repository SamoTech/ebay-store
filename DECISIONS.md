# Saleh Store — CEO/CIO Decision Register

This file records significant strategic decisions governing Saleh Store. It is append-only in spirit: historical decisions must remain recoverable. Corrections should be recorded as new dated decisions rather than silently rewriting history.

## DEC-2026-09-30-001

- **Decision ID:** DEC-2026-09-30-001
- **Date:** 2026-09-30
- **Authority:** CEO/CIO operating-model adoption
- **Context:** Saleh Store already had `AGENTS.md`, a canonical AI source-of-truth document, current-state documentation, project history, and an AI-agent role system. The repository needed an explicit governance model defining strategic authority, COO execution responsibility, escalation, documentation gates, and agent handoff requirements.
- **Decision:** Adopt the repository governance model defined in `AI_CONSTITUTION.md`: Human Owner → AI CEO/CIO → AI COO → Specialized Agents. Treat documentation synchronization as a mandatory completion gate and require significant decisions to be recoverable in this register.
- **Reason:** Ensure a new AI agent can continue repository work without relying on previous chat context and prevent undocumented strategic or operational state.
- **Impact:** Repository governance becomes explicit. Existing source-of-truth and status documents remain authoritative for their respective scopes; this constitution governs authority and operating behavior.
- **Affected Components:** `AGENTS.md`, `AI_CONSTITUTION.md`, `DECISIONS.md`, `docs/PROJECT_STATE.md`, `docs/PROJECT_STATUS.md`, `docs/CHANGELOG_AI.md`
- **Implementation Status:** IN PROGRESS — governance documents created on branch; integration validation pending.
- **Verification:** Documentation content inspected against the repository's existing agent operating model. Automated repository CI has not yet been run for this branch.
- **Related Documents:** `AGENTS.md`, `docs/AI_AGENT_SOURCE_OF_TRUTH.md`, `docs/PROJECT_STATE.md`, `docs/PROJECT_STATUS.md`, `docs/CHANGELOG_AI.md`
