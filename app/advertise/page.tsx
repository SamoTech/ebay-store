import type { Metadata } from 'next';
import Link from 'next/link';
import { sponsorPackages } from '@/config/sponsor-packages';
import { SPONSORSHIP_CONTACT } from '@/config/sponsorship';

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  title: 'Advertise on Saleh Store',
  description:
    'Direct sponsorship opportunities on Saleh Store for brands, stores, and relevant services.',
  alternates: {
    canonical: '/advertise',
  },
};

export default function AdvertisePage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <section className="bg-gray-950 px-4 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
            Direct Sponsorship
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            Advertise on Saleh Store
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-300">
            Reach shoppers through direct sponsored placements across product discovery,
            categories, and shopping content.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-6 md:grid-cols-2">
          {sponsorPackages.map((pkg) => (
            <article
              key={pkg.id}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {pkg.name}
                </h2>
                <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {pkg.pricing}
                </span>
              </div>
              <p className="mt-3 text-gray-600 dark:text-gray-300">{pkg.description}</p>

              {pkg.placements.length > 0 ? (
                <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {pkg.placements.map((placement) => (
                    <li key={placement} className="font-mono">
                      {placement}
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16">
        <div className="rounded-3xl bg-blue-700 p-8 text-center text-white shadow-xl">
          <h2 className="text-2xl font-black">Discuss your campaign</h2>
          <p className="mx-auto mt-3 max-w-xl text-blue-100">
            Send the brand, campaign dates, target audience, and preferred placement.
            We will confirm availability and pricing directly.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={SPONSORSHIP_CONTACT.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-white px-6 py-3 font-bold text-blue-700 transition-colors hover:bg-blue-50"
            >
              Telegram @{SPONSORSHIP_CONTACT.telegramUsername}
            </a>
            <a
              href={SPONSORSHIP_CONTACT.emailUrl}
              className="rounded-xl border border-white/40 px-6 py-3 font-bold text-white transition-colors hover:bg-white/10"
            >
              Email us
            </a>
          </div>

          <p className="mt-4 text-sm text-blue-100">
            {SPONSORSHIP_CONTACT.email}
          </p>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Direct sponsorships are separate from Google AdSense and are managed independently.
          {' '}
          <Link href="/" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
            Back to Saleh Store
          </Link>
        </p>
      </section>
    </main>
  );
}
