import { ApiClient, Shop, ShopsResponse, ShopResponse, Location, SearchFilters } from '../services/api';

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('ApiClient', () => {
  let client: ApiClient;
  const mockLocation: Location = { latitude: 40.7128, longitude: -74.006 };

  beforeEach(() => {
    client = new ApiClient('http://localhost:8000/api/v1');
    mockFetch.mockReset();
  });

  describe('getNearbyShops', () => {
    it('should fetch nearby shops with default parameters', async () => {
      const mockResponse: ShopsResponse = {
        shops: [
          { id: '1', name: 'Shop A', address: '123 Main St', latitude: 40.7128, longitude: -74.006, distance: 100 },
        ],
        total: 1,
        page: 1,
        limit: 20,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.getNearbyShops(mockLocation);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/shops/nearby?lat=40.7128&lng=-74.006&radius=5000&page=1&limit=20',
        expect.objectContaining({ headers: expect.objectContaining({ 'Content-Type': 'application/json' }) })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should fetch nearby shops with custom radius and pagination', async () => {
      const mockResponse: ShopsResponse = {
        shops: [],
        total: 0,
        page: 2,
        limit: 10,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.getNearbyShops(mockLocation, 1000, 2, 10);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/shops/nearby?lat=40.7128&lng=-74.006&radius=1000&page=2&limit=10',
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error on failed request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Internal Server Error', message: 'Server error' }),
      });

      await expect(client.getNearbyShops(mockLocation)).rejects.toThrow('Server error');
    });
  });

  describe('searchShops', () => {
    it('should search shops with filters', async () => {
      const mockResponse: ShopsResponse = {
        shops: [
          { id: '2', name: 'Coffee Shop', address: '456 Oak Ave', latitude: 40.7130, longitude: -74.005, category: 'cafe' },
        ],
        total: 1,
        page: 1,
        limit: 20,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const filters: SearchFilters = { category: 'cafe', minRating: 4.0, isOpen: true };
      const result = await client.searchShops(mockLocation, filters);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/shops/search?'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('category=cafe'),
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse);
    });

    it('should search shops without filters', async () => {
      const mockResponse: ShopsResponse = { shops: [], total: 0, page: 1, limit: 20 };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.searchShops(mockLocation);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/shops/search?'),
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getShopById', () => {
    it('should fetch a single shop by ID', async () => {
      const mockResponse: ShopResponse = {
        shop: { id: '1', name: 'Shop A', address: '123 Main St', latitude: 40.7128, longitude: -74.006 },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.getShopById('1');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/shops/1',
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when shop not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Not Found', message: 'Shop not found' }),
      });

      await expect(client.getShopById('999')).rejects.toThrow('Shop not found');
    });
  });

  describe('getShopCategories', () => {
    it('should fetch shop categories', async () => {
      const mockResponse = { categories: ['cafe', 'restaurant', 'grocery', 'pharmacy'] };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.getShopCategories();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/shops/categories',
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getHealth', () => {
    it('should check API health', async () => {
      const mockResponse = { status: 'ok', timestamp: '2026-05-02T12:00:00Z' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.getHealth();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/health',
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(client.getNearbyShops(mockLocation)).rejects.toThrow('Network error');
    });

    it('should handle malformed JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      await expect(client.getNearbyShops(mockLocation)).rejects.toThrow('HTTP 500');
    });
  });
});

describe('ApiClient default export', () => {
  it('should export a default api instance', async () => {
    const { default: api } = await import('../services/api');
    expect(api).toBeDefined();
    expect(api.getNearbyShops).toBeDefined();
    expect(api.searchShops).toBeDefined();
    expect(api.getShopById).toBeDefined();
    expect(api.getShopCategories).toBeDefined();
    expect(api.getHealth).toBeDefined();
  });
});
