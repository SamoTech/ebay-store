import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ErrorBoundary, PageErrorBoundary, ComponentErrorBoundary } from '@/components/ErrorBoundary'

/**
 * Test Suite: ErrorBoundary Component
 * 
 * Tests error catching, fallback UI, and error recovery
 */

// Component that throws an error
const ThrowError = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

describe('ErrorBoundary', () => {
  // Suppress console.error for cleaner test output
  const originalError = console.error
  beforeAll(() => {
    console.error = jest.fn()
  })
  afterAll(() => {
    console.error = originalError
  })

  describe('Normal Operation', () => {
    it('should render children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div>Test Content</div>
        </ErrorBoundary>
      )
      
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('should not show error UI when everything works', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      )
      
      expect(screen.getByText('No error')).toBeInTheDocument()
      expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('should catch errors and display fallback UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )
      
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
      expect(screen.queryByText('No error')).not.toBeInTheDocument()
    })

    it('should display error message in fallback UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )
      
      expect(screen.getByText(/oops! something went wrong/i)).toBeInTheDocument()
    })

    it('should show Try Again button in error state', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )
      
      const tryAgainButton = screen.getByRole('button', { name: /try again/i })
      expect(tryAgainButton).toBeInTheDocument()
    })

    it('should show Go Home button in error state', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )
      
      const goHomeButton = screen.getByRole('button', { name: /go home/i })
      expect(goHomeButton).toBeInTheDocument()
    })
  })

  describe('Custom Fallback', () => {
    it('should render custom fallback when provided', () => {
      const customFallback = <div>Custom Error Message</div>
      
      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )
      
      expect(screen.getByText('Custom Error Message')).toBeInTheDocument()
      expect(screen.queryByText(/oops! something went wrong/i)).not.toBeInTheDocument()
    })
  })

  describe('Error Recovery', () => {
    it('should reset error state when Try Again is clicked', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )
      
      // Error state
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
      
      // Click Try Again
      const tryAgainButton = screen.getByRole('button', { name: /try again/i })
      fireEvent.click(tryAgainButton)
      
      // Rerender with no error
      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      )
      
      expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument()
    })
  })

  describe('PageErrorBoundary', () => {
    it('should render children normally', () => {
      render(
        <PageErrorBoundary>
          <div>Page Content</div>
        </PageErrorBoundary>
      )
      
      expect(screen.getByText('Page Content')).toBeInTheDocument()
    })

    it('should catch errors and show full-page error', () => {
      render(
        <PageErrorBoundary>
          <ThrowError shouldThrow={true} />
        </PageErrorBoundary>
      )
      
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
  })

  describe('ComponentErrorBoundary', () => {
    it('should render children normally', () => {
      render(
        <ComponentErrorBoundary componentName="TestComponent">
          <div>Component Content</div>
        </ComponentErrorBoundary>
      )
      
      expect(screen.getByText('Component Content')).toBeInTheDocument()
    })

    it('should show component name in error message', () => {
      render(
        <ComponentErrorBoundary componentName="TestComponent">
          <ThrowError shouldThrow={true} />
        </ComponentErrorBoundary>
      )
      
      expect(screen.getByText(/failed to load TestComponent/i)).toBeInTheDocument()
    })

    it('should show generic message when no component name provided', () => {
      render(
        <ComponentErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ComponentErrorBoundary>
      )
      
      expect(screen.getByText(/failed to load component/i)).toBeInTheDocument()
    })
  })

  describe('Error Callback', () => {
    it('should call onError callback when error occurs', () => {
      const onErrorMock = jest.fn()
      
      render(
        <ErrorBoundary onError={onErrorMock}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )
      
      expect(onErrorMock).toHaveBeenCalled()
      expect(onErrorMock).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String)
        })
      )
    })
  })
})
