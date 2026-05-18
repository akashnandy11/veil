"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Users, Shield, Trash2, Ban, CheckCircle, ArrowLeft, Activity, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

interface User {
  _id: string;
  username: string;
  email: string;
  gender: string;
  age: number;
  role: string;
  isBanned: boolean;
  createdAt: string;
  lastActive: string;
}

interface Stats {
  totalUsers: number;
  bannedUsers: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, bannedUsers: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as any)?.role !== "admin") {
      router.push("/");
    }
  }, [session, status, router]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setUsers(data.users);
      setStats(data.stats);
    } catch (err) {
      toast.error("Access denied");
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId: string, action: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(data.message);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const filteredUsers = users.filter(
    (u) => u.username?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <Shield size={40} color="#a855f7" style={{ margin: "0 auto 1rem" }} />
          <p style={{ color: "var(--text2)" }}>Loading admin panel...</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", padding: "1.5rem", maxWidth: 900, margin: "0 auto" }}>
      
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "2rem" }}>
        <button onClick={() => router.push("/")} className="glass" style={{ padding: "0.5rem 1rem", borderRadius: 10, display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem" }}>
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Shield size={20} color="#a855f7" />
          <h1 style={{ fontSize: "1.3rem", fontWeight: 800, fontFamily: "Space Grotesk, sans-serif" }}>Admin Dashboard</h1>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: "2rem" }}>
        {[
          { label: "Total Users", value: stats.totalUsers, icon: <Users size={20} />, color: "#a855f7" },
          { label: "Banned Accounts", value: stats.bannedUsers, icon: <Ban size={20} />, color: "#ef4444" },
          { label: "Active Users", value: stats.totalUsers - stats.bannedUsers, icon: <Activity size={20} />, color: "#10b981" },
        ].map((stat) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass" style={{ padding: "1.2rem", borderRadius: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ color: stat.color }}>{stat.icon}</div>
              <span style={{ fontSize: "0.8rem", color: "var(--text2)", fontWeight: 600 }}>{stat.label}</span>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: stat.color }}>{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by username or email..."
        className="input-glass"
        style={{ width: "100%", marginBottom: "1.5rem" }}
      />

      {/* Users Table */}
      <div className="glass" style={{ borderRadius: 20, overflow: "hidden" }}>
        <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
          <Users size={18} color="#a855f7" />
          <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>Registered Users ({filteredUsers.length})</span>
        </div>

        {filteredUsers.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text3)" }}>
            <AlertTriangle size={32} style={{ margin: "0 auto 1rem", opacity: 0.5 }} />
            <p>No users found</p>
          </div>
        ) : (
          filteredUsers.map((user, i) => (
            <motion.div key={user._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
              style={{ padding: "1rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", gap: 16, background: user.isBanned ? "rgba(239,68,68,0.04)" : "transparent" }}>
              
              {/* Avatar */}
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${user.gender === "female" ? "#f472b6,#a855f7" : "#60a5fa,#6366f1"})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 }}>
                {user.gender === "female" ? "👩" : "👨"}
              </div>

              {/* User Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{user.username}</span>
                  {user.role === "admin" && <span style={{ fontSize: "0.65rem", background: "rgba(168,85,247,0.2)", color: "#a855f7", padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>ADMIN</span>}
                  {user.isBanned && <span style={{ fontSize: "0.65rem", background: "rgba(239,68,68,0.2)", color: "#ef4444", padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>BANNED</span>}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text3)", marginTop: 2 }}>{user.email}</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text3)", marginTop: 2 }}>
                  {user.gender} • {user.age} yrs • Joined {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Actions */}
              {user.role !== "admin" && (
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  {user.isBanned ? (
                    <button onClick={() => handleAction(user._id, "unban")} className="glass" style={{ padding: "6px 12px", borderRadius: 8, fontSize: "0.78rem", color: "#10b981", display: "flex", alignItems: "center", gap: 4 }}>
                      <CheckCircle size={14} /> Unban
                    </button>
                  ) : (
                    <button onClick={() => handleAction(user._id, "ban")} className="glass" style={{ padding: "6px 12px", borderRadius: 8, fontSize: "0.78rem", color: "#f59e0b", display: "flex", alignItems: "center", gap: 4 }}>
                      <Ban size={14} /> Ban
                    </button>
                  )}
                  <button onClick={() => { if (confirm(`Delete ${user.username}? This cannot be undone.`)) handleAction(user._id, "delete"); }} className="glass" style={{ padding: "6px 12px", borderRadius: 8, fontSize: "0.78rem", color: "#ef4444", display: "flex", alignItems: "center", gap: 4 }}>
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </main>
  );
}
