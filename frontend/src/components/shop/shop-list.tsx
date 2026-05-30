"use client";

import { type Shop } from "@/types/shop";
import { ShopCard } from "./shop-card";
import { IconBuildingStore } from "@tabler/icons-react";
import { motion } from "framer-motion";

interface ShopListProps {
  shops: Shop[];
  title?: string;
  onSelectShop?: (shop: Shop) => void;
  emptyMessage?: string;
}

export function ShopList({
  shops,
  title,
  onSelectShop,
  emptyMessage = "No shops found",
}: ShopListProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.035)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {title && (
        <div
          className="flex items-center gap-2 px-5 py-4 text-sm font-bold tracking-tight"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <IconBuildingStore size={17} style={{ color: "#3b82f6" }} />
          {title}
        </div>
      )}
      <div className="flex flex-col">
        {shops.length === 0 ? (
          <div className="py-12 text-center text-sm text-text3">{emptyMessage}</div>
        ) : (
          shops.map((shop, i) => (
            <motion.div
              key={shop.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
            >
              <ShopCard shop={shop} onSelect={onSelectShop} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
