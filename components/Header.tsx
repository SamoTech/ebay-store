import Link from 'next/link';

export default function Header() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-xl font-bold text-blue-600">
            DealsHub
          </Link>
          <div className="flex gap-6">
            <Link href="/" className="text-gray-600 hover:text-blue-600">
              Home
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-blue-600">
              Blog
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
