# Saleh Store Project Status

Last verified: 2026-09-27

## Current baseline

The repository is on the `main` line with the September 2026 documentation/content work integrated.

Current documented product state:

- 61 published shopping guides
- Black Friday field guide is article #61
- article-specific multi-category resources are supported
- 268 tests are the documented verification baseline
- production target: https://www.saleh-store.com

## Production-critical systems

| Area | Current state | Source |
|---|---|---|
| eBay discovery | Live Browse API with fallback catalog | `lib/ebay-api.ts`, API routes |
| Affiliate links | Centralized EPN builder | `lib/affiliate.ts` |
| AI chatbot | Groq-hosted `openai/gpt-oss-20b` + live eBay results | `app/api/chat/route.ts`, `components/Chatbot.tsx` |
| SEO | Sitemap, robots, canonicals, structured data | `app/robots.ts`, sitemap route, SEO helpers |
| Analytics | First-party + GA4 affiliate funnel | `docs/ANALYTICS_CONVERSION_FUNNEL.md` |
| AdSense | Global publisher + optional manual blocks | `docs/ADSENSE_PLACEMENT.md` |
| Content | 61 published guides | README / editorial status |
| CI | merge-conflict check → lint → typecheck → tests → build | GitHub Actions / README |
| Deployment | Vercel | GitHub/Vercel integration |

## Merchandising discovery — 2026-09-27

Added a separate High-Value Trending homepage feed using eBay Browse API Best Match across multiple high-intent shopping themes. The feed requires a minimum USD price of $500 and fixed-price listings, preserves eBay ordering within each query, and fails closed without Browse API access. It is independent from the primary catalog and Most Wanted feed.

### Known completed work

### SEO / discoverability

Completed phases established crawlability boundaries, search architecture, topical authority, AI visibility context, linkable research assets, and a dated measurement baseline.

Key documents:

- `docs/SEO_AI_VISIBILITY_BASELINE_2026-09-26.md`
- `docs/AI_VISIBILITY_TESTS.md`
- `docs/DIGITAL_PR_ASSETS.md`

### Conversion instrumentation

The affiliate funnel was standardized around `affiliate_outbound_click`.

See `docs/ANALYTICS_CONVERSION_FUNNEL.md`.

### AdSense foundation

Sitewide publisher code and reusable responsive blocks were implemented without inventing an ad-slot ID.

See `docs/ADSENSE_PLACEMENT.md`.

### Performance

Homepage CLS/runtime work included deferring the chatbot, stabilizing Deal of the Day layout, moving Recently Viewed lower in the page, and fixing production hydration/icon/image/CSP issues.
On 2026-09-27, the Deal of the Day image was changed from Next Image `priority` to explicit `loading="lazy"` because the section is below the homepage hero and catalog/category content. This is a targeted resource-loading optimization; its quantitative impact is not claimed until a fresh PageSpeed measurement is available.

Performance work is not considered finished merely because these code changes shipped. New PageSpeed measurements are required to quantify the remaining LCP/CLS/JS issues.

### Chatbot relevance

The chatbot evolved from a Groq-only text assistant into a live eBay product assistant. The current implementation uses Groq as the inference provider with the `openai/gpt-oss-20b` model. Product intent, price sorting, duplicate-list suppression, and competing iPhone-generation filtering were subsequently added.

## CI hardening — 2026-09-27

The main CI workflow now runs the existing `npm run verify:conflicts` check immediately after dependency installation, before lint/typecheck/tests/build.

This gate is intentionally narrow: it detects unresolved merge-conflict markers without changing application runtime behavior.

### Internal linking — 2026-09-27

The blog article page now ranks its three related articles using a deterministic contextual score based on category alignment and shared title/excerpt terms, with original content order as the final tie-breaker. Article URLs and the existing related-article UI are unchanged.

## Known limitations

- Search-engine indexing and AI citation are external outcomes and cannot be guaranteed by code changes.
- AdSense account-level settings cannot be inferred from repository code.
- EPN conversion/revenue cannot be inferred from outbound-link events alone.
- PageSpeed scores vary by run; use fresh measurements for performance decisions.
- Vercel connector access may be unavailable even when GitHub deployment status is visible. Do not manufacture deployment details.

## Current safe next areas

These are areas for future work, not claims that they must all be done immediately:

1. Build stronger internal topic-cluster links across the 61-guide library.
2. Improve older articles to match the newer humanized editorial standard.
3. Re-measure PageSpeed and continue homepage client-JS/hydration optimization based on evidence.
4. Expand AI-visibility measurements using the existing test methodology.
5. Continue conversion optimization only when backed by analytics evidence.

## Operational rule

When a future agent completes one of these areas, update this document and the development history with:

- date
- exact change
- affected files
- tests
- PR/commit
- deployment verification
- remaining limitation
