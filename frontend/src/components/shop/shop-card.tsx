"use client";

import { type Shop } from "@/types/shop";
import { IconStar, IconWalk } from "@tabler/icons-react";

const categoryColors: Record<string, string> = {
  Grocery: "rgba(59,130,246,0.1)",
  Cafe: "rgba(16,185,129,0.1)",
  Pharmacy: "rgba(139,92,246,0.1)",
  Restaurant: "rgba(245,158,11,0.1)",
  Bookstore: "rgba(239,68,68,0.08)",
  Electronics: "rgba(236,72,153,0.08)",
};

const categoryIconColors: Record<string, string> = {
  Grocery: "#60a5fa",
  Cafe: "#34d399",
  Pharmacy: "#c4b5fd",
  Restaurant: "#fcd34d",
  Bookstore: "#fca5a5",
  Electronics: "#f472b6",
};

interface ShopCardProps {
  shop: Shop;
  onSelect?: (shop: Shop) => void;
}

export function ShopCard({ shop, onSelect }: ShopCardProps) {
  return (
    <div
      className="flex items-center gap-3 px-4.5 py-3.5 cursor-pointer transition-colors duration-150 border-b border-[rgba(255,255,255,0.07)] last:border-b-0 hover:bg-white/[0.02]"
      onClick={() => onSelect?.(shop)}
    >
      <div
        className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center text-xl"
        style={{
          background: (shop.category && categoryColors[shop.category]) || "rgba(59,130,246,0.1)",
        }}
      >
        <span style={{ fontSize: 20 }}>{shop.icon || "📍"}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-bold tracking-tight text-text mb-0.5">
          {shop.name}
        </div>
        <div className="flex items-center gap-2 text-[11px] text-text2 flex-wrap">
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
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
            style={{
              background: shop.is_open
                ? "rgba(16,185,129,0.1)"
                : "rgba(239,68,68,0.1)",
              color: shop.is_open ? "#34d399" : "#fca5a5",
              border: shop.is_open
                ? "1px solid rgba(16,185,129,0.2)"
                : "1px solid rgba(239,68,68,0.2)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "currentColor" }}
            />
            {shop.is_open ? "Open" : "Closed"}
          </span>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-[13px] font-bold" style={{ color: "#60a5fa" }}>
          {shop.distance?.toFixed(1)} km
        </div>
        <div className="text-[11px] text-text2 mt-0.5 flex items-center gap-0.5 justify-end">
          <IconWalk size={11} /> {shop.distance ? `${Math.round(shop.distance * 12)} min` : "—"}
        </div>
      </div>
    </div>
  );
}
