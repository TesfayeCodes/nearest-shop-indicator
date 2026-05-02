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
export declare class ApiClient {
    private baseUrl;
    constructor(baseUrl?: string);
    private request;
    getNearbyShops(location: Location, radius?: number, page?: number, limit?: number): Promise<ShopsResponse>;
    searchShops(location: Location, filters?: SearchFilters, page?: number, limit?: number): Promise<ShopsResponse>;
    getShopById(shopId: string): Promise<ShopResponse>;
    getShopCategories(): Promise<{
        categories: string[];
    }>;
    getHealth(): Promise<{
        status: string;
        timestamp: string;
    }>;
}
export declare const api: ApiClient;
export default api;
//# sourceMappingURL=api.d.ts.map