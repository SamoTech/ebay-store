import Image from 'next/image';
import Link from 'next/link';
import { getActiveSponsor, type SponsorSlotId } from '@/config/sponsorship';

type SponsorSlotProps = {
  slot: SponsorSlotId;
  className?: string;
};

const slotLabels: Record<SponsorSlotId, string> = {
  'homepage-top': 'Homepage top',
  'homepage-bottom': 'Homepage bottom',
  'category-top': 'Category top',
  'product-sidebar': 'Product sidebar',
  'article-middle': 'Article middle',
  'article-bottom': 'Article bottom',
};

export default function SponsorSlot({ slot, className = '' }: SponsorSlotProps) {
  const sponsor = getActiveSponsor(slot);

  if (sponsor) {
    return (
      <section
        className={`mx-auto w-full max-w-6xl px-4 py-4 ${className}`}
        aria-label={`Sponsored content from ${sponsor.advertiserName}`}
        data-sponsor-slot={slot}
        data-sponsor-id={sponsor.id}
      >
        <a
          href={sponsor.href}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          {sponsor.image ? (
            <div className="relative aspect-[5/1] min-h-24 w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
              <Image
                src={sponsor.image}
                alt={sponsor.title}
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.01]"
              />
            </div>
          ) : (
            <div className="px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Sponsored
              </p>
              <h2 className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                {sponsor.title}
              </h2>
              {sponsor.description ? (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  {sponsor.description}
                </p>
              ) : null}
            </div>
          )}
        </a>
      </section>
    );
  }

  return (
    <section
      className={`mx-auto w-full max-w-6xl px-4 py-4 ${className}`}
      aria-label={`Advertising placement: ${slotLabels[slot]}`}
      data-sponsor-slot={slot}
      data-sponsor-status="available"
    >
      <Link
        href="/advertise"
        className="group block overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-white shadow-sm transition-all hover:border-blue-400 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
      >
        <div className="flex min-h-24 flex-col items-center justify-center px-6 py-6 text-center sm:min-h-28 sm:flex-row sm:justify-between sm:gap-6 sm:text-left">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500">
              {slotLabels[slot]} · Direct Sponsorship
            </p>
            <h2 className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
              Advertise here
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Put your brand in front of Saleh Store shoppers.
            </p>
          </div>
          <span className="mt-4 shrink-0 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition-colors group-hover:bg-blue-700 sm:mt-0">
            View advertising options →
          </span>
        </div>
      </Link>
    </section>
  );
}
