# Saleh Store Development History

This is the durable project-history index for AI agents.

It records major completed milestones, why they happened, and where to inspect the implementation. Git commits remain authoritative for exact diffs.

## 2026-09-19 — Production stabilization baseline

The project received a major fix/enhancement pass covering CI reliability, live eBay product routing, affiliate-link centralization, API hardening, rate limiting, security headers, analytics, sitemap/robots, and test repair.

Primary historical record: `CHANGELOG.md` version 2.0.0.

Important implementation areas introduced or stabilized:

- `lib/affiliate.ts`
- `proxy.ts`
- `instrumentation.ts`
- sitemap/robots
- first-party analytics
- subscriber and price-alert APIs
- eBay live-product routing
- 20 test suites / 251 tests at that stage

## SEO Phase 1 — Crawlability and indexation boundaries

Completed and merged through PRs #47, #49, and #50.

Key outcomes:

- removed unwanted trust-badge content
- unknown category slugs return 404
- search/compare/favorites use noindex/follow where appropriate
- OAI-SearchBot explicitly allowed
- `/api/` remains disallowed
- robots and sitemap behavior aligned

Production commits included `f655d357`, `0806b399`, `d2895f0`.

## SEO Phase 2 — Search architecture

PR #51.

Key outcomes:

- server-rendered category context
- category BreadcrumbList and ItemList structured data
- complete shared category taxonomy in site ItemList
- product structured data separates Saleh Store canonical URL from the eBay offer URL
- product breadcrumb schema

Production commit: `e8c074399b9ca08a7f42712a6ac51165ddc6c269`.

## SEO Phase 3 — Topical authority

PR #52.

Added 20 evergreen shopping guides covering electronics, gaming, phones, smart home, cameras, automotive, office, and marketplace research.

Production commit: `bc5e687627d50413b8033ae5c46227af6e2e5fb3`.

## SEO Phase 4 — AI visibility and entity graph

PR #53.

Added:

- editorial identity at `/about/editorial-team`
- consistent author organization
- BlogPosting author URL
- guide links to categories/products
- repeatable AI visibility query suite

Production commit: `28d934cd39cf80ce6616a1cdf48840408a487701`.

The goal was to improve crawlable context and measurement, not to guarantee AI citations.

## SEO Phase 5 — Linkable research assets

PR #54.

Added:

- `/tools/deal-comparison`
- `/research/ebay-deal-comparison-methodology`
- sitemap entries
- digital PR asset guidance

A build issue caused by an incorrect relative import was fixed before merge.

Production commit: `b59c03d41eab654882f685752da01cc4600b4ac9`.

No fabricated or purchased backlinks were introduced.

## SEO Phase 6 — Measurement baseline

PR #55.

Created the dated SEO/AI visibility baseline:

`docs/SEO_AI_VISIBILITY_BASELINE_2026-09-26.md`

The baseline explicitly distinguishes public search sampling from Search Console indexing evidence.

Production commit: `4337cdf1eb83f30beaaef2ad330dcbb559de4081`.

## SEO Phase 7 — Conversion instrumentation

PR #56.

Standardized `affiliate_outbound_click` attribution across product cards, product CTAs, Deal of the Day, compare, search autocomplete, category CTAs, homepage CTAs, recently viewed, and generic affiliate links.

Added:

`docs/ANALYTICS_CONVERSION_FUNNEL.md`

Final production commit: `911b1fcb7c5daa7a834e9635ca9a8da6acaf3b35`.

## SEO Phase 8 — AdSense foundation

PR #57.

Added reusable `components/AdSenseBlock.tsx` and documented placements.

Important constraint: the component remains inactive until a real numeric `NEXT_PUBLIC_ADSENSE_DISPLAY_SLOT` is configured. No slot ID was fabricated.

Production merge: `1107278f8d34de70ff6c0b6ae955fb50e907e4ef`.

Documentation: `docs/ADSENSE_PLACEMENT.md`.

## Indexability hardening

PR #58.

Added server-rendered featured product links to category pages and removed low-priority legal pages from the sitemap while retaining the pages themselves.

Production merge: `73e77b9ae0396b74257f705ce253828abab8d527`.

## Performance Phase 2 — CLS and client-load work

PR #59:

- deferred chatbot loading
- stabilized homepage Deal of the Day rendering

Production: `6b671995a5364431d2921384cbfd1b9c8053dae4`.

PR #60:

- moved Recently Viewed below the primary product grid
- reserved Deal of the Day layout dimensions
- prioritized the main Deal of the Day image

Production: `9c0f93c8eecb396ff98d96f6de49e4722638d8c3`.

## Production runtime cleanup

PR #61.

Fixed several browser/runtime issues observed in production:

- hydration mismatch caused by a render-time Black Friday countdown
- incorrect manifest icon references
- Unsplash image remote configuration
- CSP connection allowance for Google's ad traffic-quality endpoint

Production merge: `5990e00341cc97d2272136a0717a47929287a6d3`.

## Chatbot recovery and live-product integration

PR #63 replaced the retired Groq model with `openai/gpt-oss-20b` and preserved the existing chatbot contract.

Production merge: `ae35de7978639dcdc089bc70f42dcbfaa48a8c6f`.

PR #64 connected the chatbot to live eBay results and rendered affiliate product cards.

Production merge: `769a226399d256b05643a2a359fb922af7ebf05d`.

## Chatbot relevance refinements

PR #65:

- price-intent query cleanup
- lowest-price ordering for price-oriented queries
- suppression of duplicated product lists in the AI text

Production merge: `1650e941e6c929c2015508e1d7df495560640401`.

PR #66:

- iPhone generation extraction
- competing-generation filtering
- exact-model detection
- prohibition on unsolicited alternative-model recommendations

Production merge: `96525040a94b4c0348b9f6f5567f4ccec737cd44`.

## Editorial expansion — 20 humanized guides

PR #68.

Added 20 buyer-focused guides, articles #41–#60, across:

- laptops
- gaming monitors
- used iPhones and storage
- USB-C chargers and power banks
- mechanical keyboards and headsets
- SSD/storage
- Wi-Fi routers and smart doorbells
- dash-cam memory cards
- car mounts, OBD2 scanners, and interior accessories
- used cameras and lens compatibility
- eBay deal evaluation and purchase checklists

Production merge: `81d0869e559db26181ff73d4ef9e9e66b5757ccb`.

Validation passed: lint, typecheck, tests, build. Vercel production deployment was verified successful.

## Post-expansion editorial work

The repository subsequently added a Black Friday field guide as article #61 and article-specific multi-category resources.

Commit: `955e34f7c3385abad236f215b023ddb8e296bcac`.

A later documentation synchronization commit recorded the current state and expanded AI-visibility coverage:

`fe05c134c244a2e5c5863f10d571ffb38c3a8556`.

## Historical interpretation rules

- A dated baseline describes what was known at that time; it is not automatically current.
- A commit proves that a change was recorded, not that every external dependency remained unchanged afterward.
- A production deployment must be verified separately from a Git merge.
- Search visibility, AI citation, AdSense account settings, and EPN revenue are external states and cannot be inferred from source code alone.
- When uncertain, inspect the current implementation and the latest relevant commit before changing anything.

## Direct sponsorship foundation — 2026-09-29

Added an isolated direct-sponsorship foundation:

- config/sponsorship.ts — campaign lifecycle and advertiser contact configuration
- config/sponsor-packages.ts — sponsorship inventory
- components/SponsorSlot.tsx — direct sponsor renderer
- app/advertise/page.tsx — public sales page
- docs/SPONSORSHIP.md — operational documentation
- homepage top and bottom sponsor slots
- footer and sitemap links to /advertise

The implementation deliberately does not connect sponsorships to AdSense, Supabase, a database, authentication, or payments. Sponsor links use rel="sponsored noopener noreferrer".

Validation and production deployment verification remain pending for this change.
