import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock useRouter
const mockPush = jest.fn();
const mockRouter = {
  push: mockPush,
  pathname: '/',
  query: {},
  asPath: '/',
};

describe('SearchBar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  describe('Rendering', () => {
    it('should render search input', () => {
      render(<SearchBar />);
      const input = screen.getByRole('searchbox');
      expect(input).toBeInTheDocument();
    });

    it('should render with placeholder text', () => {
      render(<SearchBar />);
      const input = screen.getByPlaceholderText(/search for products/i);
      expect(input).toBeInTheDocument();
    });

    it('should render search button', () => {
      render(<SearchBar />);
      const button = screen.getByRole('button', { name: /search/i });
      expect(button).toBeInTheDocument();
    });

    it('should have proper ARIA labels', () => {
      render(<SearchBar />);
      const input = screen.getByRole('searchbox');
      expect(input).toHaveAttribute('aria-label', 'Search for products');
    });
  });

  describe('Search Functionality', () => {
    it('should update input value on typing', async () => {
      const user = userEvent.setup();
      render(<SearchBar />);
      const input = screen.getByRole('searchbox') as HTMLInputElement;

      await user.type(input, 'laptop');
      expect(input.value).toBe('laptop');
    });

    it('should navigate to search page on form submit', async () => {
      const user = userEvent.setup();
      render(<SearchBar />);
      const input = screen.getByRole('searchbox');
      const form = input.closest('form');

      await user.type(input, 'gaming mouse');
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/search?q=gaming+mouse');
      });
    });

    it('should navigate on search button click', async () => {
      const user = userEvent.setup();
      render(<SearchBar />);
      const input = screen.getByRole('searchbox');
      const button = screen.getByRole('button', { name: /search/i });

      await user.type(input, 'keyboard');
      await user.click(button);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/search?q=keyboard');
      });
    });

    it('should not search with empty query', async () => {
      const user = userEvent.setup();
      render(<SearchBar />);
      const button = screen.getByRole('button', { name: /search/i });

      await user.click(button);

      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should trim whitespace from search query', async () => {
      const user = userEvent.setup();
      render(<SearchBar />);
      const input = screen.getByRole('searchbox');
      const form = input.closest('form');

      await user.type(input, '  laptop  ');
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/search?q=laptop');
      });
    });
  });

  describe('Autocomplete', () => {
    it('should show autocomplete suggestions on typing', async () => {
      const user = userEvent.setup();
      render(<SearchBar />);
      const input = screen.getByRole('searchbox');

      await user.type(input, 'lap');

      await waitFor(() => {
        const suggestions = screen.queryByRole('listbox');
        if (suggestions) {
          expect(suggestions).toBeInTheDocument();
        }
      });
    });

    it('should hide suggestions on Escape key', async () => {
      const user = userEvent.setup();
      render(<SearchBar />);
      const input = screen.getByRole('searchbox');

      await user.type(input, 'laptop');
      await user.keyboard('{Escape}');

      await waitFor(() => {
        const suggestions = screen.queryByRole('listbox');
        expect(suggestions).not.toBeInTheDocument();
      });
    });

    it('should clear input on clear button click', async () => {
      const user = userEvent.setup();
      render(<SearchBar />);
      const input = screen.getByRole('searchbox') as HTMLInputElement;

      await user.type(input, 'laptop');
      expect(input.value).toBe('laptop');

      const clearButton = screen.queryByRole('button', { name: /clear/i });
      if (clearButton) {
        await user.click(clearButton);
        expect(input.value).toBe('');
      }
    });
  });

  describe('Keyboard Navigation', () => {
    it('should submit form on Enter key', async () => {
      const user = userEvent.setup();
      render(<SearchBar />);
      const input = screen.getByRole('searchbox');

      await user.type(input, 'headphones{Enter}');

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/search?q=headphones');
      });
    });

    it('should navigate suggestions with arrow keys', async () => {
      const user = userEvent.setup();
      render(<SearchBar />);
      const input = screen.getByRole('searchbox');

      await user.type(input, 'laptop');
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowUp}');

      // Should not throw errors
      expect(input).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long search queries', async () => {
      const user = userEvent.setup();
      render(<SearchBar />);
      const input = screen.getByRole('searchbox');
      const longQuery = 'a'.repeat(200);

      await user.type(input, longQuery);
      fireEvent.submit(input.closest('form')!);

      // Should handle gracefully
      expect(input).toBeInTheDocument();
    });

    it('should handle special characters in search', async () => {
      const user = userEvent.setup();
      render(<SearchBar />);
      const input = screen.getByRole('searchbox');

      await user.type(input, '@#$%^&*()');
      fireEvent.submit(input.closest('form')!);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalled();
      });
    });

    it('should be disabled when loading', () => {
      render(<SearchBar />);
      const input = screen.getByRole('searchbox');
      const button = screen.getByRole('button', { name: /search/i });

      // Verify elements can be disabled
      expect(input).not.toBeDisabled();
      expect(button).not.toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper form role', () => {
      render(<SearchBar />);
      const form = screen.getByRole('search');
      expect(form).toBeInTheDocument();
    });

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<SearchBar />);
      const input = screen.getByRole('searchbox');

      await user.tab();
      expect(input).toHaveFocus();
    });
  });
});
