"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IconSearch, IconPlus, IconMinus, IconCurrentLocation, IconLayersIntersect, IconCompass, IconNavigation, IconHeart, IconShare, IconWalk, IconClock, IconPhone, IconMap, IconLayoutDashboard, IconBuildingStore, IconUser } from "@tabler/icons-react";
import dynamic from "next/dynamic";
import Navbar from "@/components/layout/navbar";
import { type Shop } from "@/types/shop";
import { useRouter } from "next/navigation";
import { shopsApi } from "@/services/shops";
import { useLocationStore } from "@/store/use-location-store";
import { useToast } from "@/components/ui/toast";

const NearShopMap = dynamic(() => import("@/components/map/nearshop-map").then((m) => m.NearShopMap), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center text-xs text-text2">Loading map...</div>,
});

export default function MapPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [activeTab, setActiveTab] = useState("map");
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
        // fallback
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, [latitude, longitude]);

  const router = useRouter();
  const { toast } = useToast();
  const [favId, setFavId] = useState<number | null>(null);

  const handleNavigate = () => {
    if (selectedShop) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedShop.latitude},${selectedShop.longitude}`, "_blank");
    }
  };

  const handleFavorite = async () => {
    if (!selectedShop) return;
    try {
      const res = await shopsApi.toggleFavorite(selectedShop.id);
      setFavId(res.favorited ? selectedShop.id : null);
      toast(res.favorited ? "Added to favorites" : "Removed from favorites", "success");
    } catch { toast("Failed to toggle favorite", "error"); }
  };

  const handleShare = async () => {
    if (!selectedShop) return;
    const url = `https://maps.google.com/?q=${selectedShop.latitude},${selectedShop.longitude}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: selectedShop.name, text: `Check out ${selectedShop.name}`, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast("Link copied to clipboard", "success");
      }
    } catch { toast("Failed to share", "error"); }
  };

  const handleTabClick = (key: string, href?: string) => {
    setActiveTab(key);
    if (href) router.push(href);
  };

  return (
    <>
      <Navbar />
      <div className="pt-nav relative overflow-hidden" style={{ height: "calc(100vh - 60px)" }}>
        <div className="relative w-full h-full">
          <NearShopMap
            shops={shops}
            selectedShop={selectedShop}
            onSelectShop={setSelectedShop}
            userLatitude={latitude ?? undefined}
            userLongitude={longitude ?? undefined}
            height="100%"
          />

          {loading && (
            <div className="absolute top-3.5 right-3.5 z-[1000] px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: "rgba(8,15,34,0.88)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.12)" }}>
              Loading...
            </div>
          )}

          <div className="absolute top-3.5 left-3.5 z-[1000] flex items-center gap-2.5 px-4 py-2.5 rounded-xl" style={{ background: "rgba(8,15,34,0.9)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.12)", width: 260 }}>
            <IconSearch size={17} style={{ color: "#475569" }} />
            <input type="text" placeholder="Search on map..." className="bg-transparent border-none outline-none text-[13px] text-text font-inherit flex-1" />
          </div>

          <div className="absolute top-3.5 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-2 px-4.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap" style={{ background: "rgba(8,15,34,0.88)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.12)" }}>
            <span className="w-[7px] h-[7px] rounded-full bg-em animate-pulse-dot" /> {shops.length} shops nearby · Addis Ababa
          </div>

          {selectedShop && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-[70px] left-1/2 -translate-x-1/2 z-10 w-[360px] rounded-3xl p-5" style={{ background: "rgba(8,15,34,0.94)", backdropFilter: "blur(28px)", border: "1px solid rgba(255,255,255,0.12)" }}>
              <div className="flex gap-3.5 items-start">
                <div className="w-[60px] h-[60px] rounded-2xl flex-shrink-0 flex items-center justify-center text-3xl" style={{ background: "rgba(59,130,246,0.15)" }}><span>{selectedShop.icon || "📍"}</span></div>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-extrabold tracking-tight">{selectedShop.name}</div>
                  <div className="flex gap-2 flex-wrap mt-1">
                    <span className="flex items-center gap-0.5 text-xs" style={{ color: "#fbbf24" }}>{"★".repeat(Math.round(selectedShop.rating))}</span>
                    <span className="text-[11px] text-text2">{selectedShop.rating} ({selectedShop.review_count} reviews)</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: selectedShop.is_open ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: selectedShop.is_open ? "#34d399" : "#fca5a5", border: `1px solid ${selectedShop.is_open ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}` }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: "currentColor" }} />{selectedShop.is_open ? `Open · till ${selectedShop.closing_time || "—"}` : "Closed"}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: "rgba(139,92,246,0.12)", color: "#c4b5fd", border: "1px solid rgba(139,92,246,0.2)" }}>{selectedShop.category}</span>
                  </div>
                  <div className="flex gap-3.5 mt-2 text-xs text-text2">
                    <span className="flex items-center gap-1"><IconWalk size={14} style={{ color: "#60a5fa" }} /> {selectedShop.distance} km</span>
                    <span className="flex items-center gap-1"><IconClock size={14} style={{ color: "#60a5fa" }} /> ~{selectedShop.distance ? `${Math.round(selectedShop.distance * 12)} min` : "—"} walk</span>
                    {selectedShop.phone && <span className="flex items-center gap-1"><IconPhone size={14} style={{ color: "#60a5fa" }} /> {selectedShop.phone}</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3.5">
                <button onClick={handleNavigate} className="btn-primary flex-1 justify-center text-xs py-2.5"><IconNavigation size={14} /> Navigate</button>
                <button onClick={() => router.push("/shops")} className="btn-secondary flex-1 justify-center text-xs py-2.5">View Details</button>
                <button onClick={handleFavorite} className="w-9 h-9 rounded-lg border border-[rgba(255,255,255,0.07)] bg-transparent text-text2 cursor-pointer flex items-center justify-center text-sm"><IconHeart size={15} style={{ color: favId === selectedShop?.id ? "#ef4444" : undefined }} /></button>
                <button onClick={handleShare} className="w-9 h-9 rounded-lg border border-[rgba(255,255,255,0.07)] bg-transparent text-text2 cursor-pointer flex items-center justify-center text-sm"><IconShare size={15} /></button>
              </div>
            </motion.div>
          )}

          <div className="absolute bottom-0 left-0 right-0 z-10 flex" style={{ background: "rgba(8,15,34,0.9)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
            {[
              { icon: IconMap, label: "Map", key: "map" },
              { icon: IconLayoutDashboard, label: "Dashboard", key: "dash", href: "/dashboard" },
              { icon: IconBuildingStore, label: "Shops", key: "shops", href: "/shops" },
              { icon: IconHeart, label: "Saved", key: "saved", href: "/favorites" },
              { icon: IconUser, label: "Profile", key: "profile", href: "/profile" },
            ].map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.key;
              return (
                <button key={t.key} onClick={() => handleTabClick(t.key, t.href)} className="flex-1 flex flex-col items-center py-2.5 gap-0.5 cursor-pointer transition-colors bg-transparent border-none">
                  <Icon size={21} style={{ color: isActive ? "#3b82f6" : "#475569" }} />
                  <span className="text-[9px] font-semibold" style={{ color: isActive ? "#3b82f6" : "#475569" }}>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
