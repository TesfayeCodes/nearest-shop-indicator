"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconLayoutDashboard,
  IconMap,
  IconBuildingStore,
  IconHeart,
  IconGridDots,
  IconRoute,
  IconSearch,
  IconBell,
  IconSettings,
  IconChartBar,
  IconUsers,
  IconChecklist,
  IconFileText,
} from "@tabler/icons-react";

const mainLinks = [
  { href: "/dashboard", label: "Dashboard", icon: IconLayoutDashboard },
  { href: "/map", label: "Map View", icon: IconMap },
  { href: "#", label: "Nearby Shops", icon: IconBuildingStore, badge: "12" },
  { href: "#", label: "Favorites", icon: IconHeart },
];

const exploreLinks = [
  { href: "#", label: "Categories", icon: IconGridDots },
  { href: "#", label: "Routes", icon: IconRoute },
  { href: "#", label: "Search", icon: IconSearch },
];

const accountLinks = [
  { href: "#", label: "Notifications", icon: IconBell, badge: "3", amber: true },
  { href: "#", label: "Settings", icon: IconSettings },
];

const adminLinks = [
  { href: "/admin", label: "Analytics", icon: IconChartBar },
  { href: "#", label: "Manage Shops", icon: IconBuildingStore },
  { href: "#", label: "Users", icon: IconUsers },
  { href: "#", label: "Approvals", icon: IconChecklist, badge: "5", amber: true },
  { href: "#", label: "Categories", icon: IconGridDots },
  { href: "#", label: "Activity Logs", icon: IconFileText },
];

const systemLinks = [
  { href: "#", label: "Settings", icon: IconSettings },
];

interface SidebarProps {
  variant?: "user" | "admin";
}

export default function Sidebar({ variant = "user" }: SidebarProps) {
  const pathname = usePathname();
  const links = variant === "admin" ? adminLinks : mainLinks;
  const bottomLinks = variant === "admin" ? systemLinks : accountLinks;
  const secondaryLinks = variant === "admin" ? [] : exploreLinks;

  return (
    <aside
      className="w-side flex-shrink-0 fixed top-nav bottom-0 left-0 z-50 overflow-y-auto flex flex-col gap-0.5 p-5 px-3"
      style={{
        background: "#0b1120",
        borderRight: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="text-[10px] font-semibold uppercase tracking-widest px-3 pt-2.5 pb-1"
        style={{ color: "#475569" }}
      >
        {variant === "admin" ? "Admin" : "Main"}
      </div>
      {links.map((l) => {
        const Icon = l.icon;
        const isActive = pathname === l.href;
        return (
          <Link
            key={l.label}
            href={l.href}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium no-underline transition-colors duration-200"
            style={{
              color: isActive ? "#3b82f6" : "#94a3b8",
              background: isActive ? "rgba(59,130,246,.1)" : "transparent",
              fontWeight: isActive ? 600 : 500,
            }}
          >
            <Icon size={17} />
            {l.label}
            {l.badge && (
              <span
                className="ml-auto text-[10px] font-bold px-[7px] py-[1px] rounded-full min-w-[18px] text-center text-white"
                style={{ background: l.amber ? "#f59e0b" : "#3b82f6" }}
              >
                {l.badge}
              </span>
            )}
          </Link>
        );
      })}

      {secondaryLinks.length > 0 && (
        <>
          <div className="text-[10px] font-semibold uppercase tracking-widest px-3 pt-5 pb-1"
            style={{ color: "#475569" }}
          >
            Explore
          </div>
          {secondaryLinks.map((l) => {
            const Icon = l.icon;
            return (
              <Link
                key={l.label}
                href={l.href}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium no-underline transition-colors duration-200"
                style={{ color: "#94a3b8" }}
              >
                <Icon size={17} />
                {l.label}
              </Link>
            );
          })}
        </>
      )}

      <>
        <div className="text-[10px] font-semibold uppercase tracking-widest px-3 pt-5 pb-1"
          style={{ color: "#475569" }}
        >
          {variant === "admin" ? "System" : "Account"}
        </div>
        {bottomLinks.map((l) => {
          const Icon = l.icon;
          return (
            <Link
              key={l.label}
              href={l.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium no-underline transition-colors duration-200"
              style={{ color: "#94a3b8" }}
            >
              <Icon size={17} />
              {l.label}
              {l.badge && (
                <span
                  className="ml-auto text-[10px] font-bold px-[7px] py-[1px] rounded-full min-w-[18px] text-center text-white"
                  style={{ background: l.amber ? "#f59e0b" : "#3b82f6" }}
                >
                  {l.badge}
                </span>
              )}
            </Link>
          );
        })}
      </>

      <div className="mt-auto pt-4">
        <div
          className="flex items-center gap-2.5 p-3 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.035)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            className="w-[34px] h-[34px] rounded-full flex-shrink-0 flex items-center justify-center text-[12px] font-bold"
            style={{
              background: "linear-gradient(135deg,#3b82f6,#10b981)",
            }}
          >
            {variant === "admin" ? "AD" : "AK"}
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-text">
              {variant === "admin" ? "Admin" : "Abebe K."}
            </div>
            <div className="text-[11px]" style={{ color: variant === "admin" ? "#fcd34d" : "#60a5fa" }}>
              {variant === "admin" ? "Super Admin" : "Pro Plan"}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
