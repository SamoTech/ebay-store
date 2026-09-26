# Saleh Store Conversion Analytics

## Purpose

This document defines the first-party and GA4 event contract used to measure the shopping funnel from product discovery to an eBay outbound click.

## Primary funnel

`product_view` → `affiliate_outbound_click`

Supporting discovery events include `product_card_click`, `compare_toggle`, `social_share`, and `link_copied`.

## Affiliate outbound event

Event name: `affiliate_outbound_click`

Standard fields:

| Field | Meaning |
|---|---|
| `productId` | Saleh Store product identifier when a product is involved |
| `source` | Logical source component/page |
| `category` | Product category when available |
| `pageType` | Normalized page type, inferred from the current pathname unless explicitly supplied |
| `placement` | Exact CTA/link placement |
| `url` | Destination URL for first-party analytics storage |
| `pathname` | Current Saleh Store pathname |
| `timestamp` | Event timestamp |

GA4 receives the same event name with stable snake_case parameters: `product_id`, `source`, `category`, `page_type`, and `placement`.

## Current placements

- `product_card_link`
- `product_card_cta`
- `primary_cta`
- `secondary_search_cta`
- `deal_of_the_day_cta`
- `compare_cta`
- `autocomplete_result`
- `category_browse_cta`
- `recently_viewed`
- `browse_more_cta`

## Page types

The client normalizes these path families:

- `home`
- `product`
- `category`
- `blog`
- `compare`
- `search`
- `tool`
- `research`
- `other`

## Measurement boundary

The event is sent only when analytics consent is enabled. First-party persistence is best-effort and must never block navigation. GA4 delivery is also best-effort; the outbound link remains the primary user action.

GA4's enhanced measurement can independently record generic outbound `click` events. The custom `affiliate_outbound_click` event exists to provide Saleh Store-specific attribution such as product, source, page type, and placement.

## Success checks

1. Product/detail/category/CTA clicks generate `affiliate_outbound_click`.
2. Events contain a stable `pageType` and `placement`.
3. GA4 receives the custom event when analytics consent is enabled.
4. No tracking failure prevents the eBay navigation.
5. EPN remains the source of truth for actual affiliate clicks, conversions, and commission revenue.
