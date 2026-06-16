import Link from "next/link";
import { IconMapPin, IconBrandGithub, IconHeart } from "@tabler/icons-react";

export default function Footer() {
  return (
    <footer className="w-full" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="section-wrap py-8">
        <div className="grid grid-cols-[1fr_auto] gap-8 max-md:grid-cols-1">
          <div>
            <Link href="/" className="flex items-center gap-2 no-underline mb-3">
              <div className="w-[28px] h-[28px] rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#3b82f6,#10b981)" }}>
                <IconMapPin size={14} color="#fff" />
              </div>
              <span className="font-bold text-[14px] tracking-tight text-[#f8fafc]">
                Near<span className="text-[#3b82f6]">Shop</span>
              </span>
            </Link>
            <p className="text-[12px]" style={{ color: "#475569", maxWidth: 300 }}>
              Real-time shop discovery powered by GPS and OpenStreetMap.
            </p>
          </div>
          <div className="flex gap-8 max-md:flex-wrap max-md:gap-4">
            {[
              { title: "Product", links: [{ label: "Dashboard", href: "/dashboard" }, { label: "Map", href: "/map" }, { label: "API", href: "#" }] },
              { title: "Company", links: [{ label: "About", href: "#" }, { label: "Blog", href: "#" }, { label: "Contact", href: "#" }] },
              { title: "Legal", links: [{ label: "Privacy", href: "#" }, { label: "Terms", href: "#" }, { label: "Licenses", href: "#" }] },
            ].map((group) => (
              <div key={group.title}>
                <div className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "#475569" }}>{group.title}</div>
                <div className="flex flex-col gap-1.5">
                  {group.links.map((link) => (
                    <Link key={link.label} href={link.href} className="text-[12px] no-underline transition-colors hover:text-[#f8fafc]" style={{ color: "#94a3b8" }}>{link.label}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between flex-wrap gap-2 mt-7 pt-5 text-[11px]" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", color: "#475569" }}>
          <span>© 2026 NearShop — Powered by OpenStreetMap</span>
          <span className="flex items-center gap-1">Made with <IconHeart size={11} style={{ color: "#ef4444" }} /> for local businesses</span>
        </div>
      </div>
    </footer>
  );
}
