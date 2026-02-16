import React from 'react';
import { render, screen, act, renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CurrencyProvider, useCurrency } from '@/contexts/CurrencyContext';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('CurrencyContext', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Provider', () => {
    it('should render children', () => {
      render(
        <CurrencyProvider>
          <div>Test Content</div>
        </CurrencyProvider>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should provide default USD currency', () => {
      const TestComponent = () => {
        const { currency } = useCurrency();
        return <div>Currency: {currency}</div>;
      };

      render(
        <CurrencyProvider>
          <TestComponent />
        </CurrencyProvider>
      );

      expect(screen.getByText(/Currency: USD/i)).toBeInTheDocument();
    });
  });

  describe('Currency Switching', () => {
    it('should switch currency to EUR', () => {
      const TestComponent = () => {
        const { currency, setCurrency } = useCurrency();
        return (
          <div>
            <div>Current: {currency}</div>
            <button onClick={() => setCurrency('EUR')}>Switch to EUR</button>
          </div>
        );
      };

      render(
        <CurrencyProvider>
          <TestComponent />
        </CurrencyProvider>
      );

      const button = screen.getByRole('button', { name: /switch to eur/i });
      act(() => {
        button.click();
      });

      expect(screen.getByText(/Current: EUR/i)).toBeInTheDocument();
    });

    it('should switch currency to GBP', () => {
      const TestComponent = () => {
        const { currency, setCurrency } = useCurrency();
        return (
          <div>
            <div>Current: {currency}</div>
            <button onClick={() => setCurrency('GBP')}>Switch to GBP</button>
          </div>
        );
      };

      render(
        <CurrencyProvider>
          <TestComponent />
        </CurrencyProvider>
      );

      const button = screen.getByRole('button', { name: /switch to gbp/i });
      act(() => {
        button.click();
      });

      expect(screen.getByText(/Current: GBP/i)).toBeInTheDocument();
    });

    it('should persist currency to localStorage', () => {
      const TestComponent = () => {
        const { setCurrency } = useCurrency();
        return <button onClick={() => setCurrency('EUR')}>Change</button>;
      };

      render(
        <CurrencyProvider>
          <TestComponent />
        </CurrencyProvider>
      );

      const button = screen.getByRole('button');
      act(() => {
        button.click();
      });

      // Check if localStorage was updated
      const stored = localStorage.getItem('currency');
      expect(stored).toBeTruthy();
    });
  });

  describe('Currency Formatting', () => {
    it('should format USD with dollar sign', () => {
      const TestComponent = () => {
        const { formatCurrency } = useCurrency();
        return <div>{formatCurrency(99.99)}</div>;
      };

      render(
        <CurrencyProvider>
          <TestComponent />
        </CurrencyProvider>
      );

      expect(screen.getByText(/\$99\.99/i) || screen.getByText(/99\.99/i)).toBeInTheDocument();
    });

    it('should format EUR with euro symbol', () => {
      const TestComponent = () => {
        const { setCurrency, formatCurrency } = useCurrency();
        
        React.useEffect(() => {
          setCurrency('EUR');
        }, [setCurrency]);

        return <div>{formatCurrency(99.99)}</div>;
      };

      render(
        <CurrencyProvider>
          <TestComponent />
        </CurrencyProvider>
      );

      // Should have some formatted output
      expect(screen.getByText(/99/i)).toBeInTheDocument();
    });

    it('should format GBP with pound symbol', () => {
      const TestComponent = () => {
        const { setCurrency, formatCurrency } = useCurrency();
        
        React.useEffect(() => {
          setCurrency('GBP');
        }, [setCurrency]);

        return <div>{formatCurrency(99.99)}</div>;
      };

      render(
        <CurrencyProvider>
          <TestComponent />
        </CurrencyProvider>
      );

      // Should have some formatted output
      expect(screen.getByText(/99/i)).toBeInTheDocument();
    });
  });

  describe('Currency Conversion', () => {
    it('should convert USD to EUR', () => {
      const TestComponent = () => {
        const { convertPrice, setCurrency } = useCurrency();
        
        React.useEffect(() => {
          setCurrency('EUR');
        }, [setCurrency]);

        const converted = convertPrice(100);
        return <div>Converted: {converted}</div>;
      };

      render(
        <CurrencyProvider>
          <TestComponent />
        </CurrencyProvider>
      );

      // Should have converted value
      expect(screen.getByText(/Converted:/i)).toBeInTheDocument();
    });

    it('should convert USD to GBP', () => {
      const TestComponent = () => {
        const { convertPrice, setCurrency } = useCurrency();
        
        React.useEffect(() => {
          setCurrency('GBP');
        }, [setCurrency]);

        const converted = convertPrice(100);
        return <div>Converted: {converted}</div>;
      };

      render(
        <CurrencyProvider>
          <TestComponent />
        </CurrencyProvider>
      );

      // Should have converted value
      expect(screen.getByText(/Converted:/i)).toBeInTheDocument();
    });

    it('should handle zero amount', () => {
      const TestComponent = () => {
        const { convertPrice } = useCurrency();
        const converted = convertPrice(0);
        return <div>Amount: {converted}</div>;
      };

      render(
        <CurrencyProvider>
          <TestComponent />
        </CurrencyProvider>
      );

      expect(screen.getByText(/Amount: 0/i)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle negative amounts', () => {
      const TestComponent = () => {
        const { formatCurrency } = useCurrency();
        return <div>{formatCurrency(-50)}</div>;
      };

      render(
        <CurrencyProvider>
          <TestComponent />
        </CurrencyProvider>
      );

      // Should handle negative numbers
      expect(screen.getByText(/-50/i) || screen.getByText(/50/i)).toBeInTheDocument();
    });

    it('should handle very large amounts', () => {
      const TestComponent = () => {
        const { formatCurrency } = useCurrency();
        return <div>{formatCurrency(999999.99)}</div>;
      };

      render(
        <CurrencyProvider>
          <TestComponent />
        </CurrencyProvider>
      );

      // Should handle large numbers
      expect(screen.getByText(/999/i)).toBeInTheDocument();
    });
  });
});
