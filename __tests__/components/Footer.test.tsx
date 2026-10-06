import { render, screen } from '@testing-library/react';
import Footer from '@/components/Footer';

describe('Footer', () => {
  it('renders accessible footer content without advertising or placeholder social links', () => {
    render(<Footer />);

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contact page' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Advertise' })).not.toBeInTheDocument();
    expect(screen.queryAllByRole('link', { name: /Facebook|Twitter|Instagram/i })).toHaveLength(0);
    expect(screen.queryByText(/Site visits:/i)).not.toBeInTheDocument();
  });
});
