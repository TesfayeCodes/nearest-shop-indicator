"use client";

import { motion } from "framer-motion";
import { IconBuildingStore, IconUsers, IconMapPin, IconChecklist, IconChartBar, IconPlus, IconTrendingUp, IconTrendingDown, IconShoppingCart, IconCoffee, IconToolsKitchen2, IconEdit, IconTrash, IconDownload, IconFilter, IconSearch, IconX } from "@tabler/icons-react";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";

const barData = [
  { h: 55, color: "#3b82f6", label: "Jan" },
  { h: 78, color: "#3b82f6", label: "Feb" },
  { h: 52, color: "#3b82f6", label: "Mar" },
  { h: 92, color: "#3b82f6", label: "Apr" },
  { h: 84, color: "#10b981", label: "May" },
  { h: 110, color: "#10b981", label: "Jun" },
];

const approvals = [
  { icon: IconShoppingCart, name: "City Grocers", meta: "Grocery · Bole", bg: "rgba(59,130,246,0.1)", color: "#60a5fa" },
  { icon: IconCoffee, name: "Morning Roast", meta: "Cafe · Kazanchis", bg: "rgba(16,185,129,0.1)", color: "#34d399" },
  { icon: IconToolsKitchen2, name: "QuickBite Grill", meta: "Restaurant · Piassa", bg: "rgba(245,158,11,0.1)", color: "#fcd34d" },
];

const users = [
  { initials: "AK", avatarBg: "rgba(59,130,246,0.12)", avatarColor: "#60a5fa", name: "Abebe K.", email: "abebe@email.com", city: "Addis Ababa", plan: "Pro", planClass: "pro", joined: "May 2026", active: true },
  { initials: "SM", avatarBg: "rgba(139,92,246,0.12)", avatarColor: "#c4b5fd", name: "Sara M.", email: "sara@email.com", city: "Hawassa", plan: "Free", planClass: "free", joined: "Apr 2026", active: true },
  { initials: "YT", avatarBg: "rgba(245,158,11,0.12)", avatarColor: "#fcd34d", name: "Yonas T.", email: "yonas@email.com", city: "Dire Dawa", plan: "Team", planClass: "team", joined: "Mar 2026", active: false },
];

export default function AdminPage() {
  return (
    <>
      <Navbar />
      <div className="flex flex-row pt-nav min-h-screen">
        <Sidebar variant="admin" />
        <main className="ml-side flex-1 p-7 flex flex-col gap-5.5 min-h-[calc(100vh-60px)]">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-[22px] font-extrabold tracking-tight">Admin Panel</h1>
              <p className="text-[13px] text-text2 mt-0.5">Platform management & analytics</p>
            </div>
            <button className="btn-primary text-xs"><IconPlus size={14} /> Add Shop</button>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3.5">
            {[
              { icon: IconBuildingStore, label: "Total Shops", val: "50,284", color: "#60a5fa", change: "142 this week", up: true },
              { icon: IconUsers, label: "Total Users", val: "2.1M", color: "#34d399", change: "+8% MoM", up: true },
              { icon: IconChecklist, label: "Pending", val: "5", color: "#fcd34d", change: "Needs review", up: false },
              { icon: IconMapPin, label: "Cities", val: "120", color: "#c4b5fd", change: "3 new", up: true },
            ].map((m) => (
              <motion.div key={m.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-base p-5 cursor-default relative overflow-hidden">
                <div className="absolute -top-7 -right-7 w-20 h-20 rounded-full opacity-[0.06]" style={{ background: m.color }} />
                <div className="text-[11px] font-semibold uppercase tracking-wider text-text2 mb-3 flex items-center gap-1.5"><m.icon size={14} style={{ color: m.color }} /> {m.label}</div>
                <div className="text-[28px] font-extrabold tracking-tight" style={{ color: m.color }}>{m.val}</div>
                <div className={`text-xs mt-1.5 font-medium flex items-center gap-1 ${m.up ? "text-em-light" : "text-red-400"}`}>{m.up ? <IconTrendingUp size={12} /> : <IconTrendingDown size={12} />}{m.change}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4.5 max-lg:grid-cols-1">
            <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-2 px-5 py-4 text-sm font-bold tracking-tight" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <IconChartBar size={17} style={{ color: "#3b82f6" }} /> Shop Registrations
              </div>
              <div className="p-5 pb-4">
                <div className="flex items-end gap-1.5 h-[110px] px-1">
                  {barData.map((b) => (
                    <div key={b.label} className="flex flex-col items-center gap-1 flex-1">
                      <motion.div initial={{ height: 0 }} animate={{ height: b.h }} transition={{ duration: 0.6, delay: 0.1 }} className="w-full rounded-t-md min-h-[6px]" style={{ height: b.h, background: b.color, opacity: 0.7 }} />
                      <div className="text-[10px] text-text3">{b.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-2 px-5 py-4 text-sm font-bold tracking-tight" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <IconChecklist size={17} style={{ color: "#3b82f6" }} /> Pending Approvals
              </div>
              <div className="flex flex-col">
                {approvals.map((a, i) => {
                  const Icon = a.icon;
                  return (
                    <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-[rgba(255,255,255,0.07)] last:border-b-0">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: a.bg }}><Icon size={17} style={{ color: a.color }} /></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-text">{a.name}</div>
                        <div className="text-[11px] text-text2">{a.meta}</div>
                      </div>
                      <div className="flex gap-1.5">
                        <button className="px-3 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer border-none transition-colors" style={{ background: "rgba(16,185,129,0.15)", color: "#34d399", border: "1px solid rgba(16,185,129,0.2)" }}><IconChecklist size={11} /> Approve</button>
                        <button className="px-3 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer border-none transition-colors" style={{ background: "rgba(239,68,68,0.1)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.2)" }}><IconX size={11} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center gap-2 px-5 py-4 text-sm font-bold tracking-tight" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <IconUsers size={17} style={{ color: "#3b82f6" }} /> Recent Users
              <div className="ml-auto flex gap-1.5">
                <button className="w-8 h-8 rounded-lg border border-[rgba(255,255,255,0.07)] bg-transparent text-text2 cursor-pointer flex items-center justify-center text-sm"><IconDownload size={14} /></button>
                <button className="w-8 h-8 rounded-lg border border-[rgba(255,255,255,0.07)] bg-transparent text-text2 cursor-pointer flex items-center justify-center text-sm"><IconFilter size={14} /></button>
                <button className="w-8 h-8 rounded-lg border border-[rgba(255,255,255,0.07)] bg-transparent text-text2 cursor-pointer flex items-center justify-center text-sm"><IconSearch size={14} /></button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    {["User", "City", "Plan", "Joined", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left font-semibold text-[10px] uppercase tracking-wider" style={{ color: "#94a3b8" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.email} className="border-b border-[rgba(255,255,255,0.07)] last:border-b-0 hover:bg-white/[0.01]">
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0" style={{ background: u.avatarBg, color: u.avatarColor }}>{u.initials}</div>
                          <div>
                            <div className="text-[13px] font-semibold">{u.name}</div>
                            <div className="text-[11px]" style={{ color: "#475569" }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2.5" style={{ color: "#94a3b8" }}>{u.city}</td>
                      <td className="px-4 py-2.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{
                          background: u.planClass === "pro" ? "rgba(59,130,246,0.1)" : u.planClass === "free" ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)",
                          color: u.planClass === "pro" ? "#60a5fa" : u.planClass === "free" ? "#34d399" : "#fcd34d",
                          border: `1px solid ${u.planClass === "pro" ? "rgba(59,130,246,0.2)" : u.planClass === "free" ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)"}`,
                        }}>{u.plan}</span>
                      </td>
                      <td className="px-4 py-2.5" style={{ color: "#94a3b8" }}>{u.joined}</td>
                      <td className="px-4 py-2.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: u.active ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: u.active ? "#34d399" : "#fca5a5", border: `1px solid ${u.active ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}` }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "currentColor" }} />{u.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex gap-1.5">
                          <button className="w-8 h-8 rounded-lg border-none bg-transparent text-text2 cursor-pointer flex items-center justify-center text-sm hover:bg-white/5"><IconEdit size={14} style={{ color: "#60a5fa" }} /></button>
                          <button className="w-8 h-8 rounded-lg border-none bg-transparent text-text2 cursor-pointer flex items-center justify-center text-sm hover:bg-white/5"><IconTrash size={14} style={{ color: "#fca5a5" }} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
