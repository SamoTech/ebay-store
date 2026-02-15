/**
 * Input validation using Zod
 */

import { z } from 'zod';

// Product schema
export const ProductSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1).max(500),
  price: z.number().positive(),
  currency: z.string().length(3).default('USD'),
  image: z.string().url(),
  category: z.string().min(1).max(100),
  affiliateLink: z.string().url(),
  description: z.string().optional(),
});

export type ValidatedProduct = z.infer<typeof ProductSchema>;

// Search query schema
export const SearchQuerySchema = z.object({
  q: z.string().min(1).max(200).trim(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

// Category slug schema
export const CategorySlugSchema = z
  .string()
  .min(1)
  .max(50)
  .regex(/^[a-z0-9-]+$/, 'Invalid category slug');

// Email schema
export const EmailSchema = z.string().email();

// Price alert schema
export const PriceAlertSchema = z.object({
  email: EmailSchema,
  productId: z.number().int().positive(),
  targetPrice: z.number().positive(),
});

/**
 * Validate and parse data
 */
export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Use issues instead of errors for Zod v3+
      const messages = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
      return { success: false, error: messages.join(', ') };
    }
    return { success: false, error: 'Validation failed' };
  }
}

/**
 * Safe parse with default value
 */
export function validateOrDefault<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  defaultValue: T
): T {
  const result = schema.safeParse(data);
  return result.success ? result.data : defaultValue;
}
