/**
 * Next.js instrumentation hook — runs once when the server starts.
 *
 * Environment problems are reported here instead of on every request, so
 * /api/health stays the single source of truth for runtime diagnostics.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { validateEnvironment } = await import('./lib/env-validation');
    validateEnvironment();
  }
}
