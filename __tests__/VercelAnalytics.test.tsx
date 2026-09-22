import { render, screen } from '@testing-library/react';
import VercelAnalytics from '../components/VercelAnalytics';

const useCookieConsent = jest.fn();
jest.mock('@/lib/cookie-consent', () => ({
  useCookieConsent: () => useCookieConsent(),
}));

jest.mock('@vercel/analytics/next', () => ({
  Analytics: () => <div data-testid="vercel-analytics" />,
}));

jest.mock('@vercel/speed-insights/next', () => ({
  SpeedInsights: () => <div data-testid="speed-insights" />,
}));

describe('VercelAnalytics', () => {
  it('does not render analytics before analytics consent', () => {
    useCookieConsent.mockReturnValue({ analytics: false, affiliate: false });

    render(<VercelAnalytics />);

    expect(screen.queryByTestId('vercel-analytics')).not.toBeInTheDocument();
    expect(screen.queryByTestId('speed-insights')).not.toBeInTheDocument();
  });

  it('renders analytics after analytics consent', () => {
    useCookieConsent.mockReturnValue({ analytics: true, affiliate: false });

    render(<VercelAnalytics />);

    expect(screen.getByTestId('vercel-analytics')).toBeInTheDocument();
    expect(screen.getByTestId('speed-insights')).toBeInTheDocument();
  });
});
