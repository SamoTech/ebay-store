# Saleh Store visit counter

The footer metric is **Site visits**, not unique visitors.

A qualifying visit is a browser session signal sent by the site's small VisitCounter client component after the page has loaded. The server then applies a 30-minute deduplication window before incrementing the persistent counter.

The server creates a short-lived, random saleh_visit cookie. It never stores that cookie, the visitor's IP address, user agent, or authentication data. Instead, the server creates an HMAC-SHA-256 digest from the short-lived token, a coarse request fingerprint, and the current 30-minute window. Only that digest is stored in Supabase.

This metric is intentionally approximate. Multiple people sharing a browser identity can be grouped, cookie deletion can create a new qualifying window, and privacy tools can prevent tracking. The number must not be presented as unique visitors, people online, or a count of individual humans.

## Storage and concurrency

Supabase PostgreSQL stores:

- one counter row containing the total visit count;
- short-lived HMAC window keys with a unique primary key.

The database function performs the deduplication insert and counter increment in one transaction. The unique key prevents concurrent requests from incrementing the same visitor window more than once.

The cleanup of expired window keys should run hourly through Supabase Cron and retain only a small two-hour working set.

## Security

SUPABASE_SECRET_KEY and VISIT_HASH_SECRET are server-only environment variables. They must never be prefixed with NEXT_PUBLIC_ or committed to Git.

GET /api/visits is read-only and returns only the aggregate count. The incrementing POST /api/visits path requires a same-origin browser request in production and performs server-side deduplication before changing the counter.

The Supabase tables and functions are not granted to anon or authenticated; only the server-side service_role is granted access.

## Required production configuration

Configure these Vercel Production environment variables:

- SUPABASE_URL
- SUPABASE_SECRET_KEY
- VISIT_HASH_SECRET (32+ random characters)

Run supabase/migrations/20260920230000_site_visit_counter.sql against the production Supabase project before enabling the counter.

The cleanup SQL in that migration can be scheduled using Supabase Cron. Supabase documents database functions and least-privilege function grants in its Database Functions and API Security documentation.

## Graceful degradation

If the database is unavailable or the required environment variables are missing, the footer shows Site visits unavailable and the rest of the site continues to function. No fake or cached marketing number is displayed.
