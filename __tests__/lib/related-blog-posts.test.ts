import { getRelatedBlogPosts } from '@/lib/related-blog-posts';
import type { BlogArticle } from '@/lib/blog-data';

const article = (overrides: Partial<BlogArticle>): BlogArticle => ({
  id: 1,
  slug: 'base',
  title: 'Base guide',
  excerpt: 'General shopping research.',
  date: 'September 27, 2026',
  category: 'Electronics',
  readTime: '5 min read',
  author: 'Saleh Store Editorial Team',
  authorBio: 'Editorial team.',
  gradient: 'from-blue-500 to-indigo-600',
  content: [],
  ...overrides,
});

describe('getRelatedBlogPosts', () => {
  it('prefers contextually matching titles over weaker same-category matches', () => {
    const base = article({
      title: 'Laptop Buying Checklist',
      excerpt: 'Compare laptop CPU, RAM, storage, and display.',
    });

    const related = article({
      id: 2,
      slug: 'laptop-guide',
      title: 'Laptop Configuration Guide',
      excerpt: 'Compare laptop configurations and total cost.',
    });

    const weak = article({
      id: 3,
      slug: 'phone-guide',
      title: 'Smartphone Buying Checklist',
      excerpt: 'Check carrier compatibility and battery health.',
    });

    const unrelated = article({
      id: 4,
      slug: 'gaming-guide',
      title: 'Gaming Monitor Buying Guide',
      excerpt: 'Compare refresh rate, resolution, and connectivity.',
      category: 'Gaming',
    });

    const result = getRelatedBlogPosts(base, [weak, unrelated, related], 2);

    expect(result.map((post) => post.slug)).toEqual(['laptop-guide', 'phone-guide']);
  });

  it('keeps the original order for equal scores', () => {
    const base = article({ title: 'Camera Setup', excerpt: 'Camera accessories and compatibility.' });
    const first = article({ id: 2, slug: 'first', title: 'Camera Bags', excerpt: 'Camera accessories.' });
    const second = article({ id: 3, slug: 'second', title: 'Camera Cases', excerpt: 'Camera accessories.' });

    expect(getRelatedBlogPosts(base, [second, first], 2).map((post) => post.slug)).toEqual(['second', 'first']);
  });

  it('excludes the current article and respects the limit', () => {
    const base = article({ title: 'Laptop Checklist', excerpt: 'Laptop buying research.' });
    const result = getRelatedBlogPosts(base, [
      base,
      article({ id: 2, slug: 'one', title: 'Laptop Guide', excerpt: 'Laptop research.' }),
      article({ id: 3, slug: 'two', title: 'Laptop Setup', excerpt: 'Laptop research.' }),
      article({ id: 4, slug: 'three', title: 'Laptop Accessories', excerpt: 'Laptop research.' }),
    ], 2);

    expect(result).toHaveLength(2);
    expect(result.every((post) => post.slug !== base.slug)).toBe(true);
  });
});
