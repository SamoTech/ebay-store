# AI Agent Source of Truth

Last verified: 2026-09-27

## Purpose

This document is the canonical orientation document for AI agents working on Saleh Store.

The project is developed iteratively by humans and AI agents. The objective is to make repository state, architectural decisions, historical changes, validation gates, and known limitations recoverable without access to previous chat sessions.

For historical details, see `docs/DEVELOPMENT_HISTORY.md`.
For the current operational state, see `docs/PROJECT_STATUS.md`.
For agent behavior and change gates, see root `AGENTS.md`.

## Identity

- Project: Saleh Store
- Repository: `SamoTech/ebay-store`
- Production: https://www.saleh-store.com
- Default branch: `main`
- Deployment: Vercel
- Stack: Next.js 16.1.6, React 19.2.3, TypeScript, Tailwind CSS
- Marketplace: eBay
- Affiliate network: eBay Partner Network
- AI assistant: Groq-backed shopping assistant
- Testing: Jest + React Testing Library
- CI: GitHub Actions

## Product purpose

Saleh Store is an eBay product-discovery and shopping-research platform. Its main functions include:

- live eBay product discovery
- product/category search
- shopping guides
- deal comparison and methodology resources
- product comparison
- Deal of the Day
- favorites/recently viewed experiences
- AI shopping assistance
- eBay affiliate tracking
- first-party and GA4 conversion measurement
- SEO and AI-search discoverability

This is not a generic marketplace and does not own the underlying eBay inventory.

## Current content state

The current repository documentation reports 61 published shopping guides, including the Black Friday field guide as article #61.

The September 2026 editorial expansion added 20 humanized buyer-focused guides across electronics, gaming, phones, networking, smart home, automotive, cameras, and shopping strategy.

Article-specific category resources were added so a guide can expose multiple relevant eBay categories and live product resources where appropriate.

## Current technical state

### SEO

The production site has:

- `/sitemap.xml`
- `/robots.txt`
- explicit OAI-SearchBot allowance
- intended noindex/follow boundaries for search, compare, and favorites
- shared category taxonomy validation
- canonical Product and Breadcrumb structured data
- category ItemList and contextual structured data
- editorial identity at `/about/editorial-team`
- public deal-comparison and methodology resources

Do not treat search-engine result sampling as proof of indexing. Use dated measurements and Search Console when available.

### Analytics

The primary affiliate conversion event is:

`affiliate_outbound_click`

It carries stable product/source/category/page-type/placement attribution. GA4 uses snake_case parameter names.

EPN remains the source of truth for actual affiliate outcomes.

Do not reopen or redesign the analytics funnel unless the task specifically concerns analytics.

### AdSense

The global publisher code exists. Reusable responsive ad blocks exist.

Manual ad blocks intentionally remain inactive until a real numeric `NEXT_PUBLIC_ADSENSE_DISPLAY_SLOT` is configured.

Never invent an ad-slot ID.

### Chatbot

The chatbot uses Groq and live eBay product search.

The current product-search flow:

`user query → intent detection → eBay search → relevance/price filtering → live product context → Groq response → affiliate product cards`

Important behavior already implemented:

- price-oriented queries can sort results by price
- AI response should not duplicate the product-card list
- exact iPhone generation filtering prevents competing generations from being mixed into the requested result set
- the assistant must not recommend a different model unless the user asks for alternatives
- product cards use the live eBay affiliate link

If changing chatbot behavior, inspect `app/api/chat/route.ts`, `components/Chatbot.tsx`, `lib/ebay-api.ts`, and `lib/affiliate.ts` together.

### Performance

Previous PageSpeed measurements identified:

- mobile LCP around 5s
- severe CLS
- unused JavaScript around 169–170 KiB
- render/network dependency issues
- long tasks

Several CLS/runtime fixes were already shipped. The next meaningful performance work should be measurement-driven, with special attention to the large client-side homepage and hydration cost.

Do not assume a performance fix worked without re-measuring.

## Architectural rules

### Affiliate links

Use `lib/affiliate.ts` as the central eBay affiliate-link implementation. Do not create competing tracking parameter builders.

### Live products

Live eBay products and the static catalog have different routing behavior. Preserve the existing distinction rather than assuming every product should have a local product page.

### API compatibility

Deprecated eBay/debug API routes intentionally redirect to consolidated routes. Preserve these compatibility paths unless explicitly instructed otherwise.

### Legacy code

Legacy files are retained intentionally. Do not remove them as cleanup.

## Environment / secrets

Never commit secrets.

Known environment concerns include eBay API credentials, eBay campaign configuration, Groq API key, optional Web3Forms, analytics read token, and optional GA/AdSense configuration.

Use `.env.example` and existing setup documentation as the contract. Never paste secret values into documentation, issues, commits, or agent output.

## Validation contract

A normal production change is not complete until:

1. implementation is inspected
2. targeted tests pass
3. lint passes
4. typecheck passes
5. full test suite passes
6. production build passes
7. PR is merged
8. production deployment is verified when applicable
9. current-state documentation is updated when the change materially changes the project

## Historical truth

Git commits and merged PRs are authoritative for what actually changed.

Important recent milestones are indexed in `docs/DEVELOPMENT_HISTORY.md`. Do not infer implementation details from a commit title alone; inspect the commit/diff when exact behavior matters.

## What not to do

- Do not invent production state.
- Do not fabricate SEO/indexing results.
- Do not claim AdSense Auto Ads are enabled without account-level verification.
- Do not add Amazon affiliate code to Saleh Store by assumption.
- Do not delete legacy files because they look old.
- Do not replace dated baselines with current values.
- Do not make broad refactors when a narrow fix is sufficient.
- Do not declare success before tests/deployment checks are complete.

## Handoff

At the end of every substantial task, record the resulting state in Git and leave a concise handoff in the relevant documentation.

The next agent should be able to answer three questions immediately:

1. What is true now?
2. Why is it true?
3. What is the safest next change?
