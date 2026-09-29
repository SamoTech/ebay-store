import type { SponsorSlotId } from './sponsorship';

export type SponsorPackage = {
  id: string;
  name: string;
  description: string;
  placements: SponsorSlotId[];
  pricing: string;
};

export const sponsorPackages: SponsorPackage[] = [
  {
    id: 'homepage',
    name: 'Homepage Sponsorship',
    description: 'High-visibility placement on the Saleh Store homepage.',
    placements: ['homepage-top', 'homepage-bottom'],
    pricing: '$49 / month',
  },
  {
    id: 'category',
    name: 'Category Sponsorship',
    description: 'Target shoppers browsing a specific product category.',
    placements: ['category-top'],
    pricing: '$29 / month',
  },
  {
    id: 'content',
    name: 'Content Sponsorship',
    description: 'Place your campaign alongside relevant shopping guides.',
    placements: ['article-middle', 'article-bottom'],
    pricing: '$19 / month',
  },
  {
    id: 'custom',
    name: 'Custom Campaign',
    description: 'A tailored combination of available placements and campaign dates.',
    placements: [],
    pricing: '$79 / month',
  },
];
