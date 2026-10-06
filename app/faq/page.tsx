import type { Metadata } from 'next';
import { absoluteUrl } from '../../lib/site';

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Answers about Saleh Store, eBay product discovery, buying guides, prices, affiliate links, and support.',
  alternates: { canonical: absoluteUrl('/faq') },
};

const faqData = [
  ['What is Saleh Store?', 'Saleh Store is an eBay-only product-discovery site with shopping guides and comparison resources. The site helps readers research a purchase before following an outbound eBay link.'],
  ['Does Saleh Store sell the products?', 'No. Saleh Store does not manufacture, stock, ship, or fulfill the products shown through its eBay links. Checkout and the transaction are handled on eBay and by the applicable seller.'],
  ['Do prices stay the same?', 'No. Marketplace prices, inventory, shipping charges, taxes, seller terms, and availability can change. Treat the current eBay listing and checkout total as the source of truth before buying.'],
  ['How does Saleh Store make money?', 'Saleh Store participates in the eBay Partner Network. Some outbound links may generate a commission from qualifying purchases at no additional cost to the buyer.'],
  ['Are the buying guides sponsored by sellers?', 'The editorial guides are written independently of individual eBay sellers. A marketplace product link may be affiliate-linked, and the affiliate relationship is disclosed.'],
  ['How are products compared?', 'The site emphasizes exact configuration, compatibility, condition, included accessories, delivered cost, seller information, and return terms. The relevant criteria depend on the product category.'],
  ['Can Saleh Store guarantee that a listing is the cheapest?', 'No. A listing can change or disappear, and another seller may offer different terms. The guides explain how to compare listings rather than promise a universal lowest price.'],
  ['What should I do about an eBay order problem?', 'Because the transaction happens on eBay, use the applicable eBay order, return, dispute, or buyer-support process. Saleh Store cannot issue an eBay refund or change a seller transaction.'],
  ['How do I report incorrect information on Saleh Store?', 'Use the Contact page and describe the page, the specific statement, and the correction you believe is needed.'],
  ['Where can I read the site policies?', 'Privacy, cookies, terms of use, and the affiliate/legal disclosure are linked in the site footer.'],
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 dark:bg-gray-900">
      <article className="mx-auto max-w-4xl">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white md:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600 dark:text-gray-300">
            Clear answers about Saleh Store, the eBay relationship, our research process, and what happens after an outbound marketplace click.
          </p>
        </header>

        <div className="space-y-4">
          {faqData.map(([question, answer]) => (
            <section key={question} className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{question}</h2>
              <p className="mt-3 leading-7 text-gray-700 dark:text-gray-300">{answer}</p>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
