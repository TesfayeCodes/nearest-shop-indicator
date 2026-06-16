"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { IconArrowLeft, IconSearch, IconBuildingStore } from "@tabler/icons-react";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { ShopCard } from "@/components/shop/shop-card";
import { useDebounce } from "@/hooks/use-debounce";
import { shopsApi } from "@/services/shops";
import { type Shop } from "@/types/shop";

const chips = ["All", "Grocery", "Cafe", "Pharmacy", "Restaurant", "Electronics"];

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeChip, setActiveChip] = useState("All");
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const fetchShops = async () => {
      setLoading(true);
      try {
        const params: { search?: string; category?: string; page_size?: number } = { page_size: 50 };
        if (debouncedSearch) params.search = debouncedSearch;
        if (activeChip !== "All") params.category = activeChip;
        const data = await shopsApi.list(params);
        setShops(data.items.map((s) => ({
          id: s.id, name: s.name, category: s.category || "Other",
          category_name: s.category_name, icon: s.icon || "📍",
          latitude: s.latitude, longitude: s.longitude,
          address: s.address, phone: s.phone, image_url: s.image_url,
          rating: s.rating, review_count: s.review_count,
          is_open: s.is_open, closing_time: s.closing_time,
          distance: s.distance,
        })));
      } catch { /* fallback */ } finally { setLoading(false); }
    };
    fetchShops();
  }, [debouncedSearch, activeChip]);

  return (
    <>
      <Navbar />
      <div className="flex flex-row pt-nav min-h-screen">
        <Sidebar variant="user" />
        <main className="ml-side flex-1 p-7 flex flex-col gap-5.5 min-h-[calc(100vh-60px)]">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-3">
              <Link href="/dashboard" className="w-8 h-8 rounded-lg flex items-center justify-center bg-transparent border border-[rgba(255,255,255,0.07)] text-text2 no-underline hover:bg-white/5 transition-colors">
                <IconArrowLeft size={16} />
              </Link>
              <div>
                <h1 className="text-[22px] font-extrabold tracking-tight">Browse Shops</h1>
                <p className="text-[13px] text-text2 mt-0.5">Discover shops near you</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 h-[38px] rounded-xl" style={{ background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <IconSearch size={16} style={{ color: "#475569" }} />
              <input type="text" placeholder="Search shops..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent border-none outline-none text-[13px] text-text font-inherit flex-1" />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            {chips.map((c) => (
              <button key={c} onClick={() => setActiveChip(c)} className={`px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all duration-200 ${activeChip === c ? "text-blue-light" : "text-text2"}`} style={{ background: activeChip === c ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.035)", border: `1px solid ${activeChip === c ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.07)"}` }}>
                {c}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              <span className="text-xs text-text2">Loading shops...</span>
            </div>
          ) : shops.length === 0 ? (
            <div className="card-base p-12 flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(59,130,246,0.12)" }}>
                <IconBuildingStore size={28} style={{ color: "#60a5fa" }} />
              </div>
              <h3 className="text-lg font-bold text-text">No shops found</h3>
              <p className="text-sm text-text2 text-center max-w-[300px]">Try adjusting your search or category filter.</p>
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-2 px-5 py-4 text-sm font-bold tracking-tight" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <IconBuildingStore size={17} style={{ color: "#3b82f6" }} /> All Shops
                <span className="ml-auto text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(59,130,246,0.1)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)" }}>
                  {shops.length}
                </span>
              </div>
              <div className="flex flex-col">
                {shops.map((s) => (
                  <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 }}>
                    <ShopCard shop={s} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}