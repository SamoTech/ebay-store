import { render, screen } from '@testing-library/react';
import Footer from '@/components/Footer';

jest.mock('@/components/VisitCounter', () => ({
  __esModule: true,
  default: () => <p>Site visits: 12,458</p>,
}));

describe('Footer', () => {
  it('renders the real visit metric slot and accessible footer content', () => {
    render(<Footer />);

    expect(screen.getByText('Site visits: 12,458')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Facebook' })).toBeInTheDocument();
  });
});
