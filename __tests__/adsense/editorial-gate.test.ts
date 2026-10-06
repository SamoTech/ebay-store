import fs from 'node:fs';
import path from 'node:path';
import { blogArticles } from '../../lib/blog-data';

describe('AdSense editorial gate', () => {
  it('keeps the public editorial corpus intentionally small and explicit', () => {
    expect(blogArticles.filter((article) => article.indexable !== false).map((article) => article.id))
      .toEqual([31, 33, 35, 37, 38, 61]);
  });

  it('does not expose duplicate article slugs', () => {
    const slugs = blogArticles.map((article) => article.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('keeps selected guides free of fabricated first-person testing claims', () => {
    const selected = blogArticles.filter((article) => article.indexable !== false);
    const articleText = selected
      .flatMap((article) => article.content)
      .map((block) => [block.text ?? '', ...(block.items ?? [])].join(' '))
      .join(' ');

    expect(articleText).not.toMatch(/\b(I\s+(?:tested|personally|owned|used)|my\s+(?:testing|experience)|we\s+(?:tested|personally))\b/i);
  });

  it('keeps commercial ad/sponsorship components out of editorial and research pages', () => {
    const routes = [
      'app/blog/[slug]/page.tsx',
      'app/blog/page.tsx',
      'app/categories/page.tsx',
      'app/tools/deal-comparison/page.tsx',
      'app/research/ebay-deal-comparison-methodology/page.tsx',
    ];

    for (const route of routes) {
      const source = fs.readFileSync(path.join(process.cwd(), route), 'utf8');
      expect(source).not.toMatch(/AdSenseBlock|SponsorSlot/);
    }
  });
});
