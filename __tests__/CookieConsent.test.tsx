import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CookieConsent from './CookieConsent';

describe('CookieConsent', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('shows consent choices when no decision exists', () => {
    render(<CookieConsent />);
    expect(screen.getByRole('button', { name: 'Accept All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reject Non-Essential' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Manage Preferences' })).toBeInTheDocument();
  });

  it('persists accept-all consent and emits the consent event', async () => {
    const listener = jest.fn();
    window.addEventListener('saleh-cookie-consent', listener);

    render(<CookieConsent />);
    fireEvent.click(screen.getByRole('button', { name: 'Accept All' }));

    await waitFor(() => {
      expect(JSON.parse(window.localStorage.getItem('saleh_cookie_consent_v1') || '{}')).toEqual({
        analytics: true,
        affiliate: true,
      });
    });
    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener('saleh-cookie-consent', listener);
  });

  it('allows independent analytics and affiliate choices', async () => {
    render(<CookieConsent />);
    fireEvent.click(screen.getByRole('button', { name: 'Manage Preferences' }));

    const analytics = screen.getByRole('checkbox', { name: /Analytics/i });
    const affiliate = screen.getByRole('checkbox', { name: /Affiliate attribution/i });

    fireEvent.click(analytics);
    fireEvent.click(screen.getByRole('button', { name: 'Save Preferences' }));

    await waitFor(() => {
      expect(JSON.parse(window.localStorage.getItem('saleh_cookie_consent_v1') || '{}')).toEqual({
        analytics: true,
        affiliate: false,
      });
    });

    expect(affiliate).not.toBeChecked();
  });
});
