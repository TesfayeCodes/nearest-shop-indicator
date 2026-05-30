"use client";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Link from "next/link";
import {
  IconMapPin,
  IconSearch,
  IconCurrentLocation,
  IconMap,
  IconBolt,
  IconRoute,
  IconBrain,
  IconAdjustmentsHorizontal,
  IconStar,
  IconDeviceMobile,
  IconGridDots,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

const features = [
  { icon: IconCurrentLocation, color: "#3b82f6", bg: "rgba(59,130,246,0.12)", title: "Real-time GPS", desc: "Pinpoint your location and discover shops within walking distance, updated live as you move." },
  { icon: IconRoute, color: "#10b981", bg: "rgba(16,185,129,0.12)", title: "Turn-by-Turn Nav", desc: "Optimized walking or driving routes using OpenStreetMap — no Google Maps needed." },
  { icon: IconBrain, color: "#8b5cf6", bg: "rgba(139,92,246,0.12)", title: "Smart Picks", desc: "AI-powered recommendations based on your history, time of day, and preferences." },
  { icon: IconAdjustmentsHorizontal, color: "#f59e0b", bg: "rgba(245,158,11,0.12)", title: "Advanced Filters", desc: "Filter by distance, rating, open hours, and category to find exactly what you need." },
  { icon: IconStar, color: "#3b82f6", bg: "rgba(59,130,246,0.12)", title: "Reviews & Ratings", desc: "Real user ratings help you pick the best shop with confidence every time." },
  { icon: IconDeviceMobile, color: "#10b981", bg: "rgba(16,185,129,0.12)", title: "Mobile-First", desc: "Telegram Mini App support and a native mobile experience built for on-the-go use." },
];

const categories = [
  { emoji: "🛒", label: "Grocery" }, { emoji: "💊", label: "Pharmacy" }, { emoji: "🍔", label: "Restaurant" },
  { emoji: "📱", label: "Electronics" }, { emoji: "👗", label: "Clothing" }, { emoji: "☕", label: "Cafe" },
  { emoji: "📚", label: "Bookstore" }, { emoji: "🔧", label: "Hardware" }, { emoji: "🏪", label: "Supermarket" },
];

const stats = [
  { value: "50K+", label: "Shops Listed", color: "#60a5fa" },
  { value: "120", label: "Cities Covered", color: "#34d399" },
  { value: "2M+", label: "Monthly Users", color: "#c4b5fd" },
  { value: "4.9★", label: "App Rating", color: "#fcd34d" },
];

const pins = [
  { icon: "🛒", name: "FreshMart", color: "#3b82f6", d: "0.3", top: "18%", left: "18%", delay: 0.8 },
  { icon: "☕", name: "Brew House", color: "#10b981", d: "0.5", top: "58%", left: "63%", delay: 0.9 },
  { icon: "💊", name: "MedPlus", color: "#8b5cf6", d: "0.7", top: "22%", left: "62%", delay: 1.0 },
  { icon: "🍔", name: "UrbanBites", color: "#f59e0b", d: "1.1", top: "68%", left: "30%", delay: 1.1 },
];

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col" style={{
        background: `radial-gradient(ellipse 90% 50% at 50% -5%, rgba(59,130,246,0.12) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 85% 85%, rgba(16,185,129,0.08) 0%, transparent 60%), #070c1a`,
      }}>
        <section className="pt-[calc(60px+80px)] pb-[60px] px-8 max-w-[820px] mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium mb-7" style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", color: "#93c5fd" }}>
            <span className="w-[7px] h-[7px] rounded-full bg-em animate-pulse-dot" /> Live GPS · 50K+ Shops Indexed
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold leading-[1.1] tracking-tighter mb-5">
            Find Shops Near You,<br /><span className="grad-text">Instantly</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-text2 text-base leading-relaxed max-w-[540px] mx-auto mb-9">
            Real-time shop discovery powered by GPS. Navigate, explore, and find exactly what you need in seconds.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex gap-3 justify-center flex-wrap">
            <Link href="/dashboard" className="btn-primary no-underline"><IconCurrentLocation size={18} /> Find Shops Near Me</Link>
            <Link href="/map" className="btn-secondary no-underline"><IconMap size={18} /> Explore Map</Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="max-w-[520px] mx-auto mt-10 flex items-center gap-3 px-4.5 py-1.5 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(16px)" }}>
            <IconSearch size={19} style={{ color: "#475569" }} />
            <input type="text" placeholder="Search shops, cafes, pharmacies..." className="flex-1 bg-transparent border-none outline-none text-sm text-text font-inherit placeholder:text-text3" />
            <button className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white border-none cursor-pointer whitespace-nowrap" style={{ background: "#3b82f6" }}>Search</button>
          </motion.div>
        </section>

        <div className="px-8 max-w-[940px] mx-auto mt-13 w-full">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.5 }} className="h-[340px] rounded-3xl overflow-hidden relative glow-ring" style={{ background: "#080f22" }}>
            <div className="absolute inset-0 grid-road" />
            <div className="road h" style={{ top: "28%" }} /><div className="road h thick" style={{ top: "52%" }} /><div className="road h" style={{ top: "74%" }} />
            <div className="road v" style={{ left: "22%" }} /><div className="road v thick" style={{ left: "52%" }} /><div className="road v" style={{ left: "78%" }} />
            <div className="absolute rounded-full" style={{ width: 340, height: 340, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)" }} />
            <div className="absolute flex flex-col items-center gap-1" style={{ top: "50%", left: "50%" }}>
              <div className="w-[18px] h-[18px] rounded-full" style={{ background: "#3b82f6", boxShadow: "0 0 0 6px rgba(59,130,246,0.2), 0 0 0 12px rgba(59,130,246,0.08)", animation: "upulse 2s ease-in-out infinite" }} />
            </div>
            {pins.map((p) => (
              <motion.div key={p.name} className="absolute flex flex-col items-center gap-1 cursor-pointer" style={{ top: p.top, left: p.left }} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: p.delay, duration: 0.4 }}>
                <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-sm text-white font-bold" style={{ background: p.color, boxShadow: `0 4px 16px ${p.color}80`, animation: "pfloat 3s ease-in-out infinite" }}><span style={{ fontSize: 13 }}>{p.icon}</span></div>
                <div className="px-2 py-0.5 rounded-lg text-[10px] font-semibold text-text whitespace-nowrap" style={{ background: "rgba(7,12,26,0.85)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.12)" }}>{p.name} · {p.d}km</div>
              </motion.div>
            ))}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs><marker id="ma" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="rgba(59,130,246,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></marker></defs>
              <line x1="50%" y1="50%" x2="18%" y2="28%" stroke="rgba(59,130,246,0.4)" strokeWidth="1.5" strokeDasharray="5,4" markerEnd="url(#ma)" />
            </svg>
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl" style={{ background: "rgba(7,12,26,0.85)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.12)" }}>
              <span className="w-[7px] h-[7px] rounded-full flex-shrink-0 bg-em animate-pulse-dot" /> Live · Addis Ababa
            </div>
            <div className="absolute bottom-3 right-3 flex flex-col items-end gap-1 px-4 py-3 rounded-xl" style={{ background: "rgba(7,12,26,0.85)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.12)" }}>
              <div className="text-[11px] text-text2 font-medium">Closest shop</div>
              <div className="text-lg font-extrabold" style={{ color: "#60a5fa" }}>0.2 km</div>
              <div className="text-[11px] text-text2">~3 min walk</div>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-4 gap-3.5 max-w-[940px] mx-auto mt-9 px-8 w-full max-lg:grid-cols-2 max-sm:grid-cols-1">
          {stats.map((s) => (
            <div key={s.label} className="card-base p-5.5 text-center cursor-default">
              <div className="text-[26px] font-extrabold tracking-tight" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-text2 mt-1.5 font-medium">{s.label}</div>
            </div>
          ))}
        </motion.div>

        <section className="section-wrap pt-20 pb-0">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest mb-4" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#34d399" }}>
            <IconBolt size={14} /> Features
          </motion.div>
          <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] font-extrabold leading-tight tracking-tight mb-2.5">Built for discovery,<br />designed for speed</h2>
          <p className="text-text2 text-base leading-relaxed max-w-[480px]">Everything you need to find what&apos;s closest, rated best, and open right now.</p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3.5 mt-10">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="card-base p-6.5 cursor-default">
                  <div className="w-[46px] h-[46px] rounded-xl flex items-center justify-center text-xl mb-4.5" style={{ background: f.bg, color: f.color }}><Icon size={20} /></div>
                  <div className="text-[15px] font-bold tracking-tight mb-2">{f.title}</div>
                  <div className="text-[13px] text-text2 leading-relaxed">{f.desc}</div>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="section-wrap pb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest mb-4" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#34d399" }}>
            <IconGridDots size={14} /> Categories
          </motion.div>
          <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] font-extrabold leading-tight tracking-tight mb-7">Browse by category</h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(95px,1fr))] gap-2.5">
            {categories.map((c, i) => (
              <motion.div key={c.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} className="p-4 text-center rounded-2xl cursor-pointer transition-all duration-250" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="text-2xl mb-1.5">{c.emoji}</div>
                <div className="text-[11px] font-semibold text-text2">{c.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
