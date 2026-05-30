"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IconSearch, IconCurrentLocation, IconBuildingStore, IconMapPin, IconHeart, IconTrendingUp, IconTrendingDown, IconGridDots, IconMaximize, IconRefresh, IconAdjustmentsHorizontal, IconActivity, IconNavigation, IconStar, IconCoffee, IconPill, IconToolsKitchen2, IconBook, IconWalk, IconClock, IconShoppingCart } from "@tabler/icons-react";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { ShopCard } from "@/components/shop/shop-card";
import { type Shop } from "@/types/shop";

const defaultShops: Shop[] = [
  { id: 1, name: "FreshMart", category: "Grocery", latitude: 9.03, longitude: 38.74, address: "Bole, Addis Ababa", rating: 4.8, reviewCount: 320, open: true, closingTime: "10pm", distance: 0.2, walkTime: "3 min", phone: "+251 911 000 111", icon: "🛒", color: "#3b82f6" },
  { id: 2, name: "Brew House Cafe", category: "Cafe", latitude: 9.02, longitude: 38.75, address: "Kazanchis, Addis Ababa", rating: 4.5, reviewCount: 180, open: true, closingTime: "11pm", distance: 0.5, walkTime: "7 min", icon: "☕", color: "#10b981" },
  { id: 3, name: "MedPlus Pharmacy", category: "Pharmacy", latitude: 9.01, longitude: 38.73, address: "CMC, Addis Ababa", rating: 4.9, reviewCount: 95, open: true, closingTime: "9pm", distance: 0.7, walkTime: "10 min", icon: "💊", color: "#8b5cf6" },
  { id: 4, name: "UrbanBites", category: "Restaurant", latitude: 9.04, longitude: 38.72, address: "Piassa, Addis Ababa", rating: 4.3, reviewCount: 210, open: false, closingTime: "10pm", distance: 1.1, walkTime: "14 min", icon: "🍔", color: "#f59e0b" },
  { id: 5, name: "PageTurner Books", category: "Bookstore", latitude: 9.05, longitude: 38.76, address: "Bole, Addis Ababa", rating: 4.7, reviewCount: 64, open: true, closingTime: "8pm", distance: 1.4, walkTime: "18 min", icon: "📚", color: "#ef4444" },
  { id: 6, name: "StyleHub", category: "Clothing", latitude: 9.00, longitude: 38.77, address: "Megenagna, Addis Ababa", rating: 4.4, reviewCount: 130, open: true, closingTime: "9pm", distance: 1.8, walkTime: "22 min", icon: "👗", color: "#ec4899" },
  { id: 7, name: "TechWorld", category: "Electronics", latitude: 9.06, longitude: 38.71, address: "Merkato, Addis Ababa", rating: 4.6, reviewCount: 88, open: false, closingTime: "8pm", distance: 2.1, walkTime: "26 min", icon: "📱", color: "#f472b6" },
];

const activities = [
  { icon: IconNavigation, bg: "rgba(59,130,246,0.1)", color: "#60a5fa", text: "Navigated to FreshMart", time: "2 min ago" },
  { icon: IconStar, bg: "rgba(245,158,11,0.1)", color: "#fcd34d", text: "Rated Brew House Cafe ★★★★★", time: "1 hr ago" },
  { icon: IconHeart, bg: "rgba(16,185,129,0.1)", color: "#34d399", text: "Added MedPlus to Favorites", time: "3 hr ago" },
];

const chips = ["All", "🛒 Grocery", "☕ Cafe", "💊 Pharmacy", "🍔 Restaurant", "📱 Electronics"];

export default function DashboardPage() {
  const [shops] = useState<Shop[]>(defaultShops);
  const [activeChip, setActiveChip] = useState("All");
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);

  const filtered = activeChip === "All" ? shops : shops.filter(s => s.category === activeChip.replace(/^[^\s]+\s/, ""));

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
              { icon: IconBuildingStore, label: "Shops Nearby", val: "24", color: "#60a5fa", cls: "b", change: "3 new today", up: true },
              { icon: IconMapPin, label: "Closest Shop", val: "0.2 km", color: "#34d399", cls: "g", change: "FreshMart · Open", up: true },
              { icon: IconHeart, label: "Favorites", val: "8", color: "#c4b5fd", cls: "p", change: "1 added", up: true },
              { icon: IconSearch, label: "Searches Today", val: "17", color: "#fcd34d", cls: "a", change: "Down 2 vs yesterday", up: false },
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
            <button className="px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all flex items-center gap-1" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)", color: "#94a3b8" }}>
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
                <div className="h-[270px] relative bg-[#080f22] overflow-hidden">
                  <div className="absolute inset-0 grid-road" />
                  <div className="road h" style={{ top: "35%" }} /><div className="road h thick" style={{ top: "62%" }} />
                  <div className="road v" style={{ left: "28%" }} /><div className="road v thick" style={{ left: "60%" }} />
                  <div className="absolute rounded-full" style={{ width: 220, height: 220, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)" }} />
                  <div className="absolute" style={{ top: "46%", left: "45%" }}><div className="w-[16px] h-[16px] rounded-full" style={{ background: "#3b82f6", boxShadow: "0 0 0 6px rgba(59,130,246,0.2), 0 0 0 12px rgba(59,130,246,0.08)", animation: "upulse 2s ease-in-out infinite" }} /></div>
                  {shops.slice(0, 3).map((s, i) => {
                    const positions = [{ top: "20%", left: "22%" }, { top: "60%", left: "62%" }, { top: "28%", left: "60%" }];
                    return (
                      <div key={s.id} className="absolute" style={positions[i]}>
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] text-white font-bold cursor-pointer" style={{ background: s.color, boxShadow: `0 4px 16px ${s.color}80`, animation: "pfloat 3s ease-in-out infinite" }}>
                          <span style={{ fontSize: 11 }}>{s.icon}</span>
                        </div>
                      </div>
                    );
                  })}
                  {selectedShop && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-3.5 left-3 right-3 rounded-2xl p-4 flex gap-3" style={{ background: "rgba(8,15,34,0.92)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.12)" }}>
                      <div className="w-[52px] h-[52px] rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: "rgba(59,130,246,0.15)" }}><span>{selectedShop.icon}</span></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-extrabold tracking-tight">{selectedShop.name}</div>
                        <div className="flex items-center gap-2 flex-wrap text-[11px] text-text2 mt-1">
                          <span className="flex" style={{ color: "#fbbf24" }}>{"★".repeat(Math.round(selectedShop.rating))}</span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: selectedShop.open ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: selectedShop.open ? "#34d399" : "#fca5a5", border: `1px solid ${selectedShop.open ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}` }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "currentColor" }} />{selectedShop.open ? "Open" : "Closed"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5 text-xs">
                          <span className="flex items-center gap-1 font-bold" style={{ color: "#60a5fa" }}><IconWalk size={13} /> {selectedShop.distance} km</span>
                          <span className="text-text2 flex items-center gap-1"><IconClock size={13} /> ~{selectedShop.walkTime}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center gap-2 px-5 py-4 text-sm font-bold tracking-tight" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  <IconGridDots size={17} style={{ color: "#3b82f6" }} /> Quick Categories
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2">
                    {["🛒 Grocery", "☕ Cafe", "💊 Pharmacy", "🍔 Food", "📱 Tech", "👗 Fashion"].map((c) => (
                      <div key={c} className="p-3 text-center rounded-2xl cursor-pointer transition-all" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}>
                        <div className="text-xl mb-1">{c.split(" ")[0]}</div>
                        <div className="text-[10px] font-semibold text-text2">{c.split(" ")[1]}</div>
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
                  {filtered.map((s) => (
                    <ShopCard key={s.id} shop={s} onSelect={setSelectedShop} />
                  ))}
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
