import { categories } from '@/lib/products';

describe('marketplace category taxonomy', () => {
  it('has unique IDs, names, and slugs', () => {
    const ids = categories.map((category) => category.id);
    const names = categories.map((category) => category.name);
    const slugs = categories.map((category) => category.slug);

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(names).size).toBe(names.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('keeps the directory slug format compatible with category routing', () => {
    for (const category of categories) {
      expect(category.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it('keeps the all-products entry as the only reserved all slug', () => {
    expect(categories.filter((category) => category.slug === 'all')).toHaveLength(1);
    expect(categories.find((category) => category.slug === 'all')?.name).toBe('All Products');
  });

  it('does not publish known non-product service landing pages', () => {
    const names = categories.map((category) => category.name);
    expect(names).not.toContain('Real Estate');
    expect(names).not.toContain('Specialty Services');
  });
});
