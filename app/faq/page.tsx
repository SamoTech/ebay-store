'use client';

import { useState } from 'react';
import { Metadata } from 'next';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    category: 'General',
    question: 'What is DealsHub?',
    answer: 'DealsHub is a curated platform that helps you discover the best deals on eBay. We handpick trending products across electronics, gaming, fashion, home goods, and more, making it easy to find great value without endless searching.'
  },
  {
    category: 'General',
    question: 'Is DealsHub free to use?',
    answer: 'Yes! DealsHub is 100% free. We never charge fees or require subscriptions. We earn a small commission when you make a purchase through our affiliate links, but this never affects your price.'
  },
  {
    category: 'Shopping',
    question: 'How do I purchase products?',
    answer: 'When you click "View on eBay" on any product, you\'ll be redirected to eBay\'s website where you can complete your purchase securely through their platform. All transactions happen directly on eBay.'
  },
  {
    category: 'Shopping',
    question: 'Are the prices on DealsHub accurate?',
    answer: 'We update prices regularly, but since they come from eBay, they can change quickly. Always verify the final price on eBay before purchasing. The price on eBay is the actual price you\'ll pay.'
  },
  {
    category: 'Shopping',
    question: 'What payment methods are accepted?',
    answer: 'Payment is handled directly by eBay. They accept major credit cards, PayPal, Apple Pay, Google Pay, and other payment methods depending on your location.'
  },
  {
    category: 'Deals',
    question: 'How often are new deals added?',
    answer: 'We update our deals daily! Our team searches eBay every day to bring you the latest and best offers. Check back regularly to not miss out on limited-time deals.'
  },
  {
    category: 'Deals',
    question: 'How do you select deals?',
    answer: 'We consider multiple factors: price discounts, seller reputation, product ratings, trending popularity, and value for money. Only deals that meet our quality standards are featured.'
  },
  {
    category: 'Deals',
    question: 'Can I request specific products or deals?',
    answer: 'While we don\'t take specific requests, we appreciate feedback! If there\'s a category or product type you\'d like to see more of, contact us and we\'ll consider it for future updates.'
  },
  {
    category: 'Account',
    question: 'Do I need to create an account?',
    answer: 'No account is needed to browse deals on DealsHub. However, you\'ll need an eBay account to make purchases when you click through to eBay.'
  },
  {
    category: 'Account',
    question: 'How can I save my favorite deals?',
    answer: 'Currently, we recommend bookmarking products directly on eBay or saving links in your browser. We\'re working on adding a favorites feature in the future!'
  },
  {
    category: 'Support',
    question: 'What if I have an issue with my order?',
    answer: 'Since purchases are made through eBay, please contact eBay customer support for any order issues, returns, or refunds. They have excellent buyer protection policies.'
  },
  {
    category: 'Support',
    question: 'How can I contact DealsHub?',
    answer: 'You can reach us through our Contact page. We typically respond within 24 hours during business days. For urgent eBay order issues, please contact eBay directly.'
  },
  {
    category: 'Support',
    question: 'Can I report a broken link or incorrect information?',
    answer: 'Absolutely! We appreciate you helping us maintain quality. Please use our Contact form to report any issues, and we\'ll fix them as soon as possible.'
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(faqData.map(item => item.category)))];
  
  const filteredFAQs = activeCategory === 'All' 
    ? faqData 
    : faqData.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find answers to common questions about DealsHub
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex-1">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                    {faq.category}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                    {faq.question}
                  </h3>
                </div>
                <svg
                  className={`w-6 h-6 text-gray-500 dark:text-gray-400 transition-transform flex-shrink-0 ml-4 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still have questions CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Still have questions?</h2>
          <p className="text-lg mb-6 opacity-90">
            We're here to help! Get in touch with our support team.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-blue-600 bg-white hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
