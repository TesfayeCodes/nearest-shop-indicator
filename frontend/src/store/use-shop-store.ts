import { create } from "zustand";

interface Shop {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
}

interface ShopStore {
  shops: Shop[];
  setShops: (shops: Shop[]) => void;
  selectedShop: Shop | null;
  setSelectedShop: (shop: Shop | null) => void;
}

export const useShopStore = create<ShopStore>((set) => ({
  shops: [],
  setShops: (shops) => set({ shops }),
  selectedShop: null,
  setSelectedShop: (selectedShop) => set({ selectedShop }),
}));
