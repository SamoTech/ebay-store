# AdSense Approval Gate

## Objective

Restore saleh-store.com to AdSense review readiness after the Google decision: **Low value content**.

This gate is an operational control, not a promise of approval. Google evaluates the live site and account; repository evidence can establish readiness work but cannot guarantee the external decision.

## External policy baseline

Google's current AdSense guidance requires unique, relevant content that provides users a reason to visit. Google specifically warns that affiliate-program content without sufficient added value can be a content-quality problem. Google also states that publisher content must remain the focal point of pages carrying Google ads.

Authoritative references:
- https://support.google.com/adsense/answer/81904
- https://support.google.com/adsense/answer/12176698
- https://support.google.com/adsense/answer/7299563
- https://support.google.com/publisherpolicies/answer/11112688

## OBSERVE — 2026-10-06

Verified repository state before remediation:
- 62 published shopping guides are documented in current project state.
- Editorial pages contain substantial server-rendered article text and an editorial-team identity.
- The homepage is heavily product/marketplace oriented and contains live eBay discovery, product cards, affiliate CTAs, and commercial merchandising surfaces.
- Blog articles previously contained both AdSense blocks and direct sponsorship slots around the editorial content.
- Older content contains repeated marketplace-buying patterns and some historical first-person/product claims that require editorial review before being treated as authoritative.
- Repository documentation has inconsistent article counts (61 vs 62), which is a documentation-governance defect.

## ASSESS

### Primary risk

The likely approval risk is not lack of page count. It is insufficiently differentiated publisher value relative to the commercial eBay/affiliate layer.

### Secondary risks

1. Commercial surfaces can visually dominate the user journey.
2. Repeated buying-guide templates can make individually useful articles appear programmatic or interchangeable.
3. Historical first-person claims must not imply testing or experience that cannot be evidenced.
4. Product/category/search pages are not equivalent to editorial inventory and should not be treated as the site's primary content proof.
5. Documentation drift makes the content inventory less trustworthy.

## PLAN

The approval loop uses this order:

publisher value → editorial integrity → commercial restraint → crawlability → verification → external review

Do not respond to a low-value decision by simply generating more articles.

### Quality gate for every indexable editorial article

An article should have a clear reason to exist beyond sending the reader to eBay. It should provide original decision support, meaningful comparison logic, useful caveats/trade-offs, and claims that can be supported by the site's stated research method or an identifiable source.

Reject or remediate articles that are primarily:
- generic marketplace advice with little differentiation
- repeated variants of another guide
- product-listing wrappers
- unsupported personal experience
- unsupported expert credentials
- price/availability claims presented as timeless facts
- affiliate CTAs with little editorial substance

## EXECUTE — current increment

### Completed in branch fix/adsense-editorial-value-gate

1. Blog article pages were made content-first by removing direct AdSense blocks and direct sponsorship slots from the article body.
2. The homepage was changed to expose an explicit independent-buyer-research section before the main product merchandising flow.
3. The homepage now links directly to Shopping Guides, the eBay Deal Comparison Methodology research asset, and Editorial Standards.
4. This branch keeps affiliate functionality intact; it changes the hierarchy so research value is visible before commerce conversion.

Commits:
- 3930adae0066920b939c579392e65194ac7dc99d — content-first blog pages
- 01475b419252c47497896a8c2583b97286ad65c6 — editorial-first homepage

## NEXT EXECUTION GATES

### Gate A — content inventory

Audit all 62 articles and assign:

KEEP | REWRITE | MERGE | NOINDEX | REMOVE

Score each article for:
- originality
- information density
- evidence quality
- factual-risk level
- repetition
- commercial intent
- buyer-decision value

### Gate B — article remediation

Rewrite or consolidate the weak cohort. Do not inflate word count merely to satisfy a numeric target.

### Gate C — commercial-surface review

Review product, category, search, homepage, sponsor, and affiliate surfaces. The editorial corpus must remain the site's primary evidence of publisher value.

### Gate D — technical verification

Run:
- conflict verification
- lint
- typecheck
- tests
- production build
- live route smoke tests
- robots/sitemap checks
- canonical/indexability checks

### Gate E — production evidence

Verify the deployed saleh-store.com routes after merge. Do not claim deployment success from a Git commit alone.

### Gate F — AdSense decision

Only after the remediation and live verification gates pass should the site be marked READY_FOR_REVIEW.

READY_FOR_REVIEW means the repository and live-site evidence are internally ready for a new AdSense request. It does not mean Google has approved the site.

## Current decision

REMEDIATION_IN_PROGRESS

The first architectural/content-hierarchy increment is implemented. The site is **not yet declared AdSense-ready** because the 62-article quality inventory and live production verification remain outstanding.

## Agent loop rule

Every future AdSense iteration must record:

OBSERVE → ASSESS → PLAN → EXECUTE → VERIFY → RECORD → DECIDE

No agent may skip VERIFY or convert a repository change into an approval claim.


## Commerce indexation remediation — 2026-10-06

The current remediation also separates thin marketplace surfaces from the site's indexable editorial corpus:

- Product detail pages are now noindex/follow.
- Product detail pages no longer contain AdSense or sponsor slots.
- Dynamic category pages are now noindex/follow.
- Dynamic category pages no longer contain AdSense or sponsor slots.
- Product and category routes are excluded from the XML sitemap.
- Editorial and research/trust routes remain in the sitemap.
- The content writer standard now explicitly prohibits fabricated testing, ownership, credentials, and unsupported performance claims.

### Preview verification

Latest branch tip before this documentation update: 9a1b2302a626debb8a7d708902f02bbe9c7908ac.

The latest Vercel preview deployment for that tip was READY and the GitHub Vercel status was success. HTTP 200 smoke tests passed for the homepage, blog index, editorial team page, sitemap, and robots.txt.

Preview responses expose X-Robots-Tag: noindex at the Vercel preview layer. Production indexability must therefore be verified after deployment; preview noindex must not be interpreted as the application's production robots policy.

Current decision remains REMEDIATION_IN_PROGRESS.
