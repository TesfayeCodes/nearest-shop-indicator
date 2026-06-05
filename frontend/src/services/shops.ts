import { api } from "./api-client";

export interface ShopResponse {
  id: number;
  name: string;
  category: string | null;
  category_name: string | null;
  icon: string | null;
  latitude: number;
  longitude: number;
  address: string | null;
  phone: string | null;
  image_url: string | null;
  rating: number;
  review_count: number;
  is_open: boolean;
  closing_time: string | null;
  distance?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

export interface CategoryResponse {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
}

export interface ReviewResponse {
  id: number;
  rating: number;
  comment: string | null;
  user_id: number;
  user_name: string | null;
  created_at: string;
}

export const shopsApi = {
  list: (params?: { category?: string; search?: string; page?: number; page_size?: number }) => {
    const q = new URLSearchParams();
    if (params?.category) q.set("category", params.category);
    if (params?.search) q.set("search", params.search);
    if (params?.page) q.set("page", String(params.page));
    if (params?.page_size) q.set("page_size", String(params.page_size));
    const qs = q.toString();
    return api.get<PaginatedResult<ShopResponse>>(`/shops${qs ? `?${qs}` : ""}`);
  },

  nearby: (lat: number, lng: number, radius?: number, category?: string, limit?: number) => {
    const q = new URLSearchParams({ lat: String(lat), lng: String(lng) });
    if (radius) q.set("radius", String(radius));
    if (category) q.set("category", category);
    if (limit) q.set("limit", String(limit));
    return api.get<{ items: ShopResponse[]; total: number }>(`/shops/nearby?${q}`);
  },

  getById: (id: number) => api.get<ShopResponse>(`/shops/${id}`),

  create: (data: {
    name: string;
    category_slug?: string;
    latitude: number;
    longitude: number;
    address?: string;
    phone?: string;
    image_url?: string;
  }) => api.post<{ id: number; name: string }>("/shops", data),

  update: (id: number, data: Partial<ShopResponse>) =>
    api.put<{ id: number; name: string }>(`/shops/${id}`, data),

  delete: (id: number) => api.delete<void>(`/shops/${id}`),

  categories: () => api.get<CategoryResponse[]>("/shops/categories"),

  toggleFavorite: (shopId: number) =>
    api.post<{ favorited: boolean }>(`/shops/${shopId}/favorite`),

  getFavorites: () =>
    api.get<{ items: ShopResponse[]; total: number }>("/shops/favorites"),

  getReviews: (shopId: number, page?: number, page_size?: number) => {
    const q = new URLSearchParams();
    if (page) q.set("page", String(page));
    if (page_size) q.set("page_size", String(page_size));
    const qs = q.toString();
    return api.get<PaginatedResult<ReviewResponse>>(`/shops/${shopId}/reviews${qs ? `?${qs}` : ""}`);
  },

  createReview: (shopId: number, data: { rating: number; comment?: string }) =>
    api.post<ReviewResponse>(`/shops/${shopId}/reviews`, data),
};
