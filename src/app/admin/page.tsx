"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { generateAnonymousIdentity, timeAgo } from "@/lib/utils";
import {
  Shield, Users, MessageCircle, Flag, Ban, TrendingUp, Eye,
  AlertTriangle, Check, X, ChevronDown, Activity, Search,
  Download, Filter, ArrowLeft, Zap
} from "lucide-react";
import toast from "react-hot-toast";

const generateUsers = () =>
  Array.from({ length: 18 }, (_, i) => {
    const id = generateAnonymousIdentity();
    return {
      id: `u${i}`,
      username: id.username,
      emoji: id.emoji,
      color: id.color,
      email: i % 3 === 0 ? `user${i}@gmail.com` : undefined,
      phone: i % 4 === 0 ? `+91 9876${String(i).padStart(6, "0")}` : undefined,
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      device: ["Chrome/Android", "Safari/iOS", "Firefox/Windows", "Chrome/MacOS"][i % 4],
      joinedAt: new Date(Date.now() - Math.random() * 86400000 * 30),
      isOnline: Math.random() > 0.5,
      isAdult: Math.random() > 0.6,
      messages: Math.floor(Math.random() * 500),
      reports: Math.floor(Math.random() * 3),
      status: (["active", "active", "active", "active", "warned", "banned"] as const)[Math.floor(Math.random() * 6)],
    };
  });

const generateReports = () =>
  Array.from({ length: 8 }, (_, i) => ({
    id: `r${i}`,
    reportedUser: generateAnonymousIdentity().username,
    reportedBy: generateAnonymousIdentity().username,
    reason: ["Spam", "Harassment", "Explicit content", "Fake profile", "Hate speech"][i % 5],
    timestamp: new Date(Date.now() - Math.random() * 86400000 * 7),
    status: (["pending", "resolved", "pending", "dismissed"] as const)[i % 4],
    severity: (["low", "medium", "high", "critical"] as const)[i % 4],
  }));

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAppStore();
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "reports" | "analytics">("overview");
  const [users, setUsers] = useState<ReturnType<typeof generateUsers>>([]);
  const [reports, setReports] = useState<ReturnType<typeof generateReports>>([]);
  const [search, setSearch] = useState("");
  const [bannedIds, setBannedIds] = useState<string[]>([]);
  const [resolvedReports, setResolvedReports] = useState<string[]>([]);

  useEffect(() => {
    if (!isAuthenticated) router.push("/");
    setUsers(generateUsers());
    setReports(generateReports());
  }, [isAuthenticated, router]);

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const banUser = (id: string, username: string) => {
    setBannedIds(p => [...p, id]);
    toast.success(`🔨 ${username} banned`);
  };

  const resolveReport = (id: string) => {
    setResolvedReports(p => [...p, id]);
    toast.success("Report resolved ✓");
  };

  const statusColor = { active: "#10b981", warned: "#f59e0b", banned: "#ef4444" };
  const severityColor = { low: "#10b981", medium: "#f59e0b", high: "#f97316", critical: "#ef4444" };

  const overviewStats = [
    { icon: Users, label: "Total Users", value: "1,247", change: "+12%", color: "#a855f7" },
    { icon: MessageCircle, label: "Messages Today", value: "48.3K", change: "+8%", color: "#06b6d4" },
    { icon: Flag, label: "Open Reports", value: reports.filter(r => r.status === "pending").length.toString(), change: "-3", color: "#f59e0b" },
    { icon: Ban, label: "Banned Today", value: "3", change: "+1", color: "#ef4444" },
  ];

  return (
    <main style={{ minHeight: "100vh", paddingBottom: 40, maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ padding: "2rem 1.25rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={() => router.push("/profile")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text2)" }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ fontSize: "1.4rem", fontWeight: 800, fontFamily: "Space Grotesk, sans-serif", display: "flex", alignItems: "center", gap: 8 }}>
              <Shield size={22} style={{ color: "#a855f7" }} />
              <span className="grad-text">Admin Dashboard</span>
            </h1>
            <p style={{ fontSize: "0.72rem", color: "var(--text3)" }}>Veil Moderation Center · {new Date().toLocaleDateString()}</p>
          </div>
        </div>
        <button onClick={() => toast.success("Report exported!")} className="btn-ghost" style={{ padding: "0.5rem 0.8rem", fontSize: "0.78rem", display: "flex", alignItems: "center", gap: 6 }}>
          <Download size={14} /> Export
        </button>
      </div>

      {/* Tabs */}
      <div style={{ padding: "0 1.25rem", marginBottom: "1.5rem", overflowX: "auto" }}>
        <div className="glass" style={{ borderRadius: 12, padding: 4, display: "flex", gap: 4, minWidth: "max-content" }}>
          {[
            { k: "overview", l: "📊 Overview" },
            { k: "users", l: "👤 Users" },
            { k: "reports", l: "🚨 Reports" },
            { k: "analytics", l: "📈 Analytics" },
          ].map(t => (
            <button key={t.k} onClick={() => setActiveTab(t.k as any)}
              style={{ padding: "0.5rem 1rem", borderRadius: 9, border: "none", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, transition: "all 0.3s", whiteSpace: "nowrap", background: activeTab === t.k ? "linear-gradient(135deg,#a855f7,#ec4899)" : "transparent", color: activeTab === t.k ? "white" : "var(--text2)" }}>
              {t.l}
            </button>
          ))}
        </div>
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab === "overview" && (
        <div style={{ padding: "0 1.25rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, marginBottom: "1.5rem" }}>
            {overviewStats.map((s, i) => (
              <motion.div key={s.label} className="glass" style={{ borderRadius: 16, padding: "1.1rem", borderLeft: `3px solid ${s.color}` }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <s.icon size={18} style={{ color: s.color }} />
                  <span style={{ fontSize: "0.68rem", color: s.color, fontWeight: 600, background: `${s.color}18`, padding: "2px 8px", borderRadius: 999 }}>{s.change}</span>
                </div>
                <p style={{ fontSize: "1.4rem", fontWeight: 800, color: s.color }}>{s.value}</p>
                <p style={{ fontSize: "0.72rem", color: "var(--text3)" }}>{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* AI Moderation panel */}
          <div className="glass-purple" style={{ borderRadius: 18, padding: "1.2rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
              <Zap size={18} style={{ color: "#a855f7" }} />
              <p style={{ fontWeight: 700 }}>AI Moderation Status</p>
              <span style={{ marginLeft: "auto", background: "rgba(16,185,129,0.15)", color: "#10b981", fontSize: "0.68rem", fontWeight: 700, padding: "2px 8px", borderRadius: 999, border: "1px solid rgba(16,185,129,0.3)" }}>ACTIVE</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Spam Detection", accuracy: 98.2, blocked: 142 },
                { label: "Toxicity Filter", accuracy: 94.7, blocked: 87 },
                { label: "NSFW Scanner", accuracy: 99.1, blocked: 23 },
              ].map(m => (
                <div key={m.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: "0.8rem" }}>{m.label}</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text3)" }}>{m.accuracy}% · {m.blocked} blocked today</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 4, background: "rgba(255,255,255,0.06)" }}>
                    <div style={{ height: "100%", borderRadius: 4, width: `${m.accuracy}%`, background: "linear-gradient(90deg,#a855f7,#10b981)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="glass" style={{ borderRadius: 18, padding: "1.2rem" }}>
            <p style={{ fontWeight: 700, marginBottom: "1rem", fontSize: "0.9rem" }}>Recent Activity</p>
            {[
              { icon: "🔨", text: "GhostPanda#2341 banned for spam", time: "2m ago", color: "#ef4444" },
              { icon: "⚠️", text: "New report: Harassment in DCE General", time: "8m ago", color: "#f59e0b" },
              { icon: "✅", text: "ShadowByte#9182 appeal approved", time: "15m ago", color: "#10b981" },
              { icon: "🤖", text: "AI blocked 12 spam messages", time: "23m ago", color: "#a855f7" },
              { icon: "👤", text: "34 new users joined in last hour", time: "1h ago", color: "#06b6d4" },
            ].map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "0.6rem 0", borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
                <span style={{ fontSize: "1.1rem" }}>{a.icon}</span>
                <p style={{ flex: 1, fontSize: "0.8rem", color: "var(--text2)" }}>{a.text}</p>
                <span style={{ fontSize: "0.68rem", color: "var(--text3)", flexShrink: 0 }}>{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── USERS ── */}
      {activeTab === "users" && (
        <div style={{ padding: "0 1.25rem" }}>
          <div style={{ position: "relative", marginBottom: "1rem" }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users, emails..."
              className="input-glass" style={{ paddingLeft: "2.5rem" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filteredUsers.map((u, i) => {
              const isBanned = bannedIds.includes(u.id) || u.status === "banned";
              return (
                <motion.div key={u.id} className="glass" style={{ borderRadius: 16, padding: "1rem", opacity: isBanned ? 0.6 : 1 }}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: isBanned ? 0.6 : 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "0.75rem" }}>
                    <div style={{ width: 38, height: 38, borderRadius: 11, fontSize: "1.3rem", display: "flex", alignItems: "center", justifyContent: "center", background: `${u.color}18`, border: `1.5px solid ${u.color}33`, flexShrink: 0 }}>
                      {u.emoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <p style={{ fontWeight: 700, fontSize: "0.85rem", color: u.color }}>{u.username}</p>
                        {u.isAdult && <span style={{ fontSize: "0.6rem", background: "rgba(236,72,153,0.15)", color: "#ec4899", padding: "1px 6px", borderRadius: 999, border: "1px solid rgba(236,72,153,0.3)", fontWeight: 700 }}>18+</span>}
                        <span style={{ fontSize: "0.6rem", background: `${statusColor[u.status] || "#10b981"}18`, color: statusColor[u.status] || "#10b981", padding: "1px 6px", borderRadius: 999, fontWeight: 700 }}>
                          {isBanned ? "banned" : u.status}
                        </span>
                        {u.isOnline && <span className="pulse-dot" />}
                      </div>
                      <p style={{ fontSize: "0.68rem", color: "var(--text3)" }}>{u.email || "Anonymous (no email)"}</p>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {!isBanned ? (
                        <button onClick={() => banUser(u.id, u.username)}
                          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444", borderRadius: 8, padding: "0.35rem 0.7rem", cursor: "pointer", fontSize: "0.72rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                          <Ban size={12} /> Ban
                        </button>
                      ) : (
                        <button onClick={() => { setBannedIds(p => p.filter(id => id !== u.id)); toast.success("User unbanned"); }}
                          style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#10b981", borderRadius: 8, padding: "0.35rem 0.7rem", cursor: "pointer", fontSize: "0.72rem", fontWeight: 600 }}>
                          Unban
                        </button>
                      )}
                    </div>
                  </div>
                  {/* Device/IP info (admin-only) */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {[
                      { l: "IP Address", v: u.ip },
                      { l: "Device", v: u.device },
                      { l: "Messages", v: u.messages.toLocaleString() },
                      { l: "Reports", v: u.reports > 0 ? `⚠️ ${u.reports}` : "0" },
                    ].map(d => (
                      <div key={d.l} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "0.4rem 0.7rem" }}>
                        <p style={{ fontSize: "0.62rem", color: "var(--text3)" }}>{d.l}</p>
                        <p style={{ fontSize: "0.75rem", fontFamily: "monospace", color: d.v.includes("⚠️") ? "#f59e0b" : "var(--text)" }}>{d.v}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── REPORTS ── */}
      {activeTab === "reports" && (
        <div style={{ padding: "0 1.25rem", display: "flex", flexDirection: "column", gap: 12 }}>
          {reports.map((r, i) => {
            const resolved = resolvedReports.includes(r.id) || r.status !== "pending";
            return (
              <motion.div key={r.id} className="glass" style={{ borderRadius: 16, padding: "1.1rem", borderLeft: `3px solid ${severityColor[r.severity]}`, opacity: resolved ? 0.7 : 1 }}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <AlertTriangle size={14} style={{ color: severityColor[r.severity] }} />
                      <p style={{ fontWeight: 700, fontSize: "0.85rem" }}>{r.reason}</p>
                      <span style={{ fontSize: "0.62rem", background: `${severityColor[r.severity]}18`, color: severityColor[r.severity], padding: "1px 7px", borderRadius: 999, fontWeight: 700, textTransform: "uppercase" }}>{r.severity}</span>
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "var(--text2)" }}>
                      <span style={{ color: "#ef4444" }}>{r.reportedUser}</span> reported by <span style={{ color: "var(--text)" }}>{r.reportedBy}</span>
                    </p>
                    <p style={{ fontSize: "0.68rem", color: "var(--text3)", marginTop: 4 }}>{timeAgo(r.timestamp)}</p>
                  </div>
                  <span style={{ fontSize: "0.68rem", background: resolved ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)", color: resolved ? "#10b981" : "#f59e0b", padding: "2px 8px", borderRadius: 999, fontWeight: 600, flexShrink: 0 }}>
                    {resolved ? "Resolved" : "Pending"}
                  </span>
                </div>
                {!resolved && (
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button onClick={() => resolveReport(r.id)} style={{ flex: 1, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981", borderRadius: 8, padding: "0.45rem", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                      <Check size={13} /> Resolve
                    </button>
                    <button onClick={() => { banUser(r.id, r.reportedUser); resolveReport(r.id); }}
                      style={{ flex: 1, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", borderRadius: 8, padding: "0.45rem", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                      <Ban size={13} /> Ban User
                    </button>
                    <button onClick={() => resolveReport(r.id)}
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", color: "var(--text3)", borderRadius: 8, padding: "0.45rem 0.8rem", cursor: "pointer", fontSize: "0.78rem" }}>
                      <X size={13} />
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── ANALYTICS ── */}
      {activeTab === "analytics" && (
        <div style={{ padding: "0 1.25rem", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Mock chart bars */}
          <div className="glass" style={{ borderRadius: 18, padding: "1.2rem" }}>
            <p style={{ fontWeight: 700, marginBottom: "1rem", fontSize: "0.9rem" }}>📊 Messages per Day (Last 7 days)</p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100 }}>
              {[65, 82, 74, 91, 88, 95, 100].map((h, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.08, duration: 0.6, ease: "easeOut" }}
                    style={{ width: "100%", borderRadius: "4px 4px 0 0", background: i === 6 ? "linear-gradient(180deg,#a855f7,#ec4899)" : "rgba(168,85,247,0.25)" }} />
                  <span style={{ fontSize: "0.6rem", color: "var(--text3)" }}>{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { label: "Active Users", value: "847", sub: "Last 24h", color: "#a855f7" },
              { label: "Avg Session", value: "24m", sub: "Per user", color: "#06b6d4" },
              { label: "Match Rate", value: "68%", sub: "Of swipes", color: "#10b981" },
              { label: "Churn Rate", value: "4.2%", sub: "This week", color: "#f59e0b" },
            ].map(s => (
              <div key={s.label} className="glass" style={{ borderRadius: 14, padding: "1rem" }}>
                <p style={{ fontSize: "1.5rem", fontWeight: 800, color: s.color }}>{s.value}</p>
                <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text)" }}>{s.label}</p>
                <p style={{ fontSize: "0.68rem", color: "var(--text3)" }}>{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="glass" style={{ borderRadius: 18, padding: "1.2rem" }}>
            <p style={{ fontWeight: 700, marginBottom: "1rem", fontSize: "0.9rem" }}>🏆 Top Community Rooms</p>
            {["Meme Factory 😂", "DCE General 🏫", "Crush Corner 💘", "Late Night Study 🌙", "Hackathon Crew ⚡"].map((r, i) => (
              <div key={r} style={{ display: "flex", alignItems: "center", gap: 12, padding: "0.55rem 0", borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text3)", width: 16, textAlign: "center", flexShrink: 0 }}>#{i + 1}</span>
                <p style={{ flex: 1, fontSize: "0.82rem" }}>{r}</p>
                <div style={{ height: 6, width: `${100 - i * 14}px`, borderRadius: 3, background: "linear-gradient(90deg,#a855f7,#ec4899)" }} />
                <span style={{ fontSize: "0.72rem", color: "var(--text3)", width: 30, textAlign: "right" }}>{(580 - i * 80).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
