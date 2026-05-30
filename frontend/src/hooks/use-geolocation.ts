"use client";

import { create } from "zustand";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
  setLocation: (lat: number, lon: number) => void;
  setError: (err: string) => void;
  setLoading: (v: boolean) => void;
}

export const useGeolocationStore = create<GeolocationState>((set) => ({
  latitude: null,
  longitude: null,
  error: null,
  loading: false,
  setLocation: (latitude, longitude) =>
    set({ latitude, longitude, error: null, loading: false }),
  setError: (error) => set({ error, loading: false }),
  setLoading: (loading) => set({ loading }),
}));
