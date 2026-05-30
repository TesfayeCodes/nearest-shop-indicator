"use client";

import { create } from "zustand";

interface LocationStore {
  latitude: number | null;
  longitude: number | null;
  setLocation: (lat: number, lon: number) => void;
}

export const useLocationStore = create<LocationStore>((set) => ({
  latitude: null,
  longitude: null,
  setLocation: (latitude, longitude) => set({ latitude, longitude }),
}));
