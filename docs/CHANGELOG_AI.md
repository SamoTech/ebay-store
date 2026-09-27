## 2026-09-27 — Fix high-value search intent routing

- Observed that homepage `/search?q=high-value-deals` was being treated as a literal eBay keyword, producing semantically matching non-shopping results such as books about closing high-value deals.
- Updated `app/api/products/search/route.ts` so `high-value-deals` and `high-value-trending` (including space/underscore variants) route to the existing `getHighValueTrendingProducts()` discovery path.
- Ordinary keyword search remains unchanged.
- Added `__tests__/api/products-search.test.ts` covering high-value routing, intent normalization, and ordinary keyword routing.
- Tracked under GitHub Issue #90.
- Deployment verification remains pending until the pull request passes the repository/Vercel deployment gate.

## 2026-09-27 — High-Value Trending discovery

- Added a dedicated eBay Browse discovery path for high-value products across gaming laptops, flagship smartphones, graphics cards, TVs, cameras, drones, robot vacuums, and portable power stations.
- The feed enforces a $500 USD minimum and fixed-price listings, uses eBay Best Match as the relevance signal, and diversifies across query themes without claiming marketplace sales rank.
- Added a homepage merchandising section with a live-only feed and safe loading/empty fallback; the existing catalog and Most Wanted flow remain independent.
- Added regression coverage for the new discovery behavior.
- Tracked under GitHub Issue #87.

## 2026-09-27 — Improve contextual related article selection

Agent: ChatGPT / assigned engineering agent

Objective: strengthen internal topic-cluster linking without changing article content, canonical URLs, or business behavior.

Changed:
- Added `lib/related-blog-posts.ts` with deterministic related-article scoring.
- Updated `app/blog/[slug]/page.tsx` to use the scorer for the existing three related-article links.
- Added `__tests__/lib/related-blog-posts.test.ts` covering contextual ranking, deterministic ties, current-article exclusion, and result limits.

Verification:
- PR #82 CI run #610: merge-conflict check PASS; lint PASS; typecheck PASS; tests PASS; build PASS.
- Vercel preview deployment for commit `85542fd824a6c27ea8c378e3a0233a4e389e5941`: READY.
- PR #82 merged to `main` as `eb2f88ca44bd6de4430a4d9a199e7afd45c74721`.
- Production runtime HTTP verification was not performed.
- No SEO/affiliate/chatbot/analytics routing changes beyond related-article selection.

## 2026-09-27 — Defer below-the-fold Deal of the Day image

Agent: ChatGPT / assigned engineering agent

Objective: Apply the smallest repository-evidenced homepage performance optimization without changing core business behavior.

Investigation:
- Inspected `app/page.tsx` and `components/DealOfTheDay.tsx`.
- The Deal of the Day section appears below the homepage hero, merchandising spotlight, category navigation, and before the main product catalog.
- Its Next Image instance explicitly used `priority`, which requests eager/high-priority image loading for a non-LCP section.

Changed:
- Replaced `priority` with explicit `loading="lazy"` in `components/DealOfTheDay.tsx`.
- Added a regression assertion in `__tests__/components/DealOfTheDay.test.tsx`.

Validation:
- PR #80 CI: merge-conflict check PASS; lint PASS; typecheck PASS; tests PASS; build PASS.
- Vercel preview deployment for commit `b5e688d7374f71bdfc1aa474233cf07ebe2ddddb`: READY.
- PR #80 merged to `main` as `5e72f134f1a6adaef748e945fdceda8046e1304a`.
- Production Vercel deployment for `5e72f134f1a6adaef748e945fdceda8046e1304a`: READY; aliases include `www.saleh-store.com`, `saleh-store.com`, and `ebay-store.vercel.app`.
- Vercel runtime errors for the project in the selected 1-hour verification window: none.
- Direct HTTP verification of `www.saleh-store.com`: not performed by instruction.

Quantitative performance limitation:
- No new PageSpeed/Lighthouse production measurement was performed, so no LCP/CLS/INP/TBT improvement is claimed.
- Issue #79 remains open for a permitted fresh baseline and follow-up measurement.

Commit/PR:
- PR #80, `perf: defer below-fold deal image`, merged.

## 2026-09-27 — Synchronize chatbot model documentation

Agent: ChatGPT / GitHub connector

Objective: Correct documentation drift discovered during the AI-agent operating-system audit without changing runtime behavior.

Investigation:
- Current implementation in `app/api/chat/route.ts` was inspected.
- The chatbot uses Groq as the inference provider with model `openai/gpt-oss-20b`.
- Existing source-of-truth, project-status, and README text still described the assistant generically as Groq-backed without identifying the current model.
- No application, affiliate, SEO, analytics, or deployment configuration changes were required.

Changed:
- Updated `docs/AI_AGENT_SOURCE_OF_TRUTH.md` to identify the current chatbot provider/model.
- Updated `docs/PROJECT_STATUS.md` to match the implementation.
- Updated `README.md` API and stack descriptions.
- No runtime code changed.

Validation:
- Repository branch: `docs/sync-ai-model-state`
- Targeted documentation consistency checks: PASS
- CI, lint, typecheck, tests, build: PASS (GitHub Actions run #581)
- Main branch merge: PASS (`da268bbb06b5fbc2a8224d03d380ef5881525334`)
- Vercel commit status: PASS
- Production deployment: Vercel status PASS; direct deployment inspection unavailable
- Production runtime: NOT VERIFIED because direct HTTP/Vercel runtime access is unavailable

Commit/PR:
- Documentation changes merged via PR #74 into `main`.

Known limitations:
- Direct Vercel deployment inspection is currently unavailable through the connected Vercel authorization.
- GitHub can report Vercel deployment status, but that does not replace direct production runtime verification.

Next agent:
- Continue with production/runtime verification when Vercel authorization permits; do not infer runtime health from deployment status alone.

# AI Development Changelog

This file is the durable chronological trace for AI-agent work. It records verified repository changes and verification limits. It is not a replacement for `CHANGELOG.md` and does not rewrite historical baselines.

## 2026-09-27 — AI operating system audit and state synchronization

Agent: ChatGPT / GitHub connector audit

Task: Establish the requested AI-agent operating protocol and verify the existing repository state before any application change.

Investigation:
- Repository verified: `SamoTech/ebay-store`
- Default branch verified: `main`
- Current HEAD verified: `04c0b5daa817b8c21ba2f83a1e360eea264c2bf1`
- Root `AGENTS.md`, `docs/AI_AGENT_SOURCE_OF_TRUTH.md`, `docs/PROJECT_STATUS.md`, and `docs/DEVELOPMENT_HISTORY.md` inspected.
- Existing role system under `docs/agents/` inspected.
- Current CI workflow inspected.
- Recent merged PR history inspected.
- No open issues were returned for the repository.
- Existing agent documentation was found to pre-date the current project state in places; this audit therefore treats current code/history/status documents as authoritative and avoids rewriting old role-history claims unless required.

Changed:
- Added `docs/PROJECT_STATE.md` as the single current-state handoff document.
- Added `docs/CHANGELOG_AI.md` as the durable AI-agent work log.
- No application/runtime code changed.
- No affiliate, analytics, SEO, AdSense, or production configuration changed.

Validation:
- Repository identity: PASS
- Default branch: PASS
- Current HEAD: PASS
- Existing agent protocol inspected: PASS
- Current source-of-truth/status/history documents inspected: PASS
- CI workflow inspected: PASS
- GitHub commit status for current HEAD: Vercel PASS
- GitHub Actions result for current HEAD: NOT VERIFIED through the available commit-status response
- Local lint: NOT VERIFIED
- Local TypeScript: NOT VERIFIED
- Local tests: NOT VERIFIED
- Local production build: NOT VERIFIED
- Production runtime check: NOT PERFORMED in this documentation-only connector session

Commit/PR:
- Pending the documentation commit created by this session.

Production deployment:
- No production code was changed.
- Current HEAD carries a successful Vercel commit status.

Known limitations:
- This session can modify repository files and inspect GitHub state, but it does not replace an actual local CI/test execution.
- The existing `docs/agents/` files contain some historical wording (for example older test/content counts and dates). They are role/system definitions, not the canonical current-state ledger; current-state claims are maintained in the root/status documents.

Follow-up:
- For the next code task, use the gated workflow in `AGENTS.md` and update `docs/PROJECT_STATE.md` plus this changelog after the work.
