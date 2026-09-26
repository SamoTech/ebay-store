# AdSense placement configuration

Saleh Store already loads the publisher-level AdSense code globally from `app/layout.tsx`, which is the required foundation for Auto ads.

This phase adds reusable responsive Display ad blocks to content-rich pages:
- Homepage
- Categories directory
- Category landing pages
- Product pages
- Shopping-guide articles
- Deal comparison tool
- Deal comparison methodology research

The blocks use:
- publisher: `ca-pub-3703596518277340`
- responsive `data-ad-format="auto"`
- `data-full-width-responsive="true"`
- a reserved minimum height to reduce layout shift
- clear `Advertisement` semantics
- no ad placement next to navigation or primary purchase controls

The blocks intentionally do not render until `NEXT_PUBLIC_ADSENSE_DISPLAY_SLOT` is configured. This prevents an invented or invalid ad-slot ID from reaching production.

## Required AdSense account step

In AdSense:
1. Open Ads → By ad unit.
2. Create a Display ad unit.
3. Keep the ad size Responsive.
4. Copy the numeric ad unit ID (`data-ad-slot`).
5. Set that value as `NEXT_PUBLIC_ADSENSE_DISPLAY_SLOT` in the production Vercel environment.
6. Redeploy.

The existing publisher code is already present in the document head, so no second AdSense loader should be added.

## Auto Ads

For Google-controlled placement across the site, enable Auto ads in AdSense for the Saleh Store site. Google can then analyze the page layout and place enabled formats according to the account settings.

Recommended starting configuration:
- Auto ads: ON
- In-page banner ads: ON
- Multiplex: ON where available
- Anchor ads: ON
- Vignette ads: ON, subject to normal UX monitoring
- Ad intents: leave off initially until the core display placements are measured
- Keep adequate minimum distance between ads
- Use page exclusions for utility/search/private-style pages where ads add little value

Do not add ad units directly beside navigation, product CTAs, buttons, or other high-interaction elements.

## Measurement

Review AdSense Reports after deployment. The goal is to measure impressions, viewability, RPM, and revenue without degrading product discovery or affiliate conversion.

EPN remains the source of truth for eBay affiliate clicks, conversions, and commissions.