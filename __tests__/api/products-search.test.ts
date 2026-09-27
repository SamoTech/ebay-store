import { NextRequest } from 'next/server';
import { GET } from '@/app/api/products/search/route';
import { getEbayIntegrationStatus, getHighValueTrendingProducts, searchEbayProducts } from '@/lib/ebay-api';

jest.mock('@/lib/ebay-api', () => ({
  getEbayIntegrationStatus: jest.fn(),
  getHighValueTrendingProducts: jest.fn(),
  searchEbayProducts: jest.fn(),
}));

jest.mock('@/lib/rate-limit', () => ({
  withRateLimit: (handler: (request: Request) => Promise<Response>) => handler,
}));

describe('GET /api/products/search', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(getEbayIntegrationStatus).mockReturnValue({
      mode: 'manual_token',
      marketplaceId: 'EBAY_US',
      missing: [],
      apiType: 'Browse',
    });
  });

  it('routes the high-value-deals intent to the curated high-value feed', async () => {
    const highValueProduct = {
      id: 1000,
      title: 'Gaming laptop',
      price: 1299,
      currency: 'USD',
      image: 'https://example.com/gaming-laptop.jpg',
      category: 'High-Value Trending',
      affiliateLink: 'https://www.ebay.com/itm/high-value',
      description: 'Live high-value product',
      isLive: true,
    };

    jest.mocked(getHighValueTrendingProducts).mockResolvedValue([highValueProduct]);
    jest.mocked(searchEbayProducts).mockResolvedValue([]);

    const response = await GET(
      new NextRequest('http://localhost:3000/api/products/search?q=high-value-deals&limit=8'),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.source).toBe('ebay-high-value-trending');
    expect(body.products).toEqual([highValueProduct]);
    expect(getHighValueTrendingProducts).toHaveBeenCalledWith(8);
    expect(searchEbayProducts).not.toHaveBeenCalled();
  });

  it('normalizes spaces and still recognizes the high-value intent', async () => {
    jest.mocked(getHighValueTrendingProducts).mockResolvedValue([]);
    jest.mocked(searchEbayProducts).mockResolvedValue([]);

    const response = await GET(
      new NextRequest('http://localhost:3000/api/products/search?q=high%20value%20trending&limit=4'),
    );

    expect(response.status).toBe(200);
    expect(getHighValueTrendingProducts).toHaveBeenCalledWith(4);
    expect(searchEbayProducts).not.toHaveBeenCalled();
  });

  it('keeps ordinary keyword search on the existing search path', async () => {
    const keywordProduct = {
      id: 1001,
      title: 'Sony camera',
      price: 899,
      currency: 'USD',
      image: 'https://example.com/camera.jpg',
      category: 'Search',
      affiliateLink: 'https://www.ebay.com/itm/search',
      description: 'Live search product',
      isLive: true,
    };

    jest.mocked(searchEbayProducts).mockResolvedValue([keywordProduct]);
    jest.mocked(getHighValueTrendingProducts).mockResolvedValue([]);

    const response = await GET(
      new NextRequest('http://localhost:3000/api/products/search?q=sony%20camera&limit=6'),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.source).toBe('ebay-api');
    expect(body.products).toEqual([keywordProduct]);
    expect(searchEbayProducts).toHaveBeenCalledWith('sony camera', 6);
    expect(getHighValueTrendingProducts).not.toHaveBeenCalled();
  });
});
