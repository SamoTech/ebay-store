import Image from 'next/image';
import { getActiveSponsor, type SponsorSlotId } from '@/config/sponsorship';

type SponsorSlotProps = {
  slot: SponsorSlotId;
  className?: string;
};

export default function SponsorSlot({ slot, className = '' }: SponsorSlotProps) {
  const sponsor = getActiveSponsor(slot);

  if (!sponsor) return null;

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
