#!/usr/bin/env node

const baseUrl = process.env.API_BASE_URL || 'http://127.0.0.1:3000';

async function request(path, options = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { 'content-type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }

  return { status: res.status, ok: res.ok, json };
}

function assertCondition(condition, message) {
  if (!condition) throw new Error(message);
}

async function run() {
  const checks = [];

  const ebayStatus = await request('/api/ebay/status');
  assertCondition(ebayStatus.ok, '/api/ebay/status should return 200');
  assertCondition(ebayStatus.json?.integration?.mode, '/api/ebay/status missing integration.mode');
  checks.push(`ebay/status mode=${ebayStatus.json.integration.mode}`);

  const discover = await request('/api/products/discover');
  assertCondition(discover.ok, '/api/products/discover should return 200');
  assertCondition(['ebay_live', 'fallback_static'].includes(discover.json?.source), '/api/products/discover source invalid');
  assertCondition(Array.isArray(discover.json?.products), '/api/products/discover products should be array');
  checks.push(`products/discover source=${discover.json.source} products=${discover.json.products.length}`);

  const searchNoQ = await request('/api/products/search');
  assertCondition(searchNoQ.status === 400, '/api/products/search without q should return 400');
  checks.push('products/search validation=ok');

  const searchQ = await request('/api/products/search?q=laptop');
  assertCondition([200, 500].includes(searchQ.status), '/api/products/search with q should return 200 or 500');
  if (searchQ.status === 200) {
    assertCondition(Array.isArray(searchQ.json?.products), '/api/products/search should return products[]');
  }
  checks.push(`products/search status=${searchQ.status}`);

  const email = `api-check-${Date.now()}@example.com`;

  const subscribe = await request('/api/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email, source: 'api-smoke-test' }),
  });
  assertCondition(subscribe.ok, '/api/subscribe should return 200 for valid payload');
  assertCondition(subscribe.json?.ok === true, '/api/subscribe missing ok=true');
  checks.push('subscribe=ok');

  const alertOn = await request('/api/alerts', {
    method: 'POST',
    body: JSON.stringify({ email, productId: 1, enabled: true }),
  });
  assertCondition(alertOn.ok, '/api/alerts should return 200 for valid payload');
  checks.push('alerts enable=ok');

  const track = await request('/api/track', {
    method: 'POST',
    body: JSON.stringify({ event: 'api_test_event', source: 'api-smoke-test' }),
  });
  assertCondition(track.ok, '/api/track POST should return 200');

  const trackRead = await request('/api/track');
  assertCondition(trackRead.ok, '/api/track GET should return 200');
  assertCondition(typeof trackRead.json?.totalEvents === 'number', '/api/track GET missing totalEvents');
  checks.push(`track totalEvents=${trackRead.json.totalEvents}`);

  console.log('API verification PASSED');
  for (const line of checks) console.log(`- ${line}`);
}

run().catch((error) => {
  console.error('API verification FAILED');
  console.error(error.message);
  process.exit(1);
});
