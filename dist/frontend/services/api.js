"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = exports.ApiClient = void 0;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
class ApiClient {
    constructor(baseUrl = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };
        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({
                    error: 'Unknown error',
                    message: `HTTP ${response.status}`,
                }));
                throw new Error(errorData.message || errorData.error || `Request failed with status ${response.status}`);
            }
            return response.json();
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('An unexpected error occurred');
        }
    }
    async getNearbyShops(location, radius = 5000, page = 1, limit = 20) {
        const params = new URLSearchParams({
            lat: location.latitude.toString(),
            lng: location.longitude.toString(),
            radius: radius.toString(),
            page: page.toString(),
            limit: limit.toString(),
        });
        return this.request(`/shops/nearby?${params}`);
    }
    async searchShops(location, filters = {}, page = 1, limit = 20) {
        const params = new URLSearchParams({
            lat: location.latitude.toString(),
            lng: location.longitude.toString(),
            page: page.toString(),
            limit: limit.toString(),
        });
        if (filters.category)
            params.append('category', filters.category);
        if (filters.minRating !== undefined)
            params.append('minRating', filters.minRating.toString());
        if (filters.isOpen !== undefined)
            params.append('isOpen', filters.isOpen.toString());
        if (filters.maxDistance !== undefined)
            params.append('maxDistance', filters.maxDistance.toString());
        return this.request(`/shops/search?${params}`);
    }
    async getShopById(shopId) {
        return this.request(`/shops/${shopId}`);
    }
    async getShopCategories() {
        return this.request('/shops/categories');
    }
    async getHealth() {
        return this.request('/health');
    }
}
exports.ApiClient = ApiClient;
exports.api = new ApiClient();
exports.default = exports.api;
//# sourceMappingURL=api.js.map