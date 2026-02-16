'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface NewsletterPopupProps {
  delay?: number; // Delay in milliseconds before showing popup
}

export default function NewsletterPopup({ delay = 30000 }: NewsletterPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Check if user already dismissed or subscribed
    const dismissed = localStorage.getItem('newsletter-dismissed');
    const subscribed = localStorage.getItem('newsletter-subscribed');
    
    if (dismissed || subscribed) return;

    // Show popup after delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    // Show on exit intent (when mouse leaves viewport)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !dismissed && !subscribed) {
        setIsVisible(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [delay]);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('newsletter-dismissed', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call (replace with actual newsletter service)
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSuccess(true);
    localStorage.setItem('newsletter-subscribed', 'true');
    
    setTimeout(() => {
      setIsVisible(false);
    }, 2000);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 relative pointer-events-auto transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>

          {!isSuccess ? (
            <>
              {/* Icon */}
              <div className="text-5xl mb-4 text-center">📬</div>
              
              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 text-center">
                Get Exclusive Deals!
              </h2>
              
              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
                Subscribe to our newsletter and never miss amazing deals from eBay.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
                </button>
              </form>

              {/* Privacy note */}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </>
          ) : (
            <>
              {/* Success state */}
              <div className="text-center">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  You're All Set!
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Welcome to our community. Check your email for exclusive deals!
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
