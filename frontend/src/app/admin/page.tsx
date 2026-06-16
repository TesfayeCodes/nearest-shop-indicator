"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IconBuildingStore, IconUsers, IconMapPin, IconChecklist, IconChartBar, IconPlus, IconTrendingUp, IconTrendingDown, IconEdit, IconTrash, IconDownload, IconFilter, IconSearch } from "@tabler/icons-react";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { shopsApi } from "@/services/shops";
import { usersApi, type UserAdminResponse } from "@/services/users";
import { useToast } from "@/components/ui/toast";

export default function AdminPage() {
  const [totalShops, setTotalShops] = useState(0);
  const [users, setUsers] = useState<UserAdminResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddShop, setShowAddShop] = useState(false); // toggle add shop form
  const [newShop, setNewShop] = useState({ name: "", lat: "9.03", lng: "38.74", category: "" });
  const { toast } = useToast();

  // handle adding a new shop
  const handleAddShop = async () => {
    if (!newShop.name) { toast("Shop name is required", "error"); return; }
    try {
      await shopsApi.create({
        name: newShop.name,
        latitude: parseFloat(newShop.lat),
        longitude: parseFloat(newShop.lng),
        category_slug: newShop.category || undefined,
      });
      toast("Shop added successfully!", "success");
      setShowAddShop(false);
      setNewShop({ name: "", lat: "9.03", lng: "38.74", category: "" });
    } catch (err) {
      toast("Failed to add shop", "error");
    }
  };

  // handle deleting user (deactivate)
  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to deactivate this user?")) return;
    try {
      await usersApi.deactivate(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      toast("User deactivated", "success");
    } catch {
      toast("Failed to deactivate user", "error");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shopData, userData] = await Promise.all([
          shopsApi.list({ page_size: 1 }),
          usersApi.list(),
        ]);
        setTotalShops(shopData.total);
        setUsers(userData.items);
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { icon: IconBuildingStore, label: "Total Shops", val: totalShops.toLocaleString(), color: "#60a5fa", change: "In database", up: true },
    { icon: IconUsers, label: "Total Users", val: users.length.toLocaleString(), color: "#34d399", change: "Registered", up: true },
    { icon: IconChecklist, label: "Pending", val: "0", color: "#fcd34d", change: "Needs review", up: false },
    { icon: IconMapPin, label: "Cities", val: "1", color: "#c4b5fd", change: "Addis Ababa", up: true },
  ];

  return (
    <>
      <Navbar />
      <div className="flex flex-row pt-nav min-h-screen">
        <Sidebar variant="admin" />
        <main className="ml-side flex-1 p-7 flex flex-col gap-5.5 min-h-[calc(100vh-60px)]">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-[22px] font-extrabold tracking-tight">Admin Panel</h1>
              <p className="text-[13px] text-text2 mt-0.5">Platform management & analytics</p>
            </div>
            <button onClick={() => setShowAddShop(!showAddShop)} className="btn-primary text-xs"><IconPlus size={14} /> {showAddShop ? "Cancel" : "Add Shop"}</button>
          </div>

          {/* Add Shop Form - simple inline form */}
          {showAddShop && (
            <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h3 className="text-sm font-bold">Add New Shop</h3>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Shop name" value={newShop.name} onChange={e => setNewShop({...newShop, name: e.target.value})} className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.07)] rounded-lg px-3 py-2 text-sm text-white outline-none" />
                <input type="text" placeholder="Category slug" value={newShop.category} onChange={e => setNewShop({...newShop, category: e.target.value})} className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.07)] rounded-lg px-3 py-2 text-sm text-white outline-none" />
                <input type="text" placeholder="Latitude" value={newShop.lat} onChange={e => setNewShop({...newShop, lat: e.target.value})} className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.07)] rounded-lg px-3 py-2 text-sm text-white outline-none" />
                <input type="text" placeholder="Longitude" value={newShop.lng} onChange={e => setNewShop({...newShop, lng: e.target.value})} className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.07)] rounded-lg px-3 py-2 text-sm text-white outline-none" />
              </div>
              <button onClick={handleAddShop} className="btn-primary text-xs self-start">Save Shop</button>
            </div>
          )}

          <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3.5">
            {stats.map((m) => (
              <motion.div key={m.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-base p-5 cursor-default relative overflow-hidden">
                <div className="absolute -top-7 -right-7 w-20 h-20 rounded-full opacity-[0.06]" style={{ background: m.color }} />
                <div className="text-[11px] font-semibold uppercase tracking-wider text-text2 mb-3 flex items-center gap-1.5"><m.icon size={14} style={{ color: m.color }} /> {m.label}</div>
                <div className="text-[28px] font-extrabold tracking-tight" style={{ color: m.color }}>{m.val}</div>
                <div className={`text-xs mt-1.5 font-medium flex items-center gap-1 ${m.up ? "text-em-light" : "text-red-400"}`}>{m.up ? <IconTrendingUp size={12} /> : <IconTrendingDown size={12} />}{m.change}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4.5 max-lg:grid-cols-1">
            <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-2 px-5 py-4 text-sm font-bold tracking-tight" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <IconChartBar size={17} style={{ color: "#3b82f6" }} /> Shop Registrations
              </div>
              <div className="p-5 text-xs text-text2 text-center">{totalShops} shops registered</div>
            </div>

            <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-2 px-5 py-4 text-sm font-bold tracking-tight" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <IconChecklist size={17} style={{ color: "#3b82f6" }} /> Pending Approvals
              </div>
              <div className="p-5 text-xs text-text2 text-center">No pending approvals</div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center gap-2 px-5 py-4 text-sm font-bold tracking-tight" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <IconUsers size={17} style={{ color: "#3b82f6" }} /> Users
              <div className="ml-auto flex gap-1.5">
                <button className="w-8 h-8 rounded-lg border border-[rgba(255,255,255,0.07)] bg-transparent text-text2 cursor-pointer flex items-center justify-center text-sm"><IconDownload size={14} /></button>
                <button className="w-8 h-8 rounded-lg border border-[rgba(255,255,255,0.07)] bg-transparent text-text2 cursor-pointer flex items-center justify-center text-sm"><IconFilter size={14} /></button>
                <button className="w-8 h-8 rounded-lg border border-[rgba(255,255,255,0.07)] bg-transparent text-text2 cursor-pointer flex items-center justify-center text-sm"><IconSearch size={14} /></button>
              </div>
            </div>
            {loading ? (
              <div className="p-5 text-xs text-text2 text-center">Loading users...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                      {["User", "Email", "Admin", "Joined", "Status", "Actions"].map((h) => (
                        <th key={h} className="px-4 py-2.5 text-left font-semibold text-[10px] uppercase tracking-wider" style={{ color: "#94a3b8" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr><td colSpan={6} className="px-4 py-5 text-center text-text2">No users found</td></tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u.id} className="border-b border-[rgba(255,255,255,0.07)] last:border-b-0 hover:bg-white/[0.01]">
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0" style={{ background: "rgba(59,130,246,0.12)", color: "#60a5fa" }}>
                                {u.full_name.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-[13px] font-semibold">{u.full_name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5" style={{ color: "#94a3b8" }}>{u.email}</td>
                          <td className="px-4 py-2.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{
                              background: u.is_admin ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)",
                              color: u.is_admin ? "#fcd34d" : "#34d399",
                              border: `1px solid ${u.is_admin ? "rgba(245,158,11,0.2)" : "rgba(16,185,129,0.2)"}`,
                            }}>{u.is_admin ? "Admin" : "User"}</span>
                          </td>
                          <td className="px-4 py-2.5" style={{ color: "#94a3b8" }}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}</td>
                          <td className="px-4 py-2.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: u.is_active ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: u.is_active ? "#34d399" : "#fca5a5", border: `1px solid ${u.is_active ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}` }}>
                              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "currentColor" }} />{u.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            <div className="flex gap-1.5">
                              <button onClick={() => toast("Edit user coming soon", "info")} className="w-8 h-8 rounded-lg border-none bg-transparent text-text2 cursor-pointer flex items-center justify-center text-sm hover:bg-white/5"><IconEdit size={14} style={{ color: "#60a5fa" }} /></button>
                              <button onClick={() => handleDeleteUser(u.id)} className="w-8 h-8 rounded-lg border-none bg-transparent text-text2 cursor-pointer flex items-center justify-center text-sm hover:bg-white/5"><IconTrash size={14} style={{ color: "#fca5a5" }} /></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
