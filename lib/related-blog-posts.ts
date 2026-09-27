import type { BlogArticle } from './blog-data';

const STOPWORDS = new Set([
  'about', 'after', 'also', 'before', 'best', 'buy', 'buying', 'check', 'compare',
  'comparison', 'complete', 'cost', 'current', 'ebay', 'find', 'finding', 'for',
  'from', 'guide', 'guides', 'how', 'into', 'more', 'most', 'only', 'over',
  'practical', 'product', 'products', 'research', 'saleh', 'store', 'the', 'their',
  'this', 'tips', 'using', 'what', 'when', 'with', 'your',
]);

function terms(value: string): Set<string> {
  return new Set(
    value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/[\s-]+/)
      .filter((term) => term.length >= 3 && !STOPWORDS.has(term)),
  );
}

/**
 * Select deterministic, contextually related articles.
 *
 * Category matches are favored, then shared title terms, then shared excerpt
 * terms. Original article order remains the final tie-breaker.
 */
export function getRelatedBlogPosts(
  post: BlogArticle,
  articles: BlogArticle[],
  limit = 3,
): BlogArticle[] {
  if (limit <= 0) return [];

  const postTitleTerms = terms(post.title);
  const postExcerptTerms = terms(post.excerpt);

  return articles
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate, index) => {
      const candidateTitleTerms = terms(candidate.title);
      const candidateExcerptTerms = terms(candidate.excerpt);

      let score = 0;

      if (candidate.category === post.category) score += 6;

      for (const term of postTitleTerms) {
        if (candidateTitleTerms.has(term)) score += 3;
        else if (candidateExcerptTerms.has(term)) score += 1;
      }

      for (const term of postExcerptTerms) {
        if (candidateTitleTerms.has(term)) score += 2;
        else if (candidateExcerptTerms.has(term)) score += 1;
      }

      return { candidate, score, index };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
