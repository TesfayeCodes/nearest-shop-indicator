import { api } from "./api-client";
import type { UserResponse } from "./auth";

export interface UserAdminResponse {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

export const usersApi = {
  list: (page?: number, pageSize?: number) => {
    const q = new URLSearchParams();
    if (page) q.set("page", String(page));
    if (pageSize) q.set("page_size", String(pageSize));
    const qs = q.toString();
    return api.get<PaginatedResult<UserAdminResponse>>(`/users${qs ? `?${qs}` : ""}`);
  },

  getById: (id: number) => api.get<UserAdminResponse>(`/users/${id}`),

  update: (id: number, data: { full_name?: string; is_active?: boolean; is_admin?: boolean }) =>
    api.patch<UserAdminResponse>(`/users/${id}`, data),

  deactivate: (id: number) => api.delete<void>(`/users/${id}`),
};
