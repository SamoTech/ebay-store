import type { Metadata } from 'next';
import Link from 'next/link';
import { absoluteUrl } from '../../lib/site';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact Saleh Store for corrections, editorial questions, partnership enquiries, or general site feedback.',
  alternates: { canonical: absoluteUrl('/contact') },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <article className="mx-auto max-w-5xl">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white md:text-5xl">Contact Saleh Store</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600 dark:text-gray-300">
            Use this page to report incorrect information, broken links, editorial questions, partnership enquiries, or other site issues.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          <section className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Send a message</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
              Give enough detail for the team to identify the relevant page or statement and explain the correction or question.
            </p>

            <form className="mt-6 space-y-5" action="https://formspree.io/f/mpqjrzzy" method="POST">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Name</label>
                <input type="text" id="name" name="name" required className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                <input type="email" id="email" name="email" required className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                <input type="text" id="subject" name="subject" required className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                <textarea id="message" name="message" required rows={7} className="mt-2 w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
              </div>
              <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700">
                Send Message
              </button>
            </form>
          </section>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact scope</h2>
              <div className="mt-4 space-y-4 text-gray-700 dark:text-gray-300">
                <p>Report a factual error or a broken link on any Saleh Store page.</p>
                <p>Ask about the editorial method, sourcing, or a published buying guide.</p>
                <p>Send partnership or direct-sponsorship enquiries.</p>
                <p>For an eBay order, refund, return, seller dispute, or account issue, contact eBay because Saleh Store is not the seller or transaction processor.</p>
              </div>
            </section>

            <section className="rounded-2xl border border-blue-200 bg-blue-50 p-7 dark:border-blue-900 dark:bg-blue-950/30">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Before sending a correction</h2>
              <p className="mt-3 leading-7 text-gray-700 dark:text-gray-300">
                Include the page URL, the exact statement that needs correction, and the source or evidence you are using. This makes editorial review faster and reduces guesswork.
              </p>
              <Link href="/about/editorial-team" className="mt-4 inline-block font-semibold text-blue-700 hover:underline dark:text-blue-300">
                Read our editorial standards →
              </Link>
            </section>
          </aside>
        </div>
      </article>
    </main>
  );
}
