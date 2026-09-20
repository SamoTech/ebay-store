import { NextRequest, NextResponse } from 'next/server';
import { createAnonymousToken, createVisitWindowKey, getSiteVisitCount, recordSiteVisit } from '../../../lib/visits';
import { SITE_URL } from '../../../lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VISITOR_COOKIE = 'saleh_visit';
const VISITOR_COOKIE_MAX_AGE = 30 * 60;

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  return request.headers.get('x-real-ip') || 'unknown';
}

function isSameOrigin(request: NextRequest): boolean {
  if (process.env.NODE_ENV !== 'production') return true;
  const origin = request.headers.get('origin');
  if (origin) return origin === SITE_URL;
  return request.headers.get('sec-fetch-site') === 'same-origin';
}

function requestFingerprint(request: NextRequest): string {
  const ip = getClientIp(request);
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const language = request.headers.get('accept-language') || 'unknown';
  return `${ip}|ua:${userAgent.slice(0, 256)}|lang:${language.slice(0, 128)}`;
}

export async function GET() {
  const count = await getSiteVisitCount();
  if (count === null) {
    return NextResponse.json({ ok: false, count: null }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
  return NextResponse.json({ ok: true, count }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 });
  }

  const contentType = request.headers.get('content-type') || '';
  if (!contentType.toLowerCase().startsWith('application/json')) {
    return NextResponse.json({ ok: false, error: 'Unsupported content type' }, { status: 415 });
  }

  try {
    const payload = (await request.json()) as unknown;
    if (!payload || typeof payload !== 'object' || Array.isArray(payload) || Object.keys(payload).length > 0) {
      return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const secret = process.env.VISIT_HASH_SECRET;
  if (!secret || secret.length < 32) {
    return NextResponse.json({ ok: false, error: 'Visit counter is not configured' }, { status: 503 });
  }

  const existingToken = request.cookies.get(VISITOR_COOKIE)?.value;
  const anonymousToken = existingToken || createAnonymousToken();
  const windowKey = createVisitWindowKey(anonymousToken, requestFingerprint(request), secret);
  const count = await recordSiteVisit(windowKey);

  if (count === null) {
    return NextResponse.json({ ok: false, count: null }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }

  const response = NextResponse.json({ ok: true, count }, { headers: { 'Cache-Control': 'no-store' } });

  if (!existingToken) {
    response.cookies.set({
      name: VISITOR_COOKIE,
      value: anonymousToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: VISITOR_COOKIE_MAX_AGE,
    });
  }

  return response;
}
