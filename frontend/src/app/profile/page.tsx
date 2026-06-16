"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  IconArrowLeft,
  IconUser,
  IconMail,
  IconShield,
  IconCalendar,
  IconLogout,
  IconCheck,
  IconPencil,
  IconX,
} from "@tabler/icons-react";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { useUserStore } from "@/store/use-user-store";
import { authApi } from "@/services/auth";
import { useToast } from "@/components/ui/toast";

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, setUser, logout } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.replace("/login"); return; }
    const fetchUser = async () => {
      try {
        if (!user) {
          const me = await authApi.getMe();
          setUser(me);
          setName(me.full_name);
        } else {
          setName(user.full_name);
        }
      } catch { router.replace("/login"); } finally { setLoading(false); }
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const updated = await authApi.updateMe({ full_name: name.trim() });
      setUser(updated);
      setEditing(false);
      toast("Profile updated successfully", "success");
    } catch { toast("Failed to update profile", "error"); } finally { setSaving(false); }
  };

  const handleSignOut = () => {
    logout();
    toast("Signed out successfully", "info");
    router.replace("/login");
  };

  const initials = user
    ? user.full_name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex flex-row pt-nav min-h-screen">
          <Sidebar variant="user" />
          <main className="ml-side flex-1 p-7 flex items-center justify-center min-h-[calc(100vh-60px)]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              <span className="text-xs text-text2">Loading profile...</span>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-row pt-nav min-h-screen">
        <Sidebar variant="user" />
        <main className="ml-side flex-1 p-7 flex flex-col gap-5.5 min-h-[calc(100vh-60px)]">
          <div className="flex items-start gap-3">
            <Link href="/dashboard" className="w-8 h-8 rounded-lg flex items-center justify-center bg-transparent border border-[rgba(255,255,255,0.07)] text-text2 no-underline hover:bg-white/5 transition-colors">
              <IconArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="text-[22px] font-extrabold tracking-tight">Profile</h1>
              <p className="text-[13px] text-text2 mt-0.5">Manage your account</p>
            </div>
          </div>

          <div className="grid grid-cols-[340px_1fr] gap-5 max-lg:grid-cols-1">
            {/* Left - Profile Card */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-base p-7 flex flex-col items-center gap-5">
              <div className="w-[90px] h-[90px] rounded-full flex items-center justify-center text-[28px] font-extrabold text-white" style={{ background: "linear-gradient(135deg,#3b82f6,#10b981)", boxShadow: "0 0 30px rgba(59,130,246,0.25)", border: "3px solid rgba(59,130,246,0.3)" }}>
                {initials}
              </div>
              <div className="text-center">
                <h2 className="text-[18px] font-bold tracking-tight text-text">{user?.full_name || "Unknown User"}</h2>
                <p className="text-[13px] text-text2 mt-1">{user?.email}</p>
              </div>
              <div className="w-full flex flex-col gap-2.5">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <IconShield size={16} style={{ color: "#60a5fa" }} />
                  <div>
                    <div className="text-[11px] text-text3 uppercase tracking-wider font-semibold">Role</div>
                    <div className="text-[13px] font-semibold text-text">{user?.is_admin ? "Admin" : "User"}</div>
                  </div>
                  {user?.is_admin && (
                    <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(245,158,11,0.1)", color: "#fcd34d", border: "1px solid rgba(245,158,11,0.2)" }}>Admin</span>
                  )}
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <IconCalendar size={16} style={{ color: "#34d399" }} />
                  <div>
                    <div className="text-[11px] text-text3 uppercase tracking-wider font-semibold">Member Since</div>
                    <div className="text-[13px] font-semibold text-text">{user?.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <IconMail size={16} style={{ color: "#c4b5fd" }} />
                  <div>
                    <div className="text-[11px] text-text3 uppercase tracking-wider font-semibold">Email</div>
                    <div className="text-[13px] font-semibold text-text">{user?.email || "—"}</div>
                  </div>
                </div>
              </div>
              <button onClick={handleSignOut} className="w-full btn-secondary justify-center text-red-400 mt-2" style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.2)" }}>
                <IconLogout size={16} /> Sign Out
              </button>
            </motion.div>

            {/* Right - Edit Details */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-base p-7 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-bold tracking-tight text-text">Personal Information</h3>
                {!editing ? (
                  <button onClick={() => setEditing(true)} className="btn-ghost text-xs">
                    <IconPencil size={14} /> Edit
                  </button>
                ) : (
                  <button onClick={() => { setEditing(false); setName(user?.full_name || ""); }} className="btn-ghost text-xs">
                    <IconX size={14} /> Cancel
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-text2">Full Name</label>
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm" style={{ background: editing ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.035)", border: editing ? "1px solid rgba(59,130,246,0.3)" : "1px solid rgba(255,255,255,0.07)" }}>
                    <IconUser size={16} style={{ color: "#475569" }} />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={!editing} className="bg-transparent border-none outline-none text-sm text-text font-inherit flex-1 placeholder:text-text3 disabled:opacity-70" placeholder="Your full name" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-text2">Email Address</label>
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <IconMail size={16} style={{ color: "#475569" }} />
                    <span className="text-sm text-text2 opacity-70">{user?.email || "—"}</span>
                    <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)", color: "#475569", border: "1px solid rgba(255,255,255,0.07)" }}>Read only</span>
                  </div>
                </div>
              </div>
              {editing && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 pt-2">
                  <button onClick={handleSave} disabled={saving || !name.trim()} className="btn-primary text-xs">
                    {saving ? (
                      <span className="flex items-center gap-2"><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Saving...</span>
                    ) : (<><IconCheck size={14} /> Save Changes</>)}
                  </button>
                </motion.div>
              )}
              <div className="pt-3 mt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <h3 className="text-[15px] font-bold tracking-tight text-text mb-4">Account Details</h3>
                <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                  <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="text-[11px] text-text3 uppercase tracking-wider font-semibold mb-1">User ID</div>
                    <div className="text-[13px] font-bold text-text">#{user?.id || "—"}</div>
                  </div>
                  <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="text-[11px] text-text3 uppercase tracking-wider font-semibold mb-1">Account Status</div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: user?.is_active ? "#34d399" : "#fca5a5" }} />
                      <span className="text-[13px] font-bold text-text">{user?.is_active ? "Active" : "Inactive"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
}
