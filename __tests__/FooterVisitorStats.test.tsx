import { render, screen, waitFor } from '@testing-library/react';
import FooterVisitorStats from '../components/FooterVisitorStats';

describe('FooterVisitorStats', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    Object.defineProperty(window, 'fetch', { value: undefined, configurable: true });
  });

  it('shows GA4 visitor statistics when configured', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ configured: true, visitors: 1234, activeNow: 7 }),
    });
    Object.defineProperty(window, 'fetch', { value: fetchMock, configurable: true });

    render(<FooterVisitorStats />);

    await waitFor(() => {
      expect(screen.getByText('Visitors (30 days): 1,234')).toBeInTheDocument();
      expect(screen.getByText('Online now: 7')).toBeInTheDocument();
    });
  });

  it('stays hidden when analytics reporting is unavailable', async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: false });
    Object.defineProperty(window, 'fetch', { value: fetchMock, configurable: true });

    render(<FooterVisitorStats />);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/analytics/visitors', { cache: 'no-store' }));
    expect(screen.queryByText(/Visitors \(30 days\)/)).not.toBeInTheDocument();
  });
});
