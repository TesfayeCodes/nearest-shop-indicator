"use client";

import { type Shop } from "@/types/shop";
import { IconStar, IconWalk, IconHeart } from "@tabler/icons-react";

const categoryColors: Record<string, string> = {
  Grocery: "rgba(59,130,246,0.12)",
  Cafe: "rgba(16,185,129,0.12)",
  Pharmacy: "rgba(139,92,246,0.12)",
  Restaurant: "rgba(245,158,11,0.12)",
  Bookstore: "rgba(239,68,68,0.1)",
  Electronics: "rgba(236,72,153,0.1)",
};

const categoryBorderColors: Record<string, string> = {
  Grocery: "rgba(59,130,246,0.25)",
  Cafe: "rgba(16,185,129,0.25)",
  Pharmacy: "rgba(139,92,246,0.25)",
  Restaurant: "rgba(245,158,11,0.25)",
  Bookstore: "rgba(239,68,68,0.2)",
  Electronics: "rgba(236,72,153,0.2)",
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
  selected?: boolean;
}

export function ShopCard({ shop, onSelect, selected }: ShopCardProps) {
  const catColor = shop.category
    ? categoryColors[shop.category] || "rgba(59,130,246,0.1)"
    : "rgba(59,130,246,0.1)";
  const catBorder = shop.category
    ? categoryBorderColors[shop.category] || "rgba(59,130,246,0.2)"
    : "rgba(59,130,246,0.2)";

  return (
    <div
      className="flex items-center gap-3 px-4.5 py-3.5 cursor-pointer transition-all duration-200 border-b border-[rgba(255,255,255,0.07)] last:border-b-0"
      style={{
        background: selected ? "rgba(59,130,246,0.06)" : "transparent",
        borderLeft: selected ? "3px solid #3b82f6" : "3px solid transparent",
      }}
      onClick={() => onSelect?.(shop)}
      onMouseEnter={(e) => { if (!selected) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
      onMouseLeave={(e) => { if (!selected) e.currentTarget.style.background = "transparent"; }}
    >
      <div
        className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center text-lg relative"
        style={{ background: catColor, border: `1px solid ${catBorder}` }}
      >
        <span>{shop.icon || "📍"}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-bold tracking-tight text-[#f8fafc] mb-0.5 flex items-center gap-1.5">
          {shop.name}
          <span className="text-[10px] px-1.5 py-0.5 rounded-md font-medium" style={{ background: catColor, color: categoryIconColors[shop.category || ""] || "#60a5fa", fontSize: 9 }}>
            {shop.category}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] flex-wrap">
          <span className="flex items-center gap-0.5" style={{ color: "#fbbf24" }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <IconStar
                key={i}
                size={9}
                fill={i < Math.floor(shop.rating) ? "#fbbf24" : "none"}
                color={i < Math.floor(shop.rating) ? "#fbbf24" : "rgba(255,255,255,0.1)"}
              />
            ))}
            <span style={{ color: "#94a3b8", marginLeft: 2 }}>{shop.rating}</span>
          </span>
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold" style={{
            background: shop.is_open ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
            color: shop.is_open ? "#34d399" : "#fca5a5",
            border: `1px solid ${shop.is_open ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
          }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "currentColor" }} />
            {shop.is_open ? "Open" : "Closed"}
          </span>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-[13px] font-bold" style={{ color: "#60a5fa" }}>
          {shop.distance?.toFixed(1)} km
        </div>
        <div className="text-[11px] text-[#94a3b8] mt-0.5 flex items-center gap-0.5 justify-end">
          <IconWalk size={11} /> {shop.distance ? `${Math.round(shop.distance * 12)} min` : "—"}
        </div>
      </div>
    </div>
  );
}
