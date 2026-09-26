'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

type Deal = {
  price: number;
  shipping: number;
  charges: number;
  accessories: number;
};

const emptyDeal: Deal = { price: 0, shipping: 0, charges: 0, accessories: 0 };

function total(deal: Deal) {
  return deal.price + deal.shipping + deal.charges + deal.accessories;
}

function DealFields({
  label,
  deal,
  onChange,
}: {
  label: string;
  deal: Deal;
  onChange: (next: Deal) => void;
}) {
  const update = (key: keyof Deal, value: string) =>
    onChange({ ...deal, [key]: Math.max(0, Number(value) || 0) });

  return (
    <fieldset className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
      <legend className="px-2 text-lg font-black text-gray-900 dark:text-white">{label}</legend>
      <div className="grid sm:grid-cols-2 gap-4 mt-3">
        {([
          ['price', 'Item price'],
          ['shipping', 'Shipping'],
          ['charges', 'Taxes / duties / other charges'],
          ['accessories', 'Required accessories or missing items'],
        ] as const).map(([key, text]) => (
          <label key={key} className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {text}
            <input
              type="number"
              min="0"
              step="0.01"
              value={deal[key] || ''}
              onChange={(event) => update(key, event.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2"
            />
          </label>
        ))}
      </div>
      <p className="mt-5 text-2xl font-black text-[#0064d2]">
        Total: ${total(deal).toFixed(2)}
      </p>
    </fieldset>
  );
}

export default function DealComparisonPage() {
  const [dealA, setDealA] = useState<Deal>({ ...emptyDeal });
  const [dealB, setDealB] = useState<Deal>({ ...emptyDeal });
  const difference = useMemo(() => total(dealA) - total(dealB), [dealA, dealB]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="bg-gradient-to-br from-[#0064d2] via-[#0054ad] to-[#003f7f] text-white px-4 py-14">
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="text-blue-100 hover:text-white text-sm">Saleh Store</Link>
          <h1 className="mt-4 text-4xl md:text-5xl font-black">eBay Deal Comparison Calculator</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-blue-100">
            Compare the realistic cost of two marketplace listings instead of relying on the headline item price.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        <p className="text-gray-700 dark:text-gray-300 leading-8">
          Enter the same cost categories for both listings. Use zero when a cost does not apply. The calculator is deliberately simple: it makes hidden cost differences visible without claiming that price alone determines which listing is appropriate.
        </p>

        <div className="grid lg:grid-cols-2 gap-6">
          <DealFields label="Listing A" deal={dealA} onChange={setDealA} />
          <DealFields label="Listing B" deal={dealB} onChange={setDealB} />
        </div>

        <section className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Comparison</h2>
          <p className="mt-3 text-gray-700 dark:text-gray-300">
            {difference === 0
              ? 'The entered totals are equal.'
              : difference > 0
                ? 'Listing B is ' + Math.abs(difference).toFixed(2) + ' lower based on the entered costs.'
                : 'Listing A is ' + Math.abs(difference).toFixed(2) + ' lower based on the entered costs.'}
          </p>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Always verify the final checkout total, condition, included items, seller information, shipping, taxes, and return terms on the marketplace listing.
          </p>
        </section>

        <section className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Methodology</h2>
          <p className="mt-3 text-gray-700 dark:text-gray-300 leading-8">
            The calculator follows the comparison method documented by Saleh Store: normalize the product configuration first, then compare item price, shipping, applicable charges, missing accessories, condition, and return terms.
          </p>
          <Link href="/research/ebay-deal-comparison-methodology" className="mt-4 inline-block font-semibold text-[#0064d2] hover:underline">
            Read the full comparison methodology →
          </Link>
        </section>
      </section>
    </main>
  );
}
