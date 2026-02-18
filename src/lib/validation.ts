export interface ValidationIssue {
  field: string;
  message: string;
}

export interface ValidationErrorResult {
  success: false;
  error: string;
  issues: ValidationIssue[];
}

export interface ValidationSuccessResult<T> {
  success: true;
  data: T;
}

export type ValidationResult<T> = ValidationSuccessResult<T> | ValidationErrorResult;

export interface SearchQuery {
  q: string;
  limit: number;
  offset: number;
}

export interface PriceAlertRequest {
  email: string;
  productId: number;
  targetPrice: number;
}

function error(field: string, message: string): ValidationIssue {
  return { field, message };
}

export function validateSearchQuery(raw: URLSearchParams): ValidationResult<SearchQuery> {
  const q = (raw.get('q') ?? '').trim();
  const limitRaw = raw.get('limit') ?? '20';
  const offsetRaw = raw.get('offset') ?? '0';

  const issues: ValidationIssue[] = [];

  if (!q) issues.push(error('q', 'Query is required'));
  if (q.length > 200) issues.push(error('q', 'Query must be <= 200 chars'));

  const limit = Number.parseInt(limitRaw, 10);
  const offset = Number.parseInt(offsetRaw, 10);

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    issues.push(error('limit', 'limit must be an integer between 1 and 100'));
  }

  if (!Number.isInteger(offset) || offset < 0) {
    issues.push(error('offset', 'offset must be an integer >= 0'));
  }

  if (issues.length > 0) {
    return { success: false, error: 'Validation failed', issues };
  }

  return { success: true, data: { q, limit, offset } };
}

export function validatePriceAlertBody(raw: unknown): ValidationResult<PriceAlertRequest> {
  if (typeof raw !== 'object' || raw === null) {
    return { success: false, error: 'Validation failed', issues: [error('body', 'Body must be an object')] };
  }

  const body = raw as Record<string, unknown>;
  const issues: ValidationIssue[] = [];

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const productId = typeof body.productId === 'number' ? body.productId : Number.NaN;
  const targetPrice = typeof body.targetPrice === 'number' ? body.targetPrice : Number.NaN;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    issues.push(error('email', 'email must be valid'));
  }
  if (!Number.isInteger(productId) || productId <= 0) {
    issues.push(error('productId', 'productId must be a positive integer'));
  }
  if (!Number.isFinite(targetPrice) || targetPrice <= 0) {
    issues.push(error('targetPrice', 'targetPrice must be a positive number'));
  }

  if (issues.length > 0) {
    return { success: false, error: 'Validation failed', issues };
  }

  return { success: true, data: { email, productId, targetPrice } };
}

export function validateCategorySlug(slug: string): ValidationResult<string> {
  if (!/^[a-z0-9-]{1,50}$/.test(slug)) {
    return {
      success: false,
      error: 'Validation failed',
      issues: [error('slug', 'Invalid category slug')],
    };
  }

  return { success: true, data: slug };
}

export function asValidationErrorResponse(result: ValidationErrorResult): { error: string; issues: ValidationIssue[] } {
  return { error: result.error, issues: result.issues };
}
