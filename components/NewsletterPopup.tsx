'use client';

import { useState, useEffect } from 'react';
import { trackEvent } from '../lib/analytics';
import { useToast } from '../contexts/ToastContext';

interface NewsletterPopupProps {
  delay?: number; // Show after X seconds
}

export default function NewsletterPopup({ delay = 30000 }: NewsletterPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: 'I would like to receive exclusive deals and updates from DealsHub.',
    agree: false,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    // Check if user already subscribed
    const hasSubscribed = localStorage.getItem('newsletter_subscribed');
    const hasDismissed = localStorage.getItem('newsletter_dismissed');
    const dismissTime = localStorage.getItem('newsletter_dismiss_time');
    
    // Don't show if subscribed
    if (hasSubscribed) return;
    
    // If dismissed, only show again after 7 days
    if (hasDismissed && dismissTime) {
      const daysSinceDismiss = (Date.now() - parseInt(dismissTime)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismiss < 7) return;
    }

    // Show popup after delay
    const timer = setTimeout(() => {
      setIsVisible(true);
      trackEvent({ event: 'newsletter_popup_shown', source: 'automatic' });
    }, delay);

    // Exit-intent detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasSubscribed && !hasDismissed) {
        setIsVisible(true);
        trackEvent({ event: 'newsletter_popup_shown', source: 'exit_intent' });
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [delay]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.name || !formData.agree || isLoading) {
      if (!formData.agree) {
        setError('Please agree to join our mailing list');
      }
      return;
    }

    setIsLoading(true);
    setError('');
    trackEvent({ event: 'newsletter_signup_attempt', email_domain: formData.email.split('@')[1] });

    try {
      // Send directly to Web3Forms API
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: '82cf49f9-69e0-4082-84eb-bf8aa798179c',
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: '🎉 New Newsletter Subscription - DealsHub',
          from_name: 'DealsHub Newsletter',
        }),
      });

      const data = await response.json();
      console.log('Web3Forms response:', data);

      if (response.ok && data.success) {
        setIsSubmitted(true);
        localStorage.setItem('newsletter_subscribed', 'true');
        trackEvent({ event: 'newsletter_signup_success', source: 'popup' });
        addToast('✅ Successfully subscribed to newsletter!', 'success');
        
        // Auto-close after showing success message for 3 seconds
        setTimeout(() => {
          setIsVisible(false);
          setIsSubmitted(false);
        }, 3000);
      } else {
        const errorMessage = data.message || 'Subscription failed. Please try again.';
        setError(errorMessage);
        addToast(`❌ ${errorMessage}`, 'error');
        trackEvent({ event: 'newsletter_signup_failed', error: errorMessage });
      }
    } catch (error) {
      console.error('Newsletter signup error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Network error. Please try again.';
      setError(errorMessage);
      addToast(`❌ ${errorMessage}`, 'error');
      trackEvent({ event: 'newsletter_signup_error', error: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('newsletter_dismissed', 'true');
    localStorage.setItem('newsletter_dismiss_time', Date.now().toString());
    trackEvent({ event: 'newsletter_popup_dismissed' });
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] animate-in fade-in duration-300"
        onClick={handleDismiss}
      />
      
      {/* Popup */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in zoom-in-95 duration-300">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 relative max-h-[90vh] overflow-y-auto">
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors z-10"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {!isSubmitted ? (
            <>
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-3">
                Get Exclusive Deals! 🎁
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                Join 10,000+ deal hunters and get daily alerts for:
              </p>

              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>⚡ Flash sales (up to 70% off)</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>📉 Price drop alerts</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>🎯 Exclusive coupon codes</span>
                </li>
              </ul>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none transition-colors"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message (optional)
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Consent Checkbox */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="agree"
                    checked={formData.agree}
                    onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                    required
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="agree" className="text-sm text-gray-600 dark:text-gray-400">
                    I agree to join the DealsHub mailing list and receive exclusive deals, updates, and promotional content.
                  </label>
                </div>

                {error && (
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !formData.agree}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Subscribing...
                    </span>
                  ) : (
                    'Subscribe Now! 🚀'
                  )}
                </button>
              </form>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                No spam, unsubscribe anytime. We respect your privacy.
              </p>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in-50 duration-300">
                <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                You're In! 🎉
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Welcome to DealsHub, {formData.name}!
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                Check your inbox for exclusive deals.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
