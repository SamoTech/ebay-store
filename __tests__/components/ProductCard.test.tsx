import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/products';

// Mock contexts
jest.mock('@/contexts/ToastContext', () => ({
  useToast: () => ({
    addToast: jest.fn(),
  }),
}));

jest.mock('@/contexts/FavoritesContext', () => ({
  useFavorites: () => ({
    favorites: [],
    addFavorite: jest.fn(),
    removeFavorite: jest.fn(),
  }),
}));

jest.mock('@/contexts/RecentlyViewedContext', () => ({
  useRecentlyViewed: () => ({
    addRecentlyViewed: jest.fn(),
  }),
}));

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  price: 99.99,
  currency: 'USD',
  image: 'https://via.placeholder.com/400',
  category: 'Electronics',
  affiliateLink: 'https://ebay.com/itm/123',
  description: 'Test description',
};

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });

  it('displays product image with alt text', () => {
    render(<ProductCard product={mockProduct} />);
    
    const image = screen.getByAltText('Test Product');
    expect(image).toBeInTheDocument();
  });

  it('has accessible favorite button', () => {
    render(<ProductCard product={mockProduct} />);
    
    const favoriteButton = screen.getByRole('button', { name: /favorite/i });
    expect(favoriteButton).toBeInTheDocument();
  });

  it('opens product link in new tab', () => {
    render(<ProductCard product={mockProduct} />);
    
    const link = screen.getByRole('link', { name: /view on ebay/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
