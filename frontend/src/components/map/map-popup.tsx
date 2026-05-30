"use client";

import { type Shop } from "@/types/shop";
import { IconStar, IconNavigation, IconWalk, IconClock } from "@tabler/icons-react";

interface MapPopupProps {
  shop: Shop;
  onNavigate?: () => void;
  onClose?: () => void;
}

export function MapPopup({ shop, onNavigate }: MapPopupProps) {
  return (
    <div
      className="absolute bottom-4 left-3 right-3 rounded-2xl p-4 flex gap-3"
      style={{
        background: "rgba(8,15,34,0.92)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      <div
        className="w-[52px] h-[52px] rounded-xl flex-shrink-0 flex items-center justify-center text-2xl"
        style={{ background: "rgba(59,130,246,0.15)" }}
      >
        <span style={{ fontSize: 24 }}>{shop.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-extrabold tracking-tight text-text mb-1">
          {shop.name}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-0.5" style={{ color: "#fbbf24" }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <IconStar
                key={i}
                size={10}
                fill={i < Math.floor(shop.rating) ? "#fbbf24" : "none"}
                color={i < Math.floor(shop.rating) ? "#fbbf24" : "rgba(255,255,255,0.1)"}
              />
            ))}
          </span>
          <span className="text-[11px] text-text2">{shop.rating}</span>
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
            style={{
              background: shop.open
                ? "rgba(16,185,129,0.1)"
                : "rgba(239,68,68,0.1)",
              color: shop.open ? "#34d399" : "#fca5a5",
              border: shop.open
                ? "1px solid rgba(16,185,129,0.2)"
                : "1px solid rgba(239,68,68,0.2)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "currentColor" }} />
            {shop.open ? "Open" : "Closed"}
          </span>
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
            style={{
              background: "rgba(139,92,246,0.12)",
              color: "#c4b5fd",
              border: "1px solid rgba(139,92,246,0.2)",
            }}
          >
            {shop.category}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1.5 text-xs text-text2">
          <span className="flex items-center gap-1 font-bold" style={{ color: "#60a5fa" }}>
            <IconWalk size={13} /> {shop.distance?.toFixed(1)} km
          </span>
          <span className="flex items-center gap-1">
            <IconClock size={13} /> ~{shop.walkTime}
          </span>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            className="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white border-none cursor-pointer transition-colors"
            style={{ background: "#3b82f6" }}
            onClick={onNavigate}
          >
            <IconNavigation size={13} /> Navigate
          </button>
          <button
            className="flex-1 px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#f8fafc",
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
