# GA4 Footer Visitor Statistics

Saleh Store uses the existing Google Analytics 4 property for the footer visitor display. No custom visitor database is used.

Required production environment variables:

- GA4_PROPERTY_ID: numeric GA4 Property ID (not the G- Measurement ID).
- GA4_SERVICE_ACCOUNT_JSON: complete Google Cloud service-account JSON, kept server-side.

The service account must be granted access to the GA4 property and the Google Analytics Data API must be enabled in the Google Cloud project.

The footer displays:
- Visitors (30 days): GA4 totalUsers for the last 30 days.
- Online now: GA4 Realtime activeUsers.

The server response is cached for five minutes. If credentials are missing or the API is unavailable, the visitor block remains hidden. The service-account private key is never sent to the browser.
