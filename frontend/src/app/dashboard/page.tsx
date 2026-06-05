"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IconSearch, IconCurrentLocation, IconBuildingStore, IconMapPin, IconHeart, IconTrendingUp, IconTrendingDown, IconGridDots, IconMaximize, IconRefresh, IconAdjustmentsHorizontal, IconActivity, IconNavigation, IconStar, IconClock, IconWalk } from "@tabler/icons-react";
import dynamic from "next/dynamic";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { ShopCard } from "@/components/shop/shop-card";
import { type Shop } from "@/types/shop";
import { shopsApi } from "@/services/shops";
import { useLocationStore } from "@/store/use-location-store";

const NearShopMap = dynamic(() => import("@/components/map/nearshop-map").then((m) => m.NearShopMap), {
  ssr: false,
  loading: () => <div className="h-full flex items-center justify-center text-xs text-text2">Loading map...</div>,
});

const activities = [
  { icon: IconNavigation, bg: "rgba(59,130,246,0.1)", color: "#60a5fa", text: "Navigated to FreshMart", time: "2 min ago" },
  { icon: IconStar, bg: "rgba(245,158,11,0.1)", color: "#fcd34d", text: "Rated Brew House Cafe ★★★★★", time: "1 hr ago" },
  { icon: IconHeart, bg: "rgba(16,185,129,0.1)", color: "#34d399", text: "Added MedPlus to Favorites", time: "3 hr ago" },
];

export default function DashboardPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChip, setActiveChip] = useState("All");
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [openNow, setOpenNow] = useState(false);
  const { latitude, longitude, setLocation } = useLocationStore();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation(pos.coords.latitude, pos.coords.longitude),
        () => {}
      );
    }
  }, [setLocation]);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const lat = latitude || 9.03;
        const lng = longitude || 38.74;
        const data = await shopsApi.nearby(lat, lng, 5);
        const mapped: Shop[] = data.items.map((s) => ({
          id: s.id,
          name: s.name,
          category: s.category_name || s.category || "Other",
          category_name: s.category_name,
          latitude: s.latitude,
          longitude: s.longitude,
          address: s.address,
          phone: s.phone,
          image_url: s.image_url,
          rating: s.rating,
          review_count: s.review_count,
          is_open: s.is_open,
          closing_time: s.closing_time,
          distance: s.distance,
          icon: s.icon || "📍",
        }));
        setShops(mapped);
        if (mapped.length > 0 && !selectedShop) {
          setSelectedShop(mapped[0]);
        }
      } catch {
        // fallback empty
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, [latitude, longitude]);

  const chips = ["All", "Grocery", "Cafe", "Pharmacy", "Restaurant", "Electronics"];
  const filtered = shops.filter(s => {
    const catMatch = activeChip === "All" || s.category === activeChip;
    const openMatch = !openNow || s.is_open;
    return catMatch && openMatch;
  });

  return (
    <>
      <Navbar />
      <div className="flex flex-row pt-nav min-h-screen">
        <Sidebar variant="user" />
        <main className="ml-side flex-1 p-7 flex flex-col gap-5.5 min-h-[calc(100vh-60px)]">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-[22px] font-extrabold tracking-tight">Dashboard</h1>
              <div className="flex items-center gap-1.5 text-[13px] text-text2 mt-0.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#34d399" }}>
                  <span className="w-[6px] h-[6px] rounded-full bg-em animate-pulse-dot" /> Live
                </span>
                Addis Ababa, Ethiopia
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 px-3 h-[38px] rounded-xl" style={{ background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <IconSearch size={16} style={{ color: "#475569" }} />
                <input type="text" placeholder="Search shops..." className="bg-transparent border-none outline-none text-[13px] text-text font-inherit flex-1" />
              </div>
              <button className="btn-primary text-xs px-4 py-2" style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <IconCurrentLocation size={14} /> Locate Me
              </button>
            </div>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3.5">
            {[
              { icon: IconBuildingStore, label: "Shops Nearby", val: String(shops.length), color: "#60a5fa", change: "Within 5 km", up: true },
              { icon: IconMapPin, label: "Closest Shop", val: shops.length > 0 ? `${Math.min(...shops.map(s => s.distance || 999))} km` : "—", color: "#34d399", change: shops.filter(s => s.is_open).length > 0 ? `${shops.filter(s => s.is_open)[0]?.name || ""}` : "None open", up: true },
              { icon: IconHeart, label: "Favorites", val: "0", color: "#c4b5fd", change: "Save shops to favorites", up: true },
              { icon: IconSearch, label: "Radius", val: "5 km", color: "#fcd34d", change: "Search area", up: true },
            ].map((m) => (
              <motion.div key={m.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-base p-5 cursor-default relative overflow-hidden">
                <div className="absolute -top-7 -right-7 w-20 h-20 rounded-full opacity-[0.06]" style={{ background: m.color }} />
                <div className="text-[11px] font-semibold uppercase tracking-wider text-text2 mb-3 flex items-center gap-1.5">
                  <m.icon size={14} style={{ color: m.color }} /> {m.label}
                </div>
                <div className="text-[28px] font-extrabold tracking-tight" style={{ color: m.color }}>{m.val}</div>
                <div className={`text-xs mt-1.5 font-medium flex items-center gap-1 ${m.up ? "text-em-light" : "text-red-400"}`}>
                  {m.up ? <IconTrendingUp size={12} /> : <IconTrendingDown size={12} />}{m.change}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            {chips.map((c) => (
              <button key={c} onClick={() => setActiveChip(c)} className={`px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all duration-200 ${activeChip === c ? "text-blue-light" : "text-text2"}`} style={{ background: activeChip === c ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.035)", border: `1px solid ${activeChip === c ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.07)"}` }}>
                {c}
              </button>
            ))}
            <button onClick={() => setOpenNow(!openNow)} className={`px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all flex items-center gap-1 ${openNow ? "text-em-light" : "text-text2"}`} style={{ background: openNow ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.035)", border: `1px solid ${openNow ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.07)"}` }}>
              <IconClock size={12} /> Open Now
            </button>
          </div>

          <div className="grid grid-cols-[1fr_330px] gap-5 max-lg:grid-cols-1">
            <div className="flex flex-col gap-4.5">
              <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center gap-2 px-5 py-4 text-sm font-bold tracking-tight" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  <IconMapPin size={17} style={{ color: "#3b82f6" }} /> Live Map
                  <div className="ml-auto flex gap-1.5">
                    <button className="w-8 h-8 rounded-lg border border-[rgba(255,255,255,0.07)] bg-transparent text-text2 cursor-pointer flex items-center justify-center text-sm transition-colors hover:bg-white/5 hover:text-text hover:border-border2"><IconMaximize size={14} /></button>
                    <button className="w-8 h-8 rounded-lg border border-[rgba(255,255,255,0.07)] bg-transparent text-text2 cursor-pointer flex items-center justify-center text-sm transition-colors hover:bg-white/5 hover:text-text hover:border-border2"><IconRefresh size={14} /></button>
                  </div>
                </div>
                <div className="h-[270px] relative overflow-hidden">
                  {loading ? (
                    <div className="flex items-center justify-center h-full text-xs text-text2">Loading nearby shops...</div>
                  ) : (
                    <NearShopMap
                      shops={shops}
                      selectedShop={selectedShop}
                      onSelectShop={setSelectedShop}
                      userLatitude={latitude ?? undefined}
                      userLongitude={longitude ?? undefined}
                      interactive={false}
                    />
                  )}
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center gap-2 px-5 py-4 text-sm font-bold tracking-tight" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  <IconGridDots size={17} style={{ color: "#3b82f6" }} /> Quick Categories
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2">
                    {["Grocery", "Cafe", "Pharmacy", "Restaurant", "Electronics", "Clothing"].map((c) => (
                      <div key={c} className="p-3 text-center rounded-2xl cursor-pointer transition-all" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}>
                        <div className="text-[10px] font-semibold text-text2">{c}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4.5">
              <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center gap-2 px-5 py-4 text-sm font-bold tracking-tight" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  <IconBuildingStore size={17} style={{ color: "#3b82f6" }} /> Nearby Shops
                  <div className="ml-auto"><button className="w-8 h-8 rounded-lg border border-[rgba(255,255,255,0.07)] bg-transparent text-text2 cursor-pointer flex items-center justify-center text-sm"><IconAdjustmentsHorizontal size={14} /></button></div>
                </div>
                <div className="flex flex-col">
                  {loading ? (
                    <div className="p-5 text-xs text-text2 text-center">Loading...</div>
                  ) : filtered.length === 0 ? (
                    <div className="p-5 text-xs text-text2 text-center">No shops found nearby</div>
                  ) : (
                    filtered.map((s) => (
                      <ShopCard key={s.id} shop={s} onSelect={setSelectedShop} />
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center gap-2 px-5 py-4 text-sm font-bold tracking-tight" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  <IconActivity size={17} style={{ color: "#3b82f6" }} /> Recent Activity
                </div>
                <div className="flex flex-col">
                  {activities.map((a, i) => {
                    const Icon = a.icon;
                    return (
                      <div key={i} className="flex items-start gap-2.5 px-4.5 py-3.5 border-b border-[rgba(255,255,255,0.07)] last:border-b-0">
                        <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-sm" style={{ background: a.bg, color: a.color }}><Icon size={15} /></div>
                        <div>
                          <div className="text-xs leading-relaxed text-text2" dangerouslySetInnerHTML={{ __html: a.text.replace(/(FreshMart|Brew House Cafe|MedPlus)/g, "<strong style='color:#f8fafc'>$1</strong>") }} />
                          <div className="text-[10px] text-text3 mt-0.5">{a.time}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
