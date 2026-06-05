"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconMapPin, IconMail, IconLock, IconEye, IconEyeOff } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { authApi } from "@/services/auth";
import { ApiError } from "@/services/api-client";
import { useUserStore } from "@/store/use-user-store";

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser, setToken } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const tokenRes = await authApi.login({ email, password });
      setToken(tokenRes.access_token);
      localStorage.setItem("token", tokenRes.access_token);
      const user = await authApi.getMe();
      setUser(user);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(59,130,246,0.1) 0%, transparent 70%), #070c1a",
    }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm rounded-3xl p-8" style={{ background: "rgba(11,17,32,0.8)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center justify-center mb-2">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#3b82f6,#10b981)", boxShadow: "0 0 20px rgba(59,130,246,.25)" }}>
            <IconMapPin size={22} color="#fff" />
          </div>
        </div>
        <h1 className="text-xl font-extrabold text-center tracking-tight mb-1">Welcome back</h1>
        <p className="text-[13px] text-text2 text-center mb-7">Sign in to your NearShop account</p>

        {error && (
          <div className="mb-4 p-3 rounded-xl text-xs font-medium" style={{ background: "rgba(239,68,68,0.1)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.2)" }}>
            {error}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-text2">Email</label>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <IconMail size={16} style={{ color: "#475569" }} />
              <input type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-transparent border-none outline-none text-sm text-text font-inherit flex-1 placeholder:text-text3" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-text2">Password</label>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <IconLock size={16} style={{ color: "#475569" }} />
              <input type={showPw ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-transparent border-none outline-none text-sm text-text font-inherit flex-1 placeholder:text-text3" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="bg-transparent border-none cursor-pointer flex" style={{ color: "#475569" }}>
                {showPw ? <IconEyeOff size={16} /> : <IconEye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded" style={{ accentColor: "#3b82f6" }} />
              <span style={{ color: "#94a3b8" }}>Remember me</span>
            </label>
            <Link href="#" className="no-underline" style={{ color: "#60a5fa" }}>Forgot password?</Link>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-xs text-text2 text-center mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold no-underline" style={{ color: "#60a5fa" }}>Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}
