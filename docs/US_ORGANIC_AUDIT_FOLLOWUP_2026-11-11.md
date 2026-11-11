# US organic search audit follow-up · November 11, 2026

Continues PR #102 and tracks #101.

- Both the production and Vercel hosts served the rules defined by `app/robots.ts`, including the /api/ exclusion. The conflicting `public/robots.txt` is a maintenance risk. Preserve both until deployment ownership and intended historical rules are confirmed.
- The Vercel sitemap listed 23 production URLs, including the 11 editorial guides. The Vercel hostname also rendered the storefront directly. Inspect Google's selected canonical for both hosts before deciding whether host consolidation is needed.
- Search Console and GA4 required Google sign-in in the available browser. US impressions, clicks, indexing reasons, and organic sessions remain unverified. Collect 90 days of US query and page data in Search Console and compare it with US Organic Search sessions and landing pages in GA4.
- The guide directory used repeated generic “Read” anchors. This change links the article headings directly to the same guide URLs, giving readers and crawlers descriptive anchor text. Sitemap, robots, indexability, advertising and analytics code are outside the diff. Production verification follows review and deployment.

## US content opportunities

1. Start with the existing laptop guide. Test search intents such as “eBay refurbished laptop warranty” and “used vs refurbished Dell Latitude.” Add a listing comparison checklist for model number, battery condition, charger, warranty and return shipping. Reference [eBay's US refurbished program](https://pages.ebay.com/refurbished/) and [its warranty tiers](https://pages.ebay.com/refurbishedprogramwarranty/index.html).
2. Test “how to check a used camera lens on eBay” and “used camera lens mount compatibility” against the existing lens guide. A buyer checklist for mount, sensor coverage, haze or fungus and seller photos would answer specific listing questions.
3. Validate these hypotheses with US Search Console query data and a US search-results review before creating additional URLs. Neither opportunity has verified search volume or traffic.
