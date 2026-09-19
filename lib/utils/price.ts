/**
 * Price formatting helpers.
 *
 * eBay returns prices in the listing's own currency (USD, EUR, GBP, AUD, …),
 * so the original currency must be preserved instead of assuming dollars.
 */

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'C$',
  AUD: 'A$',
  AED: 'AED ',
  SAR: 'SAR ',
  EGP: 'EGP ',
  JPY: '¥',
  INR: '₹',
};

/** Symbol for a currency code, falling back to the code itself. */
export function currencySymbol(currency?: string): string {
  const code = (currency || 'USD').toUpperCase();
  return CURRENCY_SYMBOLS[code] ?? `${code} `;
}

/**
 * Format a price with its own currency symbol.
 *
 * @example
 * formatPrice(1999)            // "$1999.00"
 * formatPrice(149.5, 'GBP')    // "£149.50"
 */
export function formatPrice(price: number, currency?: string): string {
  const amount = Number.isFinite(price) ? price : 0;
  return `${currencySymbol(currency)}${amount.toFixed(2)}`;
}
