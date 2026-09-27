# AI Agent Operating Guide

This repository is an active production project. Any AI agent working on it MUST treat the repository itself as the source of truth and preserve the project's existing development history.

## Source-of-truth order

When sources disagree, use this order:

1. Current production code on the target branch.
2. Current tests and CI configuration.
3. Git history and merged pull requests.
4. Current project-status documents in `docs/`.
5. Dated historical documents and baselines.
6. Agent assumptions or general knowledge.

Never silently replace repository facts with generic assumptions.

## Before changing anything

1. Read this file.
2. Read `docs/AI_AGENT_SOURCE_OF_TRUTH.md`.
3. Read `docs/PROJECT_STATUS.md`.
4. Read `docs/DEVELOPMENT_HISTORY.md` for historical context relevant to the task.
5. Inspect the actual implementation before proposing a fix.
6. Check the current branch/HEAD and existing work. Do not overwrite unrelated changes.
7. Identify the smallest safe change that solves the requested problem.

## Development gate

Work in this order:

`inspect → diagnose → change → test → review diff → PR → merge → verify production → update documentation`

Do not declare a phase complete because code was written. A phase is complete only after the required validation and deployment checks pass.

For normal application changes, the minimum verification is:

- `npm ci`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`

Use project-specific smoke tests when the affected area has them.

## Production rules

- Production domain: https://www.saleh-store.com
- Repository: https://github.com/SamoTech/ebay-store
- Default branch: `main`
- Deployment platform: Vercel
- Do not claim production deployment succeeded unless the deployment status is actually verified.
- Do not claim an external service is configured/enabled unless its state is verified.
- Do not invent environment variables, ad-slot IDs, API responses, analytics events, search-indexing results, affiliate data, or product facts.

## Project boundaries

Saleh Store is an eBay-only affiliate product-discovery and shopping-research platform.

Do not introduce Amazon affiliate functionality into this repository unless explicitly requested as a deliberate architectural change. Amazon work is a separate project concern.

eBay Partner Network is the source of truth for actual affiliate clicks, conversions, and commissions.

## Legacy preservation rule

Existing legacy files are intentionally retained unless the owner explicitly asks for removal.

Do not delete, rename, or "clean up" legacy code merely because it appears unused. First determine whether it is referenced, historically required, or intentionally preserved.

## Content rules

Shopping content must be factual, practical, and buyer-oriented.

Do not fabricate personal experiences, tests, expert credentials, prices, product specifications, reviews, or marketplace availability.

Affiliate disclosure must remain intact.

## SEO / AI visibility rules

SEO work must preserve:

- canonical URLs
- sitemap/robots consistency
- intended noindex/follow boundaries
- structured data integrity
- crawlable category/product context
- editorial identity
- measurement methodology

AI-search visibility is a measurement objective, not a guaranteed ranking or citation outcome.

## Performance rules

Current performance work is evidence-driven. Do not optimize based on guesses.

The known baseline identified high CLS and mobile LCP concerns. If continuing performance work, measure first and inspect the actual PageSpeed/layout-shift evidence before changing architecture.

## Documentation rule

Every meaningful architectural, SEO, analytics, performance, content, or production change should leave a durable record in the repository.

At minimum, update the relevant status/history document when the change alters the project's current state.

Do not rewrite dated historical baselines to make them appear current. Add a new dated record instead.

## Handoff rule

An agent finishing work must leave enough information for another agent to continue without relying on chat history:

- what changed
- why it changed
- files/areas affected
- tests run
- deployment state
- known limitations
- next safe step
- relevant commit/PR references

The chat is not the project history. Git and repository documentation are.
