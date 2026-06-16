"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  IconMapPin,
  IconBell,
  IconHome,
  IconLayoutDashboard,
  IconMap,
  IconShieldLock,
  IconMenu2,
  IconX,
  IconUser,
  IconSettings,
  IconLogout,
  IconHeart,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "/", label: "Home", icon: IconHome },
  { href: "/dashboard", label: "Dashboard", icon: IconLayoutDashboard },
  { href: "/map", label: "Map View", icon: IconMap },
  { href: "/admin", label: "Admin", icon: IconShieldLock },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[200] h-nav flex items-center px-4 md:px-7 gap-3 glass"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
    >
      <Link href="/" className="flex items-center gap-2.5 no-underline flex-shrink-0">
        <div className="w-[34px] h-[34px] rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#3b82f6,#10b981)", boxShadow: "0 0 20px rgba(59,130,246,.25)" }}
        >
          <IconMapPin size={18} color="#fff" />
        </div>
        <span className="font-bold text-[15px] tracking-tight text-[#f8fafc] hidden sm:inline">
          Near<span className="text-[#3b82f6]">Shop</span>
        </span>
      </Link>

      <div className="hidden md:flex gap-0.5 mx-auto">
        {links.map((l) => {
          const isActive = pathname === l.href;
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              className="relative px-3.5 py-1.5 rounded-lg text-[13px] font-medium no-underline transition-colors duration-200 flex items-center gap-1.5"
              style={{
                color: isActive ? "#3b82f6" : "#94a3b8",
                background: isActive ? "rgba(59,130,246,.1)" : "transparent",
                border: isActive ? "1px solid rgba(59,130,246,.2)" : "1px solid transparent",
              }}
            >
              <Icon size={15} />
              {l.label}
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#3b82f6] rounded-full"
                />
              )}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-2.5 ml-auto">
        <button className="w-9 h-9 rounded-xl border border-[rgba(255,255,255,0.07)] flex items-center justify-center cursor-pointer relative transition-colors duration-200 hover:bg-white/5 hover:text-[#f8fafc]"
          style={{ background: "rgba(255,255,255,0.035)", color: "#94a3b8" }}
        >
          <IconBell size={16} />
          <span className="absolute top-[6px] right-[7px] w-[7px] h-[7px] rounded-full bg-[#3b82f6]"
            style={{ border: "1.5px solid #070c1a" }}
          />
        </button>

        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[12px] font-bold cursor-pointer transition-transform hover:scale-105"
            style={{ background: "linear-gradient(135deg,#3b82f6,#10b981)", border: "2px solid rgba(59,130,246,.3)" }}
          >
            AK
          </button>
          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-48 rounded-xl p-1.5 z-50"
                style={{ background: "rgba(11,17,32,0.95)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                {[
                  { icon: IconUser, label: "Profile", href: "#" },
                  { icon: IconHeart, label: "Favorites", href: "#", badge: "3" },
                  { icon: IconSettings, label: "Settings", href: "#" },
                  { icon: IconLogout, label: "Sign Out", href: "/login", danger: true },
                ].map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium no-underline transition-colors"
                      style={{ color: item.danger ? "#fca5a5" : "#94a3b8" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <ItemIcon size={16} />
                      {item.label}
                      {item.badge && (
                        <span className="ml-auto text-[10px] font-bold px-[7px] py-[1px] rounded-full bg-[#3b82f6] text-white">{item.badge}</span>
                      )}
                    </Link>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer border border-[rgba(255,255,255,0.07)] bg-transparent"
          style={{ color: "#94a3b8" }}
        >
          {mobileOpen ? <IconX size={18} /> : <IconMenu2 size={18} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-nav left-0 right-0 z-[199] p-4 md:hidden"
            style={{ background: "rgba(7,12,26,0.98)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex flex-col gap-1">
              {links.map((l) => {
                const isActive = pathname === l.href;
                const Icon = l.icon;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium no-underline transition-colors"
                    style={{
                      color: isActive ? "#3b82f6" : "#94a3b8",
                      background: isActive ? "rgba(59,130,246,.1)" : "transparent",
                    }}
                  >
                    <Icon size={18} />
                    {l.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
