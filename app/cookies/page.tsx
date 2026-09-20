import type { Metadata } from 'next';
import Link from 'next/link';
import { absoluteUrl } from '../../lib/site';
import LegalPageShell from '../../components/LegalPageShell';

export const metadata: Metadata = {
  title: 'Cookie Policy | Saleh Store',
  description: 'Cookie and tracking technology policy for Saleh Store.',
  alternates: { canonical: absoluteUrl('/cookies') },
};

export default function CookiesPage() {
  return (
    <LegalPageShell title="Cookie Policy" effectiveDate="September 20, 2026">
      <section><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Cookie Notice</h2><p>Saleh Store uses cookies and similar technologies where necessary to operate the website and, where enabled, to support analytics and affiliate attribution.</p></section>
      <section><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">1. Essential Technologies</h2><p>Some browser storage or cookies may be necessary for core functions, preferences, security, or session-related behavior. These technologies are not used as a substitute for a visitor&apos;s identity.</p></section>
      <section><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">2. Affiliate Tracking</h2><p>When you follow an eBay affiliate link, eBay and/or the eBay Partner Network may use tracking technologies to attribute a qualifying purchase to Saleh Store. We do not control eBay’s cookies or retention practices once you leave our website. See eBay’s <a className="text-blue-600 dark:text-blue-400 hover:underline" href="https://www.ebay.com/help/policies/member-behaviour-policies/ebay-c%C3%AF%C2%BF%C2%BFookie-notice?id=4267" target="_blank" rel="noopener noreferrer">Cookie Notice</a>.</p></section>
      <section><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">3. Analytics</h2><p>Saleh Store currently uses Google Analytics and Vercel Analytics/Speed Insights for measurement and performance. These services may use cookies or similar technologies depending on configuration and browser behavior.</p></section>
      <section><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">4. Managing Cookies</h2><p>You can manage or delete cookies through your browser settings. Where a consent mechanism is presented, you can use it to manage non-essential tracking preferences. Disabling affiliate tracking may mean Saleh Store cannot receive attribution for a qualifying purchase, but it does not prevent you from viewing or purchasing products on eBay.</p></section>
      <section><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">5. Cookie Banner</h2><p>Our cookie notice provides controls to accept non-essential technologies, reject them, or manage preferences. Consent choices can be changed later using the Cookie settings control. Rejecting non-essential technologies does not affect access to ordinary deal content.</p><blockquote className="border-l-4 border-blue-500 pl-4 italic">We use cookies to improve your experience, analyze site traffic, and track affiliate links to support our site. By clicking “Accept All,” you consent to our use of cookies. You can manage your preferences or decline non-essential cookies by clicking “Manage Preferences.”</blockquote><p><strong>Controls:</strong> Accept All · Reject Non-Essential · Manage Preferences</p></section>
      <section><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">6. More Information</h2><p>See our <Link className="text-blue-600 dark:text-blue-400 hover:underline" href="/privacy">Privacy Policy</Link> for personal data information and our <Link className="text-blue-600 dark:text-blue-400 hover:underline" href="/disclaimer">Affiliate &amp; Legal Disclaimers</Link> for affiliate disclosures.</p></section>
    </LegalPageShell>
  );
}
