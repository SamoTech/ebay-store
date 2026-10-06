import Link from 'next/link';
import FooterVisitorStats from './FooterVisitorStats';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12 mt-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-xl font-bold mb-4">Saleh Store</h2>
            <p className="text-gray-400 mb-4">
              Your destination for discovering deals on electronics, gaming, sneakers, and more. We link you to eBay; purchases, seller relationships, shipping, returns, and buyer support are handled by eBay and the applicable seller.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              For questions, corrections, or partnership enquiries, use our
              <Link href="/contact" className="ml-1 text-blue-300 hover:text-white">Contact page</Link>.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="font-semibold mb-4">Quick Links</h2>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/advertise" className="hover:text-white transition-colors">Advertise</Link></li>
              <li><Link href="/favorites" className="hover:text-white transition-colors">Favorites</Link></li>
              <li><a href="https://www.ebay.com/sch/i.html?_nkw=deals" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">eBay Deals</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h2 className="font-semibold mb-4">Top Categories</h2>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/category/electronics" className="hover:text-white transition-colors">Electronics</Link></li>
              <li><Link href="/category/gaming" className="hover:text-white transition-colors">Gaming</Link></li>
              <li><Link href="/category/sneakers" className="hover:text-white transition-colors">Sneakers</Link></li>
              <li><Link href="/category/smart-home" className="hover:text-white transition-colors">Smart Home</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 pt-8">
          <p className="text-gray-400 text-center">
            Saleh Store is a participant in the eBay Partner Network, an affiliate advertising program 
            designed to provide a means for sites to earn advertising fees by advertising and linking to eBay.
          </p>
          <FooterVisitorStats />
          <p className="mt-4 text-gray-500 text-sm text-center">
            © {new Date().getFullYear()} Saleh Store. All rights reserved. | 
            <Link href="/privacy" className="hover:text-white ml-2">Privacy Policy</Link> |
            <Link href="/cookies" className="hover:text-white ml-2">Cookie Policy</Link> |
            <Link href="/terms" className="hover:text-white ml-2">Terms of Use</Link> |
            <Link href="/disclaimer" className="hover:text-white ml-2">Affiliate Disclosure</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
