"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconMapPin,
  IconBell,
  IconHome,
  IconLayoutDashboard,
  IconMap,
  IconShieldLock,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

const links = [
  { href: "/", label: "Home", icon: IconHome, id: "nl-landing" },
  { href: "/dashboard", label: "Dashboard", icon: IconLayoutDashboard, id: "nl-dash" },
  { href: "/map", label: "Map View", icon: IconMap, id: "nl-map" },
  { href: "/admin", label: "Admin", icon: IconShieldLock, id: "nl-admin" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-200 h-nav flex items-center px-7 gap-3"
      style={{
        background: "rgba(7,12,26,0.8)",
        backdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <Link href="/" className="flex items-center gap-2.5 no-underline">
        <div
          className="w-[34px] h-[34px] rounded-xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg,#3b82f6,#10b981)",
            boxShadow: "0 0 20px rgba(59,130,246,.25)",
          }}
        >
          <IconMapPin size={18} color="#fff" />
        </div>
        <span className="font-bold text-[15px] tracking-tight text-text">
          Near<span className="text-blue">Shop</span>
        </span>
      </Link>

      <div className="flex gap-0.5 mx-auto">
        {links.map((l) => {
          const isActive = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className="relative px-3.5 py-1.5 rounded-lg text-[13px] font-medium no-underline transition-colors duration-200"
              style={{
                color: isActive ? "#3b82f6" : "#94a3b8",
                background: isActive
                  ? "rgba(59,130,246,.1)"
                  : "transparent",
                border: isActive ? "1px solid rgba(59,130,246,.2)" : "none",
              }}
            >
              {l.label}
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue rounded-full"
                />
              )}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-2.5">
        <button
          className="w-9 h-9 rounded-xl border border-[rgba(255,255,255,0.07)] flex items-center justify-center cursor-pointer relative transition-colors duration-200"
          style={{
            background: "rgba(255,255,255,0.035)",
            color: "#94a3b8",
          }}
        >
          <IconBell size={16} />
          <span
            className="absolute top-[6px] right-[7px] w-[7px] h-[7px] rounded-full"
            style={{
              background: "#3b82f6",
              border: "1.5px solid #070c1a",
            }}
          />
        </button>
        <div
          className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[12px] font-bold cursor-pointer"
          style={{
            background: "linear-gradient(135deg,#3b82f6,#10b981)",
            border: "2px solid rgba(59,130,246,.3)",
          }}
        >
          AK
        </div>
      </div>
    </nav>
  );
}
