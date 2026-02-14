'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { featuredProducts, Product } from '../lib/products';
import { useFavorites } from '../contexts/FavoritesContext';
import { useToast } from '../contexts/ToastContext';
import { trackEvent } from '../lib/analytics';

export default function DealOfTheDay() {
  const [deal, setDeal] = useState<Product | null>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [dataSource, setDataSource] = useState<'static' | 'ebay_live' | 'fallback_static'>('static');
  const [isLoading, setIsLoading] = useState(true);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { addToast } = useToast();

  useEffect(() => {
    let isMounted = true;

    // Fetch deal from API
    async function fetchDailyDeal() {
      try {
        const response = await fetch('/api/products/daily-deal');
        if (!response.ok) throw new Error('Failed to fetch deal');

        const data = await response.json();
        
        if (isMounted && data.deal) {
          setDeal(data.deal);
          setDataSource(data.source || 'static');
        }
      } catch (error) {
        console.error('Error fetching daily deal:', error);
        // Fallback to static deal
        if (isMounted) {
          const today = new Date();
          const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
          const dealIndex = dayOfYear % featuredProducts.length;
          setDeal(featuredProducts[dealIndex]);
          setDataSource('static');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchDailyDeal();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    // Calculate time until midnight
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      
      return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (isLoading || !deal) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl overflow-hidden shadow-xl animate-pulse">
          <div className="h-64 md:h-80 bg-orange-600/50"></div>
        </div>
      </section>
    );
  }

  const isFav = isFavorite(deal.id);
  const discount = deal.originalPrice 
    ? Math.round((1 - deal.price / deal.originalPrice) * 100) 
    : 20; // Default 20% if no original price

  const handleFavoriteClick = () => {
    if (isFav) {
      removeFavorite(deal.id);
      addToast('Removed from favorites', 'info');
    } else {
      addFavorite({
        id: deal.id,
        title: deal.title,
        price: deal.price,
        image: deal.image,
        category: deal.category,
        affiliateLink: deal.affiliateLink,
      });
      addToast('Added to favorites!', 'success');
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl overflow-hidden shadow-xl relative">
        {/* Live Deal Indicator */}
        {dataSource === 'ebay_live' && (
          <div className="absolute top-4 right-4 z-10 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
            ● LIVE DEAL
          </div>
        )}

        <div className="md:flex">
          {/* Image */}
          <div className="md:w-1/2 relative">
            <div className="relative h-64 md:h-full min-h-[300px]">
              <Image
                src={deal.image}
                alt={deal.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4 bg-yellow-400 text-black px-4 py-2 rounded-full font-bold text-lg animate-pulse">
                🔥 -{discount}% OFF
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="md:w-1/2 p-6 md:p-8 text-white">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                ⚡ Deal of the Day
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {deal.category}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {deal.title}
            </h2>

            <p className="text-white/80 mb-6">
              {deal.description || `Don't miss out on this incredible deal! Limited time offer on one of our best-selling ${deal.category.toLowerCase()} products.`}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold">${deal.price.toFixed(2)}</span>
              {deal.originalPrice && (
                <span className="text-xl text-white/60 line-through">
                  ${deal.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Countdown */}
            <div className="mb-6">
              <p className="text-sm text-white/80 mb-2">Offer ends in:</p>
              <div className="flex gap-3">
                <div className="bg-white/20 rounded-lg px-4 py-2 text-center">
                  <span className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <p className="text-xs text-white/60">Hours</p>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-2 text-center">
                  <span className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <p className="text-xs text-white/60">Mins</p>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-2 text-center">
                  <span className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <p className="text-xs text-white/60">Secs</p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <a
                href={deal.affiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent({ 
                  event: 'affiliate_outbound_click', 
                  productId: deal.id, 
                  source: dataSource === 'ebay_live' ? 'deal_of_the_day_live' : 'deal_of_the_day_static', 
                  category: deal.category 
                })}
                className="flex-1 bg-white text-orange-600 text-center py-3 rounded-xl font-bold hover:bg-orange-50 transition-colors"
              >
                Grab This Deal →
              </a>
              <button
                onClick={handleFavoriteClick}
                className={`p-3 rounded-xl transition-colors ${
                  isFav 
                    ? 'bg-red-400 text-white' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={isFav ? 0 : 2}>
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </button>
              {deal.id && (
                <Link
                  href={`/product/${deal.id}`}
                  className="p-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-colors"
                  aria-label="View details"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
