"use client";

import { create } from "zustand";
import { type Shop } from "@/types/shop";

interface ShopStore {
  shops: Shop[];
  filteredShops: Shop[];
  selectedShop: Shop | null;
  activeCategory: string | null;
  searchQuery: string;
  setShops: (shops: Shop[]) => void;
  setSelectedShop: (shop: Shop | null) => void;
  setActiveCategory: (cat: string | null) => void;
  setSearchQuery: (q: string) => void;
  toggleFavorite: (id: number) => void;
  favorites: number[];
}

export const useShopStore = create<ShopStore>((set) => ({
  shops: [],
  filteredShops: [],
  selectedShop: null,
  activeCategory: null,
  searchQuery: "",
  favorites: [],
  setShops: (shops) =>
    set({ shops, filteredShops: shops }),
  setSelectedShop: (selectedShop) => set({ selectedShop }),
  setActiveCategory: (activeCategory) =>
    set((state) => {
      let filtered = state.shops;
      if (activeCategory) {
        filtered = filtered.filter(
          (s) => s.category.toLowerCase() === activeCategory.toLowerCase()
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
      if (state.activeCategory) {
        filtered = filtered.filter(
          (s) => s.category.toLowerCase() === state.activeCategory.toLowerCase()
        );
      }
      if (searchQuery) {
        filtered = filtered.filter((s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      return { searchQuery, filteredShops: filtered };
    }),
  toggleFavorite: (id) =>
    set((state) => ({
      favorites: state.favorites.includes(id)
        ? state.favorites.filter((f) => f !== id)
        : [...state.favorites, id],
    })),
}));
