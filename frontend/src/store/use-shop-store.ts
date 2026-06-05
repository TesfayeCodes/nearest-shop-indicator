"use client";

import { create } from "zustand";
import { type Shop } from "@/types/shop";
import { shopsApi } from "@/services/shops";

interface ShopStore {
  shops: Shop[];
  filteredShops: Shop[];
  selectedShop: Shop | null;
  activeCategory: string | null;
  searchQuery: string;
  favorites: number[];
  loading: boolean;
  setShops: (shops: Shop[]) => void;
  setSelectedShop: (shop: Shop | null) => void;
  setActiveCategory: (cat: string | null) => void;
  setSearchQuery: (q: string) => void;
  toggleFavorite: (id: number) => Promise<void>;
  fetchNearby: (lat: number, lng: number, radius?: number) => Promise<void>;
}

export const useShopStore = create<ShopStore>((set) => ({
  shops: [],
  filteredShops: [],
  selectedShop: null,
  activeCategory: null,
  searchQuery: "",
  favorites: [],
  loading: false,

  setShops: (shops) =>
    set({ shops, filteredShops: shops }),

  setSelectedShop: (selectedShop) => set({ selectedShop }),

  setActiveCategory: (activeCategory) =>
    set((state) => {
      let filtered = state.shops;
      if (activeCategory) {
        filtered = filtered.filter(
          (s) => s.category?.toLowerCase() === activeCategory.toLowerCase()
        );
      }
      if (state.searchQuery) {
        filtered = filtered.filter((s) =>
          s.name.toLowerCase().includes(state.searchQuery.toLowerCase())
        );
      }
      return { activeCategory, filteredShops: filtered };
    }),

  setSearchQuery: (searchQuery) =>
    set((state) => {
      let filtered = state.shops;
      const activeCat = state.activeCategory;
      if (activeCat) {
        filtered = filtered.filter(
          (s) => s.category?.toLowerCase() === activeCat.toLowerCase()
        );
      }
      if (searchQuery) {
        filtered = filtered.filter((s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      return { searchQuery, filteredShops: filtered };
    }),

  toggleFavorite: async (id) => {
    try {
      const res = await shopsApi.toggleFavorite(id);
      set((state) => ({
        favorites: res.favorited
          ? [...state.favorites, id]
          : state.favorites.filter((f) => f !== id),
      }));
    } catch {
      // silent
    }
  },

  fetchNearby: async (lat, lng, radius = 5) => {
    set({ loading: true });
    try {
      const data = await shopsApi.nearby(lat, lng, radius);
      const shops: Shop[] = data.items.map((s) => ({
        id: s.id,
        name: s.name,
        category: s.category_name || s.category || "Other",
        category_name: s.category_name,
        latitude: s.latitude,
        longitude: s.longitude,
        address: s.address,
        phone: s.phone,
        image_url: s.image_url,
        rating: s.rating,
        review_count: s.review_count,
        is_open: s.is_open,
        closing_time: s.closing_time,
        distance: s.distance,
        icon: s.icon || "📍",
      }));
      set({ shops, filteredShops: shops, loading: false });
    } catch {
      set({ loading: false });
    }
  },
}));
