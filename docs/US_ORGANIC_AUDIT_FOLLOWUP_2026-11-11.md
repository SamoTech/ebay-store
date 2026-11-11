# US organic search audit follow-up · November 11, 2026

Continues PR #102 and tracks #101.

- Both the production and Vercel hosts served the rules defined by `app/robots.ts`, including the /api/ exclusion. The conflicting `public/robots.txt` is a maintenance risk. Preserve both until deployment ownership and intended historical rules are confirmed.
- The Vercel sitemap listed 23 production URLs, including the 11 editorial guides. The Vercel hostname also rendered the storefront directly. Inspect Google's selected canonical for both hosts before deciding whether host consolidation is needed.
- Signed-in Search Console confirmed that the production homepage is indexed with the expected Google-selected canonical and that the submitted sitemap was read successfully. The Page indexing report was still processing. Search Console and GA4 did not yet provide enough US organic data to prioritize queries or landing pages.
- The guide directory used repeated generic “Read” anchors. This change links the article headings directly to the same guide URLs, giving readers and crawlers descriptive anchor text. Sitemap, robots, indexability, advertising and analytics code are outside the diff. Production verification follows review and deployment.

## US content opportunities

1. The existing refurbished-electronics guide now includes a US buyer checklist covering warranty eligibility, battery condition, included chargers, return shipping, and delivered cost. The guide links to [eBay’s US warranty terms](https://pages.ebay.com/refurbishedprogramwarranty/). Reassess laptop-specific queries once Search Console has enough data.
2. Test “how to check a used camera lens on eBay” and “used camera lens mount compatibility” against the existing lens guide. A buyer checklist for mount, sensor coverage, haze or fungus and seller photos would answer specific listing questions.
3. Validate these hypotheses with US Search Console query data and a US search-results review before creating additional URLs. Neither opportunity has verified search volume or traffic.
