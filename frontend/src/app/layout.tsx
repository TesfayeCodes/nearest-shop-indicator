import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NearShop — Find Shops Near You",
  description:
    "Real-time shop discovery powered by GPS. Navigate, explore, and find exactly what you need.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-inter bg-bg text-text antialiased">{children}</body>
    </html>
  );
}
