/**
 * Centralized error handling utilities
 */

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, true);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, true);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(message, 429, true);
  }
}

export class ExternalAPIError extends AppError {
  constructor(message: string, public service: string) {
    super(message, 503, true);
  }
}

/**
 * Log error with appropriate level
 */
export function logError(error: Error | AppError, context?: Record<string, any>) {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    ...context,
  };

  if (error instanceof AppError && !error.isOperational) {
    console.error('🚨 CRITICAL ERROR:', errorInfo);
  } else {
    console.error('❌ Error:', errorInfo);
  }

  // In production, send to error tracking service (Sentry, etc.)
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    // Sentry.captureException(error, { extra: context });
  }
}

/**
 * Safe error message for client
 */
export function getClientErrorMessage(error: Error | AppError): string {
  if (error instanceof AppError && error.isOperational) {
    return error.message;
  }
  
  // Don't expose internal errors to client
  return 'An unexpected error occurred. Please try again later.';
}
