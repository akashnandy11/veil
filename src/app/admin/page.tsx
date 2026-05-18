"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MessageSquare, Shield, Activity, ArrowLeft, Clock, Eye } from "lucide-react";
import toast from "react-hot-toast";

interface Message {
  senderId: string;
  text: string;
  timestamp: string;
}

interface ChatSession {
  _id: string;
  roomId: string;
  status: string;
  user1: { name: string; gender: string; age: number; interests: string[]; socketId: string };
  user2: { name: string; gender: string; age: number; interests: string[]; socketId: string };
  messages: Message[];
  startedAt: string;
  endedAt?: string;
}

interface Stats {
  totalSessions: number;
  activeSessions: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [stats, setStats] = useState<Stats>({ totalSessions: 0, activeSessions: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as any)?.role !== "admin") {
      router.push("/");
    }
  }, [session, status, router]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch("/api/admin/sessions");
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setSessions(data);
      setStats({
        totalSessions: data.length,
        activeSessions: data.filter((s: ChatSession) => s.status === "active").length,
      });
    } catch (err) {
      toast.error("Access denied");
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = sessions.filter(
    (s) => s.user1?.name?.toLowerCase().includes(search.toLowerCase()) || s.user2?.name?.toLowerCase().includes(search.toLowerCase()) || s.roomId.includes(search)
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
          { label: "Total Sessions", value: stats.totalSessions, icon: <MessageSquare size={20} />, color: "#a855f7" },
          { label: "Active Sessions", value: stats.activeSessions, icon: <Activity size={20} />, color: "#10b981" },
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
        placeholder="Search by username or room ID..."
        className="input-glass"
        style={{ width: "100%", marginBottom: "1.5rem" }}
      />

      {/* Sessions Table */}
      <div className="glass" style={{ borderRadius: 20, overflow: "hidden" }}>
        <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
          <MessageSquare size={18} color="#a855f7" />
          <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>Chat Sessions ({filteredSessions.length})</span>
        </div>

        {filteredSessions.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text3)" }}>
            <p>No chat sessions found</p>
          </div>
        ) : (
          filteredSessions.map((sessionLog, i) => (
            <motion.div key={sessionLog._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
              style={{ padding: "1rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", gap: 16 }}>
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                    {sessionLog.user1.name} 🤝 {sessionLog.user2.name}
                  </span>
                  {sessionLog.status === "active" ? (
                    <span style={{ fontSize: "0.65rem", background: "rgba(16,185,129,0.2)", color: "#10b981", padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>ACTIVE</span>
                  ) : (
                    <span style={{ fontSize: "0.65rem", background: "rgba(255,255,255,0.1)", color: "var(--text3)", padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>ENDED</span>
                  )}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text3)", marginTop: 4, display: "flex", alignItems: "center", gap: 12 }}>
                  <span>Room: {sessionLog.roomId}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} /> {new Date(sessionLog.startedAt).toLocaleString()}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MessageSquare size={12} /> {sessionLog.messages.length} msgs</span>
                </div>
              </div>

              <button onClick={() => setSelectedSession(sessionLog)} className="glass" style={{ padding: "6px 12px", borderRadius: 8, fontSize: "0.78rem", color: "#a855f7", display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                <Eye size={14} /> View Chat
              </button>
            </motion.div>
          ))
        )}
      </div>

      {/* Chat Log Modal */}
      {selectedSession && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "1rem" }} onClick={() => setSelectedSession(null)}>
          <div className="glass" style={{ width: "100%", maxWidth: 600, height: "80vh", borderRadius: 20, display: "flex", flexDirection: "column", overflow: "hidden" }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(0,0,0,0.4)" }}>
              <div>
                <h3 style={{ fontWeight: 800, fontSize: "1.1rem" }}>{selectedSession.user1.name} & {selectedSession.user2.name}</h3>
                <div style={{ fontSize: "0.75rem", color: "var(--text3)", marginTop: 2 }}>Room: {selectedSession.roomId}</div>
              </div>
              <button onClick={() => setSelectedSession(null)} style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(255,255,255,0.1)", fontSize: "0.8rem", fontWeight: 600 }}>Close</button>
            </div>
            
            <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: 12 }}>
              {selectedSession.messages.length === 0 ? (
                <div style={{ textAlign: "center", color: "var(--text3)", margin: "auto" }}>No messages sent yet.</div>
              ) : (
                selectedSession.messages.map((msg, i) => {
                  const isUser1 = msg.senderId === selectedSession.user1.socketId;
                  const senderName = isUser1 ? selectedSession.user1.name : selectedSession.user2.name;
                  return (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: isUser1 ? "flex-start" : "flex-end" }}>
                      <span style={{ fontSize: "0.7rem", color: "var(--text3)", marginBottom: 2, padding: "0 4px" }}>{senderName} • {new Date(msg.timestamp).toLocaleTimeString()}</span>
                      <div className={isUser1 ? "bubble-recv" : "bubble-sent"} style={{ maxWidth: "80%", padding: "8px 14px" }}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
