import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="flex items-center justify-between flex-wrap gap-3 px-8 py-7 text-[12px] w-full max-w-[940px] mx-auto"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.07)",
        color: "#475569",
      }}
    >
      <span>© 2026 NearShop — Powered by OpenStreetMap</span>
      <div className="flex gap-4">
        <Link href="#" className="no-underline transition-colors" style={{ color: "#60a5fa" }}>
          Privacy
        </Link>
        <Link href="#" className="no-underline transition-colors" style={{ color: "#60a5fa" }}>
          Terms
        </Link>
        <Link href="#" className="no-underline transition-colors" style={{ color: "#60a5fa" }}>
          API
        </Link>
      </div>
    </footer>
  );
}
