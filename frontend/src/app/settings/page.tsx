"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  IconArrowLeft,
  IconSun,
  IconMoon,
  IconBell,
  IconMail,
  IconBuildingStore,
  IconTrash,
  IconAlertTriangle,
  IconUser,
} from "@tabler/icons-react";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";

function Toggle({
  enabled,
  onToggle,
  label,
  description,
  icon: Icon,
  iconColor,
}: {
  enabled: boolean;
  onToggle: () => void;
  label: string;
  description: string;
  icon: React.ComponentType<{ size?: number }>;
  iconColor: string;
}) {
  return (
    <div
      className="flex items-center gap-4 px-5 py-4 rounded-xl"
      style={{
        background: "rgba(255,255,255,0.035)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
        style={{ background: `${iconColor}15`, color: iconColor }}
      >
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-bold text-text">{label}</div>
        <div className="text-[12px] text-text2 mt-0.5">{description}</div>
      </div>
      <button
        onClick={onToggle}
        className="w-[46px] h-[26px] rounded-full flex-shrink-0 cursor-pointer border-none p-0 relative transition-colors duration-200"
        style={{
          background: enabled ? "#3b82f6" : "rgba(255,255,255,0.1)",
        }}
      >
        <div
          className="absolute top-[3px] w-[20px] h-[20px] rounded-full bg-white transition-all duration-200"
          style={{
            left: enabled ? "23px" : "3px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          }}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);
  const [shopUpdates, setShopUpdates] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <>
      <Navbar />
      <div className="flex flex-row pt-nav min-h-screen">
        <Sidebar variant="user" />
        <main className="ml-side flex-1 p-7 flex flex-col gap-5.5 min-h-[calc(100vh-60px)]">
          <div className="flex items-start gap-3">
            <Link
              href="/dashboard"
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-transparent border border-[rgba(255,255,255,0.07)] text-text2 no-underline hover:bg-white/5 transition-colors"
            >
              <IconArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="text-[22px] font-extrabold tracking-tight">Settings</h1>
              <p className="text-[13px] text-text2 mt-0.5">Customize your experience</p>
            </div>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(480px,1fr))] gap-5.5 max-lg:grid-cols-1">
            {/* Appearance */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-base overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <IconSun size={17} style={{ color: "#fcd34d" }} />
                <span className="text-sm font-bold tracking-tight text-text">Appearance</span>
              </div>
              <div className="p-4 flex flex-col gap-3">
                <Toggle enabled={darkMode} onToggle={() => setDarkMode(!darkMode)} label="Dark Mode" description="Currently always dark. Toggle for visual preview." icon={IconMoon} iconColor="#c4b5fd" />
                <div className="flex items-center gap-3 px-5 py-4 rounded-xl" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: "rgba(245,158,11,0.12)", color: "#fcd34d" }}><IconSun size={18} /></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold text-text">Accent Color</div>
                    <div className="text-[12px] text-text2 mt-0.5">Blue (default)</div>
                  </div>
                  <div className="flex gap-2">
                    {["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"].map((c) => (
                      <button key={c} className="w-6 h-6 rounded-full cursor-pointer border-2 transition-transform hover:scale-110" style={{ background: c, borderColor: c === "#3b82f6" ? "#fff" : "transparent" }} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card-base overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <IconBell size={17} style={{ color: "#3b82f6" }} />
                <span className="text-sm font-bold tracking-tight text-text">Notifications</span>
              </div>
              <div className="p-4 flex flex-col gap-3">
                <Toggle enabled={pushNotif} onToggle={() => setPushNotif(!pushNotif)} label="Push Notifications" description="Receive real-time notifications on your device" icon={IconBell} iconColor="#60a5fa" />
                <Toggle enabled={emailNotif} onToggle={() => setEmailNotif(!emailNotif)} label="Email Notifications" description="Get notified about updates via email" icon={IconMail} iconColor="#34d399" />
                <Toggle enabled={shopUpdates} onToggle={() => setShopUpdates(!shopUpdates)} label="Shop Updates" description="Stay informed when nearby shops have updates" icon={IconBuildingStore} iconColor="#fcd34d" />
              </div>
            </motion.div>
          </div>

          {/* Account & Danger Zone */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-base overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <IconUser size={17} style={{ color: "#3b82f6" }} />
              <span className="text-sm font-bold tracking-tight text-text">Account</span>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                <Link href="/profile" className="flex items-center gap-3 px-4 py-4 rounded-xl no-underline cursor-pointer transition-colors" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <IconUser size={18} style={{ color: "#60a5fa" }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold text-text">Edit Profile</div>
                    <div className="text-[12px] text-text2 mt-0.5">Manage your personal information</div>
                  </div>
                </Link>
                <div className="flex items-center gap-3 px-4 py-4 rounded-xl" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <IconBell size={18} style={{ color: "#fcd34d" }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold text-text">Privacy Settings</div>
                    <div className="text-[12px] text-text2 mt-0.5">Control your data visibility</div>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <IconAlertTriangle size={16} style={{ color: "#fca5a5" }} />
                  <span className="text-[13px] font-bold" style={{ color: "#fca5a5" }}>Danger Zone</span>
                </div>
                <div className="flex items-center gap-4 px-5 py-4 rounded-xl" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
                  <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: "rgba(239,68,68,0.12)", color: "#fca5a5" }}><IconTrash size={18} /></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold text-text">Delete Account</div>
                    <div className="text-[12px] text-text2 mt-0.5">Permanently delete your account and all associated data</div>
                  </div>
                  <button className="btn-secondary text-xs" style={{ background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.2)", color: "#fca5a5" }}>
                    <IconTrash size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
}
