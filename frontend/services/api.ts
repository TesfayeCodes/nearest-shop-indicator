const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface Shop {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance?: number;
  rating?: number;
  category?: string;
  isOpen?: boolean;
  phone?: string;
  hours?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface ShopsResponse {
  shops: Shop[];
  total: number;
  page: number;
  limit: number;
}

export interface ShopResponse {
  shop: Shop;
}

export interface ErrorResponse {
  error: string;
  message?: string;
  statusCode?: number;
}

export interface SearchFilters {
  category?: string;
  minRating?: number;
  isOpen?: boolean;
  maxDistance?: number;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json().catch(() => ({
          error: 'Unknown error',
          message: `HTTP ${response.status}`,
        }));
        throw new Error(errorData.message || errorData.error || `Request failed with status ${response.status}`);
      }

      return response.json() as Promise<T>;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async getNearbyShops(
    location: Location,
    radius: number = 5000,
    page: number = 1,
    limit: number = 20
  ): Promise<ShopsResponse> {
    const params = new URLSearchParams({
      lat: location.latitude.toString(),
      lng: location.longitude.toString(),
      radius: radius.toString(),
      page: page.toString(),
      limit: limit.toString(),
    });

    return this.request<ShopsResponse>(`/shops/nearby?${params}`);
  }

  async searchShops(
    location: Location,
    filters: SearchFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<ShopsResponse> {
    const params = new URLSearchParams({
      lat: location.latitude.toString(),
      lng: location.longitude.toString(),
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters.category) params.append('category', filters.category);
    if (filters.minRating !== undefined) params.append('minRating', filters.minRating.toString());
    if (filters.isOpen !== undefined) params.append('isOpen', filters.isOpen.toString());
    if (filters.maxDistance !== undefined) params.append('maxDistance', filters.maxDistance.toString());

    return this.request<ShopsResponse>(`/shops/search?${params}`);
  }

  async getShopById(shopId: string): Promise<ShopResponse> {
    return this.request<ShopResponse>(`/shops/${shopId}`);
  }

  async getShopCategories(): Promise<{ categories: string[] }> {
    return this.request<{ categories: string[] }>('/shops/categories');
  }

  async getHealth(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

export const api = new ApiClient();

export default api;
