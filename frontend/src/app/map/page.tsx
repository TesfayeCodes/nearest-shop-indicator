"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { IconSearch, IconPlus, IconMinus, IconCurrentLocation, IconLayersIntersect, IconCompass, IconNavigation, IconHeart, IconShare, IconWalk, IconClock, IconPhone, IconMap, IconLayoutDashboard, IconBuildingStore, IconUser } from "@tabler/icons-react";
import Navbar from "@/components/layout/navbar";
import { type Shop } from "@/types/shop";

const shops: Shop[] = [
  { id: 1, name: "FreshMart Supermarket", category: "Grocery", latitude: 9.03, longitude: 38.74, address: "Bole, Addis Ababa", rating: 4.8, reviewCount: 320, open: true, closingTime: "10pm", distance: 0.2, walkTime: "3 min", phone: "+251 911 000 111", icon: "🛒", color: "#3b82f6" },
  { id: 2, name: "Brew House Cafe", category: "Cafe", latitude: 9.02, longitude: 38.75, address: "Kazanchis", rating: 4.5, reviewCount: 180, open: true, closingTime: "11pm", distance: 0.5, walkTime: "7 min", icon: "☕", color: "#10b981" },
  { id: 3, name: "MedPlus Pharmacy", category: "Pharmacy", latitude: 9.01, longitude: 38.73, address: "CMC", rating: 4.9, reviewCount: 95, open: true, closingTime: "9pm", distance: 0.7, walkTime: "10 min", icon: "💊", color: "#8b5cf6" },
  { id: 4, name: "UrbanBites", category: "Restaurant", latitude: 9.04, longitude: 38.72, address: "Piassa", rating: 4.3, reviewCount: 210, open: false, distance: 1.1, walkTime: "14 min", icon: "🍔", color: "#f59e0b" },
  { id: 5, name: "PageTurner Books", category: "Bookstore", latitude: 9.05, longitude: 38.76, address: "Bole", rating: 4.7, reviewCount: 64, open: true, distance: 1.4, walkTime: "18 min", icon: "📚", color: "#ef4444" },
  { id: 6, name: "StyleHub", category: "Clothing", latitude: 9.00, longitude: 38.77, address: "Megenagna", rating: 4.4, reviewCount: 130, open: true, distance: 1.8, walkTime: "22 min", icon: "👗", color: "#ec4899" },
];

const pins = [
  { icon: "🛒", name: "FreshMart", color: "#3b82f6", top: "20%", left: "16%", delay: 0 },
  { icon: "☕", name: "Brew House", color: "#10b981", top: "56%", left: "58%", delay: 0.2 },
  { icon: "💊", name: "MedPlus", color: "#8b5cf6", top: "28%", left: "62%", delay: 0.4 },
  { icon: "🍔", name: "UrbanBites", color: "#f59e0b", top: "70%", left: "28%", delay: 0.6 },
  { icon: "📚", name: "PageTurner", color: "#ef4444", top: "14%", left: "72%", delay: 0.8 },
  { icon: "👗", name: "StyleHub", color: "#ec4899", top: "36%", left: "80%", delay: 1.0 },
];

export default function MapPage() {
  const [selectedShop, setSelectedShop] = useState<Shop | null>(shops[0]);
  const [activeTab, setActiveTab] = useState("map");

  return (
    <>
      <Navbar />
      <div className="pt-nav relative overflow-hidden" style={{ height: "calc(100vh - 60px)" }}>
        <div className="relative w-full h-full bg-[#080f22]">
          <div className="absolute inset-0 grid-road" />
          <div className="road h" style={{ top: "22%" }} /><div className="road h thick" style={{ top: "44%" }} />
          <div className="road h" style={{ top: "66%" }} /><div className="road h" style={{ top: "82%" }} />
          <div className="road v" style={{ left: "18%" }} /><div className="road v thick" style={{ left: "42%" }} />
          <div className="road v" style={{ left: "65%" }} /><div className="road v" style={{ left: "82%" }} />
          <div className="absolute rounded-full" style={{ width: 500, height: 500, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)" }} />

          {/* User */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute" style={{ top: "47%", left: "46%" }}>
            <div className="w-[22px] h-[22px] rounded-full" style={{ background: "#3b82f6", boxShadow: "0 0 0 6px rgba(59,130,246,0.2), 0 0 0 12px rgba(59,130,246,0.08)", animation: "upulse 2s ease-in-out infinite" }} />
          </motion.div>

          {/* Pins */}
          {pins.map((p) => (
            <motion.div key={p.name} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: p.delay + 0.3 }} className="absolute flex flex-col items-center gap-1 cursor-pointer" style={{ top: p.top, left: p.left }} onClick={() => setSelectedShop(shops.find(s => s.name.startsWith(p.name)) || shops[0])}>
              <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-sm text-white font-bold" style={{ background: p.color, boxShadow: `0 4px 16px ${p.color}80`, animation: "pfloat 3s ease-in-out infinite" }}>
                <span style={{ fontSize: 13 }}>{p.icon}</span>
              </div>
              <div className="px-2 py-0.5 rounded-lg text-[10px] font-semibold text-text whitespace-nowrap" style={{ background: "rgba(8,15,34,0.9)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.12)" }}>{p.name}</div>
            </motion.div>
          ))}

          {/* Search overlay */}
          <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2.5 px-4 py-2.5 rounded-xl" style={{ background: "rgba(8,15,34,0.9)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.12)", width: 260 }}>
            <IconSearch size={17} style={{ color: "#475569" }} />
            <input type="text" placeholder="Search on map..." className="bg-transparent border-none outline-none text-[13px] text-text font-inherit flex-1" />
          </div>

          {/* Live badge */}
          <div className="absolute top-3.5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-4.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap" style={{ background: "rgba(8,15,34,0.88)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.12)" }}>
            <span className="w-[7px] h-[7px] rounded-full bg-em animate-pulse-dot" /> 24 shops nearby · Addis Ababa
          </div>

          {/* Controls */}
          <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
            <div className="rounded-xl overflow-hidden" style={{ background: "rgba(8,15,34,0.9)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.12)" }}>
              <button className="w-[38px] h-[38px] border-none bg-transparent text-text2 cursor-pointer flex items-center justify-center text-sm transition-colors hover:text-text hover:bg-white/5"><IconPlus size={16} /></button>
              <button className="w-[38px] h-[38px] border-none bg-transparent text-text2 cursor-pointer flex items-center justify-center text-sm transition-colors hover:text-text hover:bg-white/5" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}><IconMinus size={16} /></button>
            </div>
            <div className="rounded-xl overflow-hidden" style={{ background: "rgba(8,15,34,0.9)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.12)" }}>
              <button className="w-[38px] h-[38px] border-none bg-transparent cursor-pointer flex items-center justify-center text-sm transition-colors hover:bg-white/5"><IconCurrentLocation size={16} style={{ color: "#60a5fa" }} /></button>
            </div>
            <div className="rounded-xl overflow-hidden" style={{ background: "rgba(8,15,34,0.9)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.12)" }}>
              <button className="w-[38px] h-[38px] border-none bg-transparent text-text2 cursor-pointer flex items-center justify-center text-sm transition-colors hover:text-text hover:bg-white/5"><IconLayersIntersect size={16} /></button>
              <button className="w-[38px] h-[38px] border-none bg-transparent text-text2 cursor-pointer flex items-center justify-center text-sm transition-colors hover:text-text hover:bg-white/5" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}><IconCompass size={16} /></button>
            </div>
          </div>

          {/* Shop popup */}
          {selectedShop && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-[70px] left-1/2 -translate-x-1/2 z-10 w-[360px] rounded-3xl p-5" style={{ background: "rgba(8,15,34,0.94)", backdropFilter: "blur(28px)", border: "1px solid rgba(255,255,255,0.12)" }}>
              <div className="flex gap-3.5 items-start">
                <div className="w-[60px] h-[60px] rounded-2xl flex-shrink-0 flex items-center justify-center text-3xl" style={{ background: "rgba(59,130,246,0.15)" }}><span>{selectedShop.icon}</span></div>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-extrabold tracking-tight">{selectedShop.name}</div>
                  <div className="flex gap-2 flex-wrap mt-1">
                    <span className="flex items-center gap-0.5 text-xs" style={{ color: "#fbbf24" }}>{"★".repeat(Math.round(selectedShop.rating))}</span>
                    <span className="text-[11px] text-text2">{selectedShop.rating} ({selectedShop.reviewCount} reviews)</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: selectedShop.open ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: selectedShop.open ? "#34d399" : "#fca5a5", border: `1px solid ${selectedShop.open ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}` }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: "currentColor" }} />{selectedShop.open ? `Open · till ${selectedShop.closingTime}` : "Closed"}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: "rgba(139,92,246,0.12)", color: "#c4b5fd", border: "1px solid rgba(139,92,246,0.2)" }}>{selectedShop.category}</span>
                  </div>
                  <div className="flex gap-3.5 mt-2 text-xs text-text2">
                    <span className="flex items-center gap-1"><IconWalk size={14} style={{ color: "#60a5fa" }} /> {selectedShop.distance} km</span>
                    <span className="flex items-center gap-1"><IconClock size={14} style={{ color: "#60a5fa" }} /> ~{selectedShop.walkTime} walk</span>
                    {selectedShop.phone && <span className="flex items-center gap-1"><IconPhone size={14} style={{ color: "#60a5fa" }} /> {selectedShop.phone}</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3.5">
                <button className="btn-primary flex-1 justify-center text-xs py-2.5"><IconNavigation size={14} /> Navigate</button>
                <button className="btn-secondary flex-1 justify-center text-xs py-2.5">View Details</button>
                <button className="w-9 h-9 rounded-lg border border-[rgba(255,255,255,0.07)] bg-transparent text-text2 cursor-pointer flex items-center justify-center text-sm"><IconHeart size={15} /></button>
                <button className="w-9 h-9 rounded-lg border border-[rgba(255,255,255,0.07)] bg-transparent text-text2 cursor-pointer flex items-center justify-center text-sm"><IconShare size={15} /></button>
              </div>
            </motion.div>
          )}

          {/* Bottom tabs */}
          <div className="absolute bottom-0 left-0 right-0 z-10 flex" style={{ background: "rgba(8,15,34,0.9)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
            {[
              { icon: IconMap, label: "Map", key: "map" },
              { icon: IconLayoutDashboard, label: "Dashboard", key: "dash", href: "/dashboard" },
              { icon: IconBuildingStore, label: "Shops", key: "shops" },
              { icon: IconHeart, label: "Saved", key: "saved" },
              { icon: IconUser, label: "Profile", key: "profile" },
            ].map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.key;
              return (
                <button key={t.key} onClick={() => { setActiveTab(t.key); if (t.href) window.location.href = t.href; }} className="flex-1 flex flex-col items-center py-2.5 gap-0.5 cursor-pointer transition-colors bg-transparent border-none">
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
