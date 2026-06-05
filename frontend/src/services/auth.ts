import { api } from "./api-client";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
}

export interface UserResponse {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export const authApi = {
  login: (data: LoginPayload) =>
    api.post<TokenResponse>("/auth/login", data),

  register: (data: RegisterPayload) =>
    api.post<UserResponse>("/auth/register", data),

  getMe: () => api.get<UserResponse>("/auth/me"),

  updateMe: (data: { full_name?: string }) =>
    api.patch<UserResponse>("/auth/me", data),
};
