import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast"; // toast notifications

export const metadata: Metadata = {
  title: "NearShop — Find Shops Near You, Instantly",
  description:
    "Real-time shop discovery powered by GPS. Navigate, explore, and find exactly what you need in seconds. Discover 50K+ shops across 120+ cities.",
  keywords: ["shop finder", "nearby shops", "GPS navigation", "local business", "shop discovery"],
  authors: [{ name: "NearShop Team" }],
  openGraph: {
    title: "NearShop — Find Shops Near You, Instantly",
    description: "Real-time shop discovery powered by GPS. Navigate, explore, and find exactly what you need.",
    type: "website",
    siteName: "NearShop",
  },
  twitter: {
    card: "summary_large_image",
    title: "NearShop — Find Shops Near You, Instantly",
    description: "Real-time shop discovery powered by GPS. Navigate, explore, and find exactly what you need.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#070c1a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="font-inter antialiased"><ToastProvider>{children}</ToastProvider></body>
    </html>
  );
}
