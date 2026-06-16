"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { IconHeart, IconMapPin, IconStar, IconTrash, IconArrowLeft } from "@tabler/icons-react";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { shopsApi } from "@/services/shops";
import { type Shop } from "@/types/shop";
import { useToast } from "@/components/ui/toast";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await shopsApi.getFavorites();
        setFavorites(
          data.items.map((s) => ({
            id: s.id, name: s.name, category: s.category || "Other",
            category_name: s.category || null, icon: s.icon || "📍",
            latitude: s.latitude, longitude: s.longitude,
            address: null, phone: null, image_url: null,
            rating: s.rating, review_count: 0, is_open: s.is_open,
            closing_time: null, distance: undefined,
          }))
        );
      } catch { /* fallback */ } finally { setLoading(false); }
    };
    fetchFavorites();
  }, []);

  const removeFavorite = async (id: number) => {
    try {
      await shopsApi.toggleFavorite(id);
      setFavorites((prev) => prev.filter((f) => f.id !== id));
      toast("Removed from favorites", "info");
    } catch { toast("Failed to remove", "error"); }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-row pt-nav min-h-screen">
        <Sidebar variant="user" />
        <main className="ml-side flex-1 p-7 flex flex-col gap-5.5 min-h-[calc(100vh-60px)]">
          <div className="flex items-start gap-3">
            <Link href="/dashboard" className="w-8 h-8 rounded-lg flex items-center justify-center bg-transparent border border-[rgba(255,255,255,0.07)] text-text2 no-underline hover:bg-white/5 transition-colors"><IconArrowLeft size={16} /></Link>
            <div><h1 className="text-[22px] font-extrabold tracking-tight">Favorites</h1><p className="text-[13px] text-text2 mt-0.5">Your saved shops</p></div>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-20"><div className="w-8 h-8 rounded-full border-2 border-white/30 border-t-white animate-spin" /></div>
          ) : favorites.length === 0 ? (
            <div className="card-base p-12 flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(139,92,246,0.12)" }}><IconHeart size={28} style={{ color: "#c4b5fd" }} /></div>
              <h3 className="text-lg font-bold text-text">No favorites yet</h3>
              <p className="text-sm text-text2 text-center max-w-[300px]">Start exploring and save shops you love.</p>
              <Link href="/map" className="btn-primary no-underline"><IconMapPin size={16} /> Explore Map</Link>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
              {favorites.map((shop, i) => (
                <motion.div key={shop.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card-base p-5 flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-xl" style={{ background: "rgba(59,130,246,0.12)" }}><span>{shop.icon}</span></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-bold tracking-tight text-text">{shop.name}</div>
                      <div className="text-[12px] text-text2 mt-0.5">{shop.category}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-0.5 text-[11px]" style={{ color: "#fbbf24" }}>
                          {Array.from({ length: 5 }).map((_, j) => (<IconStar key={j} size={10} fill={j < Math.floor(shop.rating) ? "#fbbf24" : "none"} color={j < Math.floor(shop.rating) ? "#fbbf24" : "rgba(255,255,255,0.1)"} />))}
                          <span style={{ color: "#94a3b8", marginLeft: 2 }}>{shop.rating}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold" style={{ background: shop.is_open ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: shop.is_open ? "#34d399" : "#fca5a5" }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "currentColor" }} />{shop.is_open ? "Open" : "Closed"}
                        </span>
                      </div>
                    </div>
                    <button onClick={() => removeFavorite(shop.id)} className="w-8 h-8 rounded-lg border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.08)] text-red-400 cursor-pointer flex items-center justify-center text-sm hover:bg-[rgba(239,68,68,0.15)] transition-colors"><IconTrash size={14} /></button>
                  </div>
                  <Link href={`/map?shop=${shop.id}`} className="btn-primary text-xs py-2 justify-center no-underline"><IconMapPin size={14} /> View on Map</Link>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
