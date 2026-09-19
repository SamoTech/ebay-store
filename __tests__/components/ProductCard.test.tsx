import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ProductCard from '@/components/ProductCard'
import { FavoritesProvider } from '@/contexts/FavoritesContext'
import { CurrencyProvider } from '@/contexts/CurrencyContext'
import { ToastProvider } from '@/contexts/ToastContext'
import type { Product } from '@/lib/products'

/**
 * Test Suite: ProductCard Component
 *
 * Tests product display, interactions, and favorite functionality
 */

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  price: 99.99,
  originalPrice: 129.99,
  currency: 'USD',
  image: 'https://example.com/image.jpg',
  category: 'Electronics',
  affiliateLink: 'https://www.ebay.com/itm/123456789?campid=5338903178',
  description: 'Test description',
  condition: 'New',
  shipping: 'Free shipping',
}

/** Live eBay listings use IDs >= 1000 and must link straight to eBay. */
const mockLiveProduct: Product = {
  ...mockProduct,
  id: 1001,
  isLive: true,
  title: 'Live eBay Product',
  currency: 'GBP',
}

const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>
    <CurrencyProvider>
      <FavoritesProvider>
        {children}
      </FavoritesProvider>
    </CurrencyProvider>
  </ToastProvider>
)

const renderCard = (product: Product = mockProduct) =>
  render(
    <AllProviders>
      <ProductCard product={product} />
    </AllProviders>
  )

describe('ProductCard', () => {
  describe('Rendering', () => {
    it('should render product title', () => {
      renderCard()
      expect(screen.getByText('Test Product')).toBeInTheDocument()
    })

    it('should render product price', () => {
      renderCard()
      expect(screen.getByText(/99.99/)).toBeInTheDocument()
    })

    it('should render product image', () => {
      renderCard()
      const image = screen.getByAltText('Test Product')
      expect(image).toBeInTheDocument()
      expect(image.getAttribute('src')).toContain('image.jpg')
    })

    it('should render product condition', () => {
      renderCard()
      expect(screen.getByText('New')).toBeInTheDocument()
    })

    it('should render shipping info', () => {
      renderCard()
      expect(screen.getByText(/Free shipping/i)).toBeInTheDocument()
    })

    it('should fall back to a placeholder image when none is provided', () => {
      renderCard({ ...mockProduct, image: '' })
      const image = screen.getByAltText('Test Product')
      expect(image.getAttribute('src')).toContain('placeholder')
    })
  })

  describe('Live eBay items', () => {
    it('links straight to the affiliate URL with target=_blank', () => {
      renderCard(mockLiveProduct)

      const links = screen.getAllByRole('link')
      const ebayLink = links.find((link) =>
        link.getAttribute('href')?.includes('campid=5338903178')
      )

      expect(ebayLink).toBeDefined()
      expect(ebayLink).toHaveAttribute('target', '_blank')
      expect(screen.getByText('LIVE')).toBeInTheDocument()
      expect(screen.getByText('View on eBay')).toBeInTheDocument()
    })

    it('does not link live items to the internal product page', () => {
      renderCard(mockLiveProduct)

      const links = screen.getAllByRole('link')
      expect(
        links.some((link) => link.getAttribute('href')?.includes('/product/1001'))
      ).toBe(false)
    })

    it('renders the price in the listing currency', () => {
      renderCard({ ...mockLiveProduct, price: 149.5, originalPrice: undefined })
      expect(screen.getByText('£149.50')).toBeInTheDocument()
    })
  })

  describe('Static catalog items', () => {
    it('links to the internal product detail page', () => {
      renderCard()

      const links = screen.getAllByRole('link')
      const productLink = links.find(link => link.getAttribute('href')?.includes('/product/1'))
      expect(productLink).toBeInTheDocument()
      expect(screen.getByText('View Details')).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('should have favorite button', () => {
      renderCard()

      const favoriteButton = screen.getByRole('button', { name: /favorite/i })
      expect(favoriteButton).toBeInTheDocument()
    })

    it('should toggle favorite state when clicked', () => {
      renderCard()

      const favoriteButton = screen.getByRole('button', { name: /favorite/i })
      expect(favoriteButton).toHaveAttribute('aria-pressed', 'false')

      fireEvent.click(favoriteButton)

      expect(
        screen.getByRole('button', { name: /remove .* from favorites/i })
      ).toHaveAttribute('aria-pressed', 'true')
    })
  })

  describe('Accessibility', () => {
    it('should have proper alt text for image', () => {
      renderCard()
      const image = screen.getByAltText('Test Product')
      expect(image).toBeInTheDocument()
    })

    it('should have accessible links', () => {
      renderCard()
      const links = screen.getAllByRole('link')
      expect(links.length).toBeGreaterThan(0)
      links.forEach(link => {
        expect(link).toHaveAttribute('href')
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing image gracefully', () => {
      renderCard({ ...mockProduct, image: '' })
      expect(screen.getByText('Test Product')).toBeInTheDocument()
    })

    it('should handle long titles', () => {
      renderCard({
        ...mockProduct,
        title: 'Very Long Product Title That Should Be Truncated Or Handled Properly',
      })
      expect(screen.getByText(/Very Long Product Title/)).toBeInTheDocument()
    })

    it('should handle zero price', () => {
      renderCard({ ...mockProduct, price: 0 })
      expect(screen.getByText('$0.00')).toBeInTheDocument()
    })

    it('should not render a discount badge when there is no original price', () => {
      renderCard({ ...mockProduct, originalPrice: undefined })
      expect(screen.queryByText(/^-\d+%$/)).not.toBeInTheDocument()
    })
  })
})
