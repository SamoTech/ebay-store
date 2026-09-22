'use client';

import type { ReactNode } from 'react';
import { trackEvent } from '../lib/analytics';

interface AffiliateLinkProps {
  href: string;
  productId: number;
  category: string;
  source: string;
  className?: string;
  children: ReactNode;
}

export default function AffiliateLink({
  href,
  productId,
  category,
  source,
  className,
  children,
}: AffiliateLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        trackEvent({
          event: 'affiliate_outbound_click',
          productId,
          source,
          category,
          url: href,
        })
      }
      className={className}
    >
      {children}
    </a>
  );
}
