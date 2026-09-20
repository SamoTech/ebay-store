import Link from 'next/link';
import Footer from './Footer';

export default function LegalPageShell({
  title,
  effectiveDate,
  children,
}: {
  title: string;
  effectiveDate: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-8">
          <span aria-hidden="true">←</span>
          Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{title}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Effective date: {effectiveDate}</p>
        <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-7">
          {children}
        </div>
      </div>
      <Footer />
    </main>
  );
}
