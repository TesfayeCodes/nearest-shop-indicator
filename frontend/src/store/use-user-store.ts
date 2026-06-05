"use client";

import { create } from "zustand";
import type { UserResponse } from "@/services/auth";

interface UserStore {
  user: UserResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: UserResponse | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setToken: (token) => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
    set({ token });
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
