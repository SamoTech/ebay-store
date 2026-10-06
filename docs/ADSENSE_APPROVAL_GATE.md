# AdSense Approval Gate

## Objective

Restore saleh-store.com to AdSense review readiness after Google's **Low value content** decision.

This document is an internal acceptance gate, not a promise of Google approval. AdSense evaluates the live site and account.

## External baseline

Google's AdSense readiness guidance emphasizes unique, useful content, good user experience and navigation, a live/crawlable site, and policy compliance. Affiliate-oriented sites need meaningful added value rather than pages whose primary purpose is simply sending visitors to another site.

Authoritative references:
- https://support.google.com/adsense/answer/7299563
- https://support.google.com/adsense/answer/12176698
- https://support.google.com/adsense/answer/81904
- https://support.google.com/publisherpolicies/answer/11112688

## OBSERVE — 2026-10-06

Repository inventory:
- 62 article records total: legacy IDs 1–30 and expanded IDs 31–62.
- The site currently exposes a controlled 11-article editorial cohort for indexing.
- Product detail and dynamic category pages are noindex/follow.
- Personalized comparison and favorites utilities are noindex/follow.
- The direct sponsorship sales page is noindex/follow.
- Editorial article bodies no longer contain direct AdSense or sponsor placements.
- Homepage merchandising is preceded by buyer-research content.
- `public/ads.txt` contains the current AdSense publisher entry.

## ASSESS

Primary risk: insufficient differentiated publisher value relative to the commercial eBay/affiliate layer.

Secondary risks:
- repeated marketplace templates
- unsupported first-person testing or credential claims
- thin commerce/query surfaces being mistaken for editorial content
- stale or duplicated SEO metadata
- documentation drift

## PLAN

publisher value → editorial integrity → commercial restraint → crawlability → CI → preview verification → production verification → external review

Do not solve a low-value decision by mass-generating generic articles.

### Indexable article quality gate

Every indexable guide must:
- solve a real buyer decision
- contain category-specific reasoning or comparison logic
- explain trade-offs, caveats, or failure modes
- remain useful without clicking an affiliate link
- avoid unsupported claims and fabricated personal experience
- avoid timeless price/availability claims
- keep affiliate recommendations secondary

### Humanization gate

All future public editorial content must remove obvious AI fingerprints:
- no formulaic “ultimate/comprehensive guide” framing
- no repetitive structure copied across unrelated topics
- no keyword stuffing
- no filler added to hit a word count
- no fabricated first-hand testing, ownership, credentials, or stories
- use concrete observations, trade-offs, limitations, and decision rules
- vary paragraph rhythm and article structure naturally

Humanization must never invent first-hand experience.

## EXECUTE — current increment

Completed:
1. Removed AdSense and direct sponsorship blocks from editorial article pages.
2. Removed homepage sponsor placements and direct sponsorship promotion from the global footer.
3. Put buyer research and the editorial library before marketplace merchandising on the homepage.
4. Restricted blog listing and related-post discovery to the indexable editorial cohort.
5. Quarantined legacy and repetitive cohorts with noindex.
6. Added topic-specific supplements to promoted guides.
7. Removed the nonstandard `ai-content` metadata marker from global/generated metadata.
8. Added noindex/follow boundaries for product, category, compare, favorites, and sponsorship surfaces.
9. Added regression tests for editorial corpus, duplicate slugs, fabricated first-person claims, and commercial restraint.
10. Corrected duplicated metadata titles.
11. Added privacy, cookies, terms, and disclosure pages to the sitemap.
12. Corrected contact/about/FAQ content to remove unsupported promises and placeholders.
13. Kept `public/ads.txt` present and unchanged.

### Current approved indexable cohort

**31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 61**

IDs 1–30, 41–60, and 62 remain noindex.

Article 62 remains noindex because the AI-agent marketplace topic is outside the primary Saleh Store shopping/editorial purpose.

## VERIFY

### CI evidence

Verified GitHub Actions run for branch head `3916d339251463bbf572a0064c77759b82555b74`:
- conflict-marker check: PASS
- lint: PASS
- type check: PASS
- tests: PASS
- build: PASS

### Preview evidence

Verified Vercel preview:
- deployment: `dpl_4MTqa75W13gGwSzgZEhUrKFHKEA4`
- state: READY
- branch: `fix/adsense-editorial-value-gate`
- commit: `3916d339251463bbf572a0064c77759b82555b74`
- Vercel GitHub status: success

Smoke-tested preview routes returned HTTP 200, including:
- `/`
- `/blog`
- selected indexable guides
- quarantined commerce routes
- `/sitemap.xml`
- `/robots.txt`
- trust/legal/contact pages

The preview HTML verified:
- approved guides: `index, follow`
- quarantined commerce/utility pages: `noindex, follow`
- canonical URLs use `https://www.saleh-store.com`
- `ai-content` metadata is absent
- editorial pages contain no `AdSenseBlock` or `SponsorSlot`

The live preview sitemap contains the homepage, editorial/trust resources, and the 11 approved article URLs; product/category/sponsorship utility routes are excluded.

## PRODUCTION GATE

Production has not yet been verified for this increment because the remediation branch is not merged to `main`.

## DECISION

**REMEDIATION_IN_PROGRESS — CI/PREVIEW PASS**

The remediation increment has passed repository and preview gates. Merge is allowed only after the final branch-head verification remains green. After merge, production routes and canonical redirects must be independently verified before declaring `READY_FOR_REVIEW`.

No AdSense review request should be submitted until the production gate passes.

## Agent loop

Every future AdSense iteration must record:

OBSERVE → ASSESS → PLAN → EXECUTE → VERIFY → RECORD → DECIDE

Never convert a repository change into an approval claim.
