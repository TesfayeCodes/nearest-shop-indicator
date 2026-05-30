"use client";

import { useState, useEffect } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, error: "Geolocation not supported" }));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setState({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          error: null,
        }),
      (err) => setState((s) => ({ ...s, error: err.message }))
    );
  }, []);

  return state;
}
