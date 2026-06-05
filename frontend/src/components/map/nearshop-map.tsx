"use client";

import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { type Shop } from "@/types/shop";

const defaultIcon = L.divIcon({
  html: '<div style="width:24px;height:24px;border-radius:50%;background:#3b82f6;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  className: "",
});

const shopIcon = (isOpen: boolean) =>
  L.divIcon({
    html: `<div style="width:32px;height:32px;border-radius:50%;background:${isOpen ? "#10b981" : "#ef4444"};border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:14px">📍</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    className: "",
  });

function LocationPulse({ lat, lng }: { lat: number; lng: number }) {
  return (
    <Circle
      center={[lat, lng]}
      radius={50}
      pathOptions={{ color: "#3b82f6", fillOpacity: 0.1, weight: 2 }}
    />
  );
}

function FitBounds({ shops, userLat, userLng }: { shops: Shop[]; userLat?: number; userLng?: number }) {
  const map = useMap();
  useEffect(() => {
    if (shops.length === 0) return;
    const bounds = L.latLngBounds(
      shops.map((s) => [s.latitude, s.longitude] as [number, number])
    );
    if (userLat !== undefined && userLng !== undefined) {
      bounds.extend([userLat, userLng]);
    }
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [shops, userLat, userLng, map]);
  return null;
}

interface NearShopMapProps {
  shops: Shop[];
  selectedShop?: Shop | null;
  onSelectShop?: (shop: Shop) => void;
  userLatitude?: number;
  userLongitude?: number;
  height?: string;
  interactive?: boolean;
}

export function NearShopMap({
  shops,
  selectedShop,
  onSelectShop,
  userLatitude,
  userLongitude,
  height = "400px",
  interactive = true,
}: NearShopMapProps) {
  const center: [number, number] = useMemo(() => {
    if (userLatitude && userLongitude) return [userLatitude, userLongitude];
    if (shops.length > 0) return [shops[0].latitude, shops[0].longitude];
    return [9.03, 38.74];
  }, [userLatitude, userLongitude, shops]);

  return (
    <div style={{ height, width: "100%" }}>
      <MapContainer
        center={center}
        zoom={14}
        className="w-full h-full rounded-xl"
        zoomControl={interactive}
        dragging={interactive}
        scrollWheelZoom={interactive}
        doubleClickZoom={interactive}
        touchZoom={interactive}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds shops={shops} userLat={userLatitude} userLng={userLongitude} />

        {userLatitude && userLongitude && (
          <>
            <Marker position={[userLatitude, userLongitude]} icon={defaultIcon} />
            <LocationPulse lat={userLatitude} lng={userLongitude} />
          </>
        )}

        {shops.map((s) => (
          <Marker
            key={s.id}
            position={[s.latitude, s.longitude]}
            icon={shopIcon(s.is_open)}
            eventHandlers={{
              click: () => onSelectShop?.(s),
            }}
          >
            {(selectedShop?.id === s.id || (!selectedShop && shops.indexOf(s) === 0)) && (
              <Popup>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</div>
                <div style={{ fontSize: 11, color: "#666" }}>
                  {s.category} · {s.rating} ★
                  {s.distance && ` · ${s.distance.toFixed(1)} km`}
                </div>
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
