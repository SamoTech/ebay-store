# Saleh Store — Current Project State

Last verified: 2026-09-27
Verification scope: repository state, current branch/HEAD, current documentation, CI configuration, recent Git history, and GitHub commit status.

## Governance state

- Governance model: `AI_CONSTITUTION.md`
- Strategic decision register: `DECISIONS.md`
- COO operational record: `docs/COO_OPERATING_RECORD.md`
- Governance rollout branch: `governance/ceo-coo-operating-model`
- Governance rollout status: IN PROGRESS until CI validation and target-branch synchronization are complete.

## Repository identity

- Repository: `SamoTech/ebay-store`
- Default branch: `main`
- Current HEAD: `04c0b5daa817b8c21ba2f83a1e360eea264c2bf1`
- HEAD message: `docs: establish AI agent source of truth and project history`
- Production target: https://www.saleh-store.com
- Deployment platform: Vercel
- Vercel status for current HEAD: PASS (GitHub commit status context: `Vercel`)
- GitHub Actions status for current HEAD: NOT VERIFIED through the available commit-status response

## Current application baseline

Verified from current repository documentation and source manifest:

- Next.js 16.1.6
- React 19.2.3
- TypeScript
- Tailwind CSS
- eBay Browse API integration
- eBay Partner Network affiliate tracking
- Groq-backed shopping assistant
- Jest + React Testing Library
- GitHub Actions CI
- Vercel deployment

## Current documented product capabilities

- Live eBay product discovery and search
- Shopping guides and editorial content
- Product comparison
- Deal of the Day
- Favorites and recently viewed
- AI shopping assistance
- Affiliate outbound attribution
- SEO sitemap/robots/canonical/structured-data infrastructure
- First-party analytics and GA4 conversion instrumentation

## Content state

The current project documentation records 61 published shopping guides, including the Black Friday field guide as article #61.

## AI agent operating system

The repository already contains:

- `AGENTS.md` as the root operating guide
- `docs/AI_AGENT_SOURCE_OF_TRUTH.md` as the canonical orientation/current-facts document
- `docs/PROJECT_STATUS.md` as the operational status document
- `docs/DEVELOPMENT_HISTORY.md` as the durable milestone history
- `docs/agents/` with role-specific agent definitions and organization rules

This document is the single current-state handoff for agents. It must contain verified current facts rather than historical aspirations.

## Workflow and release gates

The repository's enforced conceptual workflow is:

`READ/INSPECT → AUDIT/DIAGNOSE → PLAN → IMPLEMENT → TEST → REVIEW → DOCUMENT → COMMIT → CI → MERGE → DEPLOY → PRODUCTION VERIFY → UPDATE PROJECT STATE`

The implementation must preserve the stronger repository-specific gates in `AGENTS.md` and `docs/agents/ORGANIZATION.md`.

## CI contract

Current `.github/workflows/ci.yml` runs:

1. `npm ci`
2. `npm run lint`
3. `npm run typecheck`
4. `npm test -- --coverage --ci`
5. `npm run build`

The workflow is authoritative for the commands CI intends to execute. A separate successful commit status or Vercel status must not be treated as proof that all GitHub Actions jobs passed.

## Production safety boundaries

- eBay Partner Network remains the active affiliate system.
- Do not introduce Amazon affiliate functionality without explicit architectural approval.
- Do not invent product data, prices, availability, reviews, specifications, affiliate URLs, analytics results, AdSense account state, or indexing outcomes.
- Preserve legacy files unless explicitly authorized for removal.
- Do not change analytics, AdSense, SEO infrastructure, or affiliate tracking as part of unrelated work.
- Performance changes require measurement before and after when the required measurement source is available.

## Known verification limitations

- The available GitHub commit-status response for HEAD exposes a successful Vercel status but does not expose a completed GitHub Actions result.
- Repository-level file inspection does not prove current external Search Console, EPN revenue, AdSense account configuration, or AI citation outcomes.
- Local lint/typecheck/test/build execution was not performed in this connector-only session.

## Recent audited history

Recent repository work includes chatbot model recovery/live-product integration, chatbot relevance refinements, SEO/indexability work, conversion instrumentation, AdSense foundation, homepage CLS/runtime work, and the September 2026 editorial expansion. Exact behavior must be verified against current code and relevant commits rather than commit titles alone.

## Next-agent handoff

Start from HEAD `04c0b5daa817b8c21ba2f83a1e360eea264c2bf1` on `main`.

Before implementing any new task:

- read `AGENTS.md`
- read `docs/AI_AGENT_SOURCE_OF_TRUTH.md`
- read this file
- read `docs/DEVELOPMENT_HISTORY.md` for task-relevant history
- inspect the actual implementation and tests
- verify whether another agent already solved the requested issue

Do not reopen completed phases without evidence of regression.
