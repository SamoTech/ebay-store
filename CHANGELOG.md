# Changelog

All notable changes to DealsHub are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow [SemVer](https://semver.org/).

## [2.0.0] — 2026-09-19

A "fix and enhance" pass focused on making CI green, fixing the live-product link bug, wiring the
affiliate configuration, and hardening the API surface.

### Added

- **`lib/affiliate.ts`** — single source of truth for eBay Partner Network parameters
  (`mkcid`, `mkrid`, `siteid`, `campid`) with `getCampaignId()`, `createAffiliateUrl()` and
  `createSearchLink()`.
- **`lib/utils/price.ts`** — currency-aware `formatPrice(price, currency)` / `currencySymbol()`;
  prices are no longer rendered as `$` regardless of the listing currency.
- **`proxy.ts`** (Next.js 16 successor to `middleware.ts`) — 60 req/min/IP rate limiting plus CSP,
  HSTS, `X-Content-Type-Options`, `Referrer-Policy` and clickjacking protection.
  Framing restrictions are production-only so preview panes can embed the app.
- **`instrumentation.ts`** — validates environment configuration at boot through
  `lib/env-validation.ts` (call-only, no import side effects).
- **`POST /api/subscribe`** — validated, deduplicated, rate-limited subscriber signup with optional
  Web3Forms forwarding. `GET /api/track` (aggregated analytics) is token-gated in production.
- **`public/robots.txt`** and a real `app/sitemap.xml/route.ts` (static pages, categories, blog and
  indexable products) replacing the placeholder sitemap that marked the whole site `noindex`.
- **New test suites** — `__tests__/lib/affiliate.test.ts`, `__tests__/lib/utils/price.test.ts`,
  `__tests__/lib/server/jsonStore.test.ts`, `__tests__/api/subscribe.test.ts`,
  `__tests__/api/track.test.ts` (20 suites / 251 tests total).
- **README** documentation for scripts, environment variables and the API surface; this changelog.

### Fixed

- **Live products no longer 404.** eBay results are assigned ids from
  `LIVE_PRODUCT_ID_OFFSET` (1000). `ProductCard` and the product page now send live listings
  straight to eBay (new tab, affiliate link, `LIVE` badge) and only route the static catalog
  (`id < 1000`) through `/product/[id]`.
- **Affiliate `customid` is no longer double-encoded** (`%2520` → `%20`) — URLs are built with
  `URLSearchParams`.
- **Campaign id is read from the environment** (`NEXT_PUBLIC_EBAY_CAMPAIGN_ID` →
  `EBAY_CAMPAIGN_ID` → default) instead of being hard-coded in two places; a startup warning
  fires when the default is in use.
- **Lint is runnable again.** Next 16 removed `next lint`, so the script now calls ESLint directly
  with a flat config (`eslint.config.mjs`); all 100 reported problems are resolved.
- **Test environment repaired.** `jest.setup.js` was invalid JavaScript, which broke most suites;
  it is now plain JS with functional `localStorage`, router and `matchMedia` mocks. Remaining
  failures (stale mocks, currency assumptions, env setup) were fixed per suite.
- **Type checking is clean** (`npx tsc --noEmit`), including the sitemap route's import depth.
- **Coverage thresholds are achievable** (CI now enforces a ratchet at the current level instead of
  an unreachable 80%).
- **`npm ci` works again** — `package-lock.json` was regenerated against `package.json`.
- **Static fonts** — `app/layout.tsx` uses the `geist` npm package instead of downloading from
  Google Fonts at build time, so builds no longer depend on network access.
- **Runtime JSON storage never 500s** — `lib/server/jsonStore.ts` falls back to the OS temp
  directory, returns booleans from writes and swallows read errors.
- **Deprecated eBay/debug endpoints** (`/api/ebay-status`, `/api/ebay-test`,
  `/api/debug/ebay-status`, `/api/test/ebay-finding`) now issue host-relative `308` redirects to
  the consolidated `/api/ebay/status` and `/api/health` routes instead of exposing credential
  prefixes, and `lib/env.ts` (which threw on import) was deleted.
- **Sitemap/robots no longer disagree** — robots lists a single, real sitemap; the placeholder
  XML files were removed.
- **Duplicate security headers resolved** — `X-Frame-Options` is defined once per environment.

### Changed

- `npm run lint` → ESLint CLI; new `npm run typecheck` and `npm run verify`
  (`typecheck && lint && test`) scripts; CI now runs lint → typecheck → test → build.
- `components/SearchBar.tsx` — debounced suggestions with proper `search`/`searchbox` roles,
  `aria-label`s and keyboard navigation.
- Rate-limit cleanup timers are `unref()`'d so they never hold a serverless invocation (or a Jest
  run) open.
- Docs updated: `docs/API_DOCUMENTATION.md` (subscribe, analytics, deprecated endpoints) and
  `docs/AFFILIATE_TRACKING.md` (environment configuration and precedence).
