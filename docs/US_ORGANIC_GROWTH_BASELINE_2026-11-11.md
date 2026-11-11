# US Organic Search Growth — Baseline and Execution Gate (2026-11-11)

Tracking: #101. Status: **AUDIT IN PROGRESS — no traffic or keyword-volume claims**.

## Verified repository observations
- Next.js 16, React 19, Vercel, eBay Browse API and eBay Partner Network affiliate links.
- `app/sitemap.xml/route.ts` includes only `blogArticles` with `indexable !== false`, plus selected static pages; product/category URLs are deliberately omitted.
- `app/robots.ts` dynamically defines robots rules and the sitemap. `public/robots.txt` also exists with different user-agent rules: verify which response production actually serves before editing either.
- `lib/seo/metadata.ts` has site-wide metadata, canonical host and Google verification.
- `app/page.tsx` loads the product catalog client-side with a static fallback; inspect rendered Googlebot HTML and crawl paths before changing rendering.
- `docs/ADSENSE_APPROVAL_GATE.md` documents an 11-guide indexable cohort (IDs 31–40, 61), and production verification dated 2026-10-06. This is an internal readiness gate, **not** evidence of external AdSense approval.
- GA4, Vercel Analytics and first-party outbound events exist in code; their existence does not establish actual US organic visits.

## Risks and controls
1. **Conflicting robots sources:** compare deployed /robots.txt with generated route and public asset; do not assume which wins.
2. **Editorial value:** do not reindex legacy/affiliate pages en masse or auto-generate thin articles.
3. **Canonical and sitemap:** keep www host and noindex boundaries aligned.
4. **Conversion:** EPN—not outbound click events—is authoritative for commissions.
5. **Ad platforms:** do not alter ads.txt, AdSense, or MCM enrollment as part of this SEO initiative.

## Research protocol
- Export Search Console Performance (last 3 months, country United States): pages, queries, impressions, clicks, CTR, position. Export Page indexing reasons.
- Export GA4 organic search sessions/engagement filtered to United States; distinguish new sites with zero data from missing access.
- Check live Googlebot rendered HTML, mobile Core Web Vitals, HTTP response, redirects, canonical, robots and sitemap for homepage, blog, representative indexable article, noindex article and product/category.
- Audit the 11 indexable guides for originality, intent, evidence, overlap, affiliate disclosure, and useful decision frameworks.
- Research 4 candidate eBay niches: refurbished laptops, used gaming handhelds, electronics compatibility/replacement parts, used camera lenses. For each, record verified US SERP patterns, buyer problems, eBay inventory, competition, and differentiated editorial angle. No invented search-volume figures.
- Pick ONE niche based on evidence, then draft a pillar and 5–8 tightly linked articles; do not publish until factual/editorial review.

## Acceptance gates
1. Baseline captured with dated source evidence.
2. Proposed changes preserve existing approved noindex/index cohort and editorial quality gate.
3. Small PR with explicit changed-file list and tests: npm ci, lint, typecheck, test, build, crawl smoke checks.
4. Merge and Vercel production verification only after CI passes.
5. Review US organic impressions/clicks, indexed editorial URLs, affiliate outbound events and EPN conversions at 30/60/90 days.

## Handoff
Created as a documentation-only audit checkpoint. No application code, production SEO settings, advertising files or indexing directives changed. Current next action: verify live robots response and collect Search Console baseline, then identify the smallest evidence-backed implementation PR.
