import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "#070c1a",
        bg2: "#0b1120",
        bg3: "#0f1629",
        surface: "rgba(255,255,255,0.035)",
        surface2: "rgba(255,255,255,0.055)",
        border: "rgba(255,255,255,0.07)",
        border2: "rgba(255,255,255,0.12)",
        blue: { DEFAULT: "#3b82f6", dark: "#1d4ed8", light: "#60a5fa" },
        em: { DEFAULT: "#10b981", dark: "#059669", light: "#34d399" },
        purple: { DEFAULT: "#8b5cf6" },
        amber: { DEFAULT: "#f59e0b" },
        text: { DEFAULT: "#f8fafc", 2: "#94a3b8", 3: "#475569" },
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      spacing: {
        nav: "60px",
        side: "230px",
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "18px",
        "4xl": "22px",
      },
      animation: {
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
        pfloat: "pfloat 3s ease-in-out infinite",
        upulse: "upulse 2s ease-in-out infinite",
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(16,185,129,0.4)" },
          "50%": { boxShadow: "0 0 0 5px rgba(16,185,129,0)" },
        },
        pfloat: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-9px)" },
        },
        upulse: {
          "0%, 100%": {
            boxShadow:
              "0 0 0 6px rgba(59,130,246,0.25), 0 0 0 14px rgba(59,130,246,0.08)",
          },
          "50%": {
            boxShadow:
              "0 0 0 10px rgba(59,130,246,0.15), 0 0 0 22px rgba(59,130,246,0.04)",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
