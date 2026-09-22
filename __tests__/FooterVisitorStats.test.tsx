import { render, screen, waitFor } from '@testing-library/react';
import FooterVisitorStats from '../components/FooterVisitorStats';

describe('FooterVisitorStats', () => {
  afterEach(() => jest.restoreAllMocks());

  it('shows GA4 visitor statistics when configured', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ configured: true, visitors: 1234, activeNow: 7 }),
    } as Response);

    render(<FooterVisitorStats />);

    await waitFor(() => {
      expect(screen.getByText('Visitors (30 days): 1,234')).toBeInTheDocument();
      expect(screen.getByText('Online now: 7')).toBeInTheDocument();
    });
  });

  it('stays hidden when analytics reporting is unavailable', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({ configured: false }),
    } as Response);

    render(<FooterVisitorStats />);

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(screen.queryByText(/Visitors \(30 days\)/)).not.toBeInTheDocument();
  });
});
