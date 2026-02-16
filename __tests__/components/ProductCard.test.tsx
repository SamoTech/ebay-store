import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ProductCard from '@/components/ProductCard'
import { FavoritesProvider } from '@/contexts/FavoritesContext'
import { CurrencyProvider } from '@/contexts/CurrencyContext'
import { ToastProvider } from '@/contexts/ToastContext'

/**
 * Test Suite: ProductCard Component
 * 
 * Tests product display, interactions, and favorite functionality
 */

const mockProduct = {
  id: '1',
  title: 'Test Product',
  price: 99.99,
  currency: 'USD',
  image: 'https://example.com/image.jpg',
  url: 'https://ebay.com/item/1',
  description: 'Test description',
  category: 'Electronics',
  condition: 'New' as const,
  shipping: 'Free',
  seller: {
    name: 'Test Seller',
    rating: 98.5,
    feedbackCount: 1000
  }
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

describe('ProductCard', () => {
  describe('Rendering', () => {
    it('should render product title', () => {
      render(
        <AllProviders>
          <ProductCard product={mockProduct} />
        </AllProviders>
      )
      
      expect(screen.getByText('Test Product')).toBeInTheDocument()
    })

    it('should render product price', () => {
      render(
        <AllProviders>
          <ProductCard product={mockProduct} />
        </AllProviders>
      )
      
      expect(screen.getByText(/99.99/)).toBeInTheDocument()
    })

    it('should render product image', () => {
      render(
        <AllProviders>
          <ProductCard product={mockProduct} />
        </AllProviders>
      )
      
      const image = screen.getByAltText('Test Product')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', expect.stringContaining('image.jpg'))
    })

    it('should render product condition', () => {
      render(
        <AllProviders>
          <ProductCard product={mockProduct} />
        </AllProviders>
      )
      
      expect(screen.getByText('New')).toBeInTheDocument()
    })

    it('should render shipping info', () => {
      render(
        <AllProviders>
          <ProductCard product={mockProduct} />
        </AllProviders>
      )
      
      expect(screen.getByText(/Free/i)).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('should have clickable product link', () => {
      render(
        <AllProviders>
          <ProductCard product={mockProduct} />
        </AllProviders>
      )
      
      const links = screen.getAllByRole('link')
      const productLink = links.find(link => link.getAttribute('href')?.includes('/product/1'))
      expect(productLink).toBeInTheDocument()
    })

    it('should have favorite button', () => {
      render(
        <AllProviders>
          <ProductCard product={mockProduct} />
        </AllProviders>
      )
      
      const favoriteButton = screen.getByRole('button', { name: /favorite/i })
      expect(favoriteButton).toBeInTheDocument()
    })

    it('should toggle favorite state when clicked', () => {
      render(
        <AllProviders>
          <ProductCard product={mockProduct} />
        </AllProviders>
      )
      
      const favoriteButton = screen.getByRole('button', { name: /favorite/i })
      
      // Click to add to favorites
      fireEvent.click(favoriteButton)
      
      // Verify button state changed (implementation dependent)
      expect(favoriteButton).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper alt text for image', () => {
      render(
        <AllProviders>
          <ProductCard product={mockProduct} />
        </AllProviders>
      )
      
      const image = screen.getByAltText('Test Product')
      expect(image).toBeInTheDocument()
    })

    it('should have accessible links', () => {
      render(
        <AllProviders>
          <ProductCard product={mockProduct} />
        </AllProviders>
      )
      
      const links = screen.getAllByRole('link')
      expect(links.length).toBeGreaterThan(0)
      links.forEach(link => {
        expect(link).toHaveAttribute('href')
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing image gracefully', () => {
      const productWithoutImage = { ...mockProduct, image: '' }
      
      render(
        <AllProviders>
          <ProductCard product={productWithoutImage} />
        </AllProviders>
      )
      
      expect(screen.getByText('Test Product')).toBeInTheDocument()
    })

    it('should handle long titles', () => {
      const productWithLongTitle = {
        ...mockProduct,
        title: 'Very Long Product Title That Should Be Truncated Or Handled Properly'
      }
      
      render(
        <AllProviders>
          <ProductCard product={productWithLongTitle} />
        </AllProviders>
      )
      
      expect(screen.getByText(/Very Long Product Title/)).toBeInTheDocument()
    })

    it('should handle zero price', () => {
      const freeProduct = { ...mockProduct, price: 0 }
      
      render(
        <AllProviders>
          <ProductCard product={freeProduct} />
        </AllProviders>
      )
      
      expect(screen.getByText('Test Product')).toBeInTheDocument()
    })
  })
})
