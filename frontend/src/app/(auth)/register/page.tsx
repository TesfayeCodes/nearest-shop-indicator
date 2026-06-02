"use client";

import { useState } from "react";
import Link from "next/link";
import { IconMapPin, IconMail, IconLock, IconUser, IconEye, IconEyeOff } from "@tabler/icons-react";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [showPw, setShowPw] = useState(false);

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
        <h1 className="text-xl font-extrabold text-center tracking-tight mb-1">Create account</h1>
        <p className="text-[13px] text-text2 text-center mb-7">Join NearShop today</p>

        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-text2">Full Name</label>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <IconUser size={16} style={{ color: "#475569" }} />
              <input type="text" placeholder="Abebe Kebede" className="bg-transparent border-none outline-none text-sm text-text font-inherit flex-1 placeholder:text-text3" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-text2">Email</label>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <IconMail size={16} style={{ color: "#475569" }} />
              <input type="email" placeholder="you@email.com" className="bg-transparent border-none outline-none text-sm text-text font-inherit flex-1 placeholder:text-text3" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-text2">Password</label>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <IconLock size={16} style={{ color: "#475569" }} />
              <input type={showPw ? "text" : "password"} placeholder="••••••••" className="bg-transparent border-none outline-none text-sm text-text font-inherit flex-1 placeholder:text-text3" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="bg-transparent border-none cursor-pointer flex" style={{ color: "#475569" }}>
                {showPw ? <IconEyeOff size={16} /> : <IconEye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full justify-center">Create Account</button>
        </form>

        <p className="text-xs text-text2 text-center mt-6">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold no-underline" style={{ color: "#60a5fa" }}>Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
