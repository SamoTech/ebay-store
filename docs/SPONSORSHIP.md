# Direct Sponsorship

Saleh Store supports direct sponsored placements as a separate system from Google AdSense.

## Contact

- Telegram: @OssamaHashim — https://t.me/OssamaHashim
- Email: ossama.hashim.m@gmail.com

These are the only advertiser contact channels currently exposed by the sponsorship sales page.

## Architecture

- components/SponsorSlot.tsx renders direct sponsor campaigns.
- config/sponsorship.ts stores campaign configuration and contact details.
- config/sponsor-packages.ts defines the sales inventory.
- app/advertise/page.tsx is the public sponsorship sales page.
- AdSenseBlock.tsx remains independent and must not be used as a sponsorship fallback.

There is no database, Supabase dependency, advertiser dashboard, authentication flow, or payment integration in this foundation.

## Campaign lifecycle

A campaign is a static configuration entry with:

- a unique campaign ID
- a supported slot
- active or paused status
- advertiser name and creative
- destination URL
- start and end dates

SponsorSlot only renders an active campaign whose current date falls within its configured campaign window.

## Supported slots

- homepage-top
- homepage-bottom
- category-top
- product-sidebar
- article-middle
- article-bottom

The initial implementation wires the homepage top and bottom slots. Other slots are available to be added to the relevant templates without changing the AdSense system.

## Link policy

Direct sponsor links use rel="sponsored noopener noreferrer".

Do not put eBay affiliate parameters on sponsor destinations. Sponsor campaigns are direct commercial placements and remain separate from EPN affiliate tracking.

## Pricing

Package pricing is currently listed as Custom quote. No market-rate or revenue claim is hardcoded into the application.

## Operational workflow

1. Advertiser contacts Saleh Store through Telegram or email.
2. Confirm campaign, placement, creative, dates, destination URL, and price.
3. Add the approved campaign to config/sponsorship.ts.
4. Verify the campaign window and destination URL.
5. Deploy and verify the affected page.
6. Remove or pause the campaign when the contracted period ends.

Do not add an advertiser to production before the commercial arrangement and creative are confirmed.
