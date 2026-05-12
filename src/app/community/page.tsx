"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { CONFESSION_CATEGORIES, generateAnonymousIdentity, timeAgo, NEON_COLORS } from "@/lib/utils";
import { Heart, MessageCircle, Send, Users, Plus, X, Flame, Hash, Lock } from "lucide-react";
import MobileNav from "@/components/MobileNav";
import toast from "react-hot-toast";

export default function CommunityPage() {
  const router = useRouter();
  const { user, isAuthenticated, confessions, likeConfession, addConfession, rooms, adultMode } = useAppStore();
  const [activeTab, setActiveTab] = useState<"feed" | "rooms" | "crush">("feed");
  const [showPost, setShowPost] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(CONFESSION_CATEGORIES[0]);
  const [filterCat, setFilterCat] = useState("All");
  const [crushInput, setCrushInput] = useState("");
  const [sentCrushes, setSentCrushes] = useState<string[]>([]);

  useEffect(() => { if (!isAuthenticated) router.push("/"); }, [isAuthenticated, router]);

  const submitConfession = () => {
    if (!newPost.trim()) return toast.error("Write something first!");
    if (newPost.length < 10) return toast.error("Too short — add more detail 🙈");
    const identity = generateAnonymousIdentity();
    addConfession({
      id: `c_${Date.now()}`,
      content: newPost.trim(),
      category: selectedCategory,
      authorEmoji: identity.emoji,
      authorColor: identity.color,
      likes: 0,
      liked: false,
      comments: 0,
      timestamp: new Date(),
      isAnonymous: true,
    });
    setNewPost("");
    setShowPost(false);
    toast.success("Confession posted anonymously 🤫");
  };

  const sendCrush = () => {
    if (!crushInput.trim()) return;
    setSentCrushes(p => [...p, crushInput.trim()]);
    setCrushInput("");
    toast.success("💘 Anonymous crush sent! If they send one back, you'll both know.");
  };

  const visibleRooms = adultMode ? rooms : rooms.filter(r => r.category !== "Adult");
  const filteredConfessions = filterCat === "All" ? confessions : confessions.filter(c => c.category === filterCat);

  return (
    <main style={{ minHeight: "100vh", paddingBottom: 90, maxWidth: 480, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ padding: "2rem 1.25rem 1rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "Space Grotesk,sans-serif" }} className="grad-text">Community</h1>
        <p style={{ fontSize: "0.75rem", color: "var(--text3)" }}>Confess. Connect. Vibe. 🏫</p>
      </div>

      {/* Tabs */}
      <div style={{ padding: "0 1.25rem", marginBottom: "1.2rem" }}>
        <div className="glass" style={{ borderRadius: 12, padding: 4, display: "flex", gap: 4 }}>
          {[{ k: "feed", l: "🤫 Feed" }, { k: "rooms", l: "🏠 Rooms" }, { k: "crush", l: "💘 Crush" }].map(t => (
            <button key={t.k} onClick={() => setActiveTab(t.k as any)}
              style={{ flex: 1, padding: "0.5rem", borderRadius: 9, border: "none", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, transition: "all 0.3s", background: activeTab === t.k ? "linear-gradient(135deg,#a855f7,#ec4899)" : "transparent", color: activeTab === t.k ? "white" : "var(--text2)" }}>
              {t.l}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONFESSIONS FEED ── */}
      {activeTab === "feed" && (
        <div style={{ padding: "0 1.25rem" }}>
          {/* Category filter */}
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: "1rem" }}>
            {["All", ...CONFESSION_CATEGORIES].map(c => (
              <button key={c} onClick={() => setFilterCat(c)}
                className={`tag-chip${filterCat === c ? " selected" : ""}`}
                style={{ whiteSpace: "nowrap", flexShrink: 0 }}>
                {c.split(" ")[0]}
              </button>
            ))}
          </div>

          {/* Post confession button */}
          <motion.button onClick={() => setShowPost(true)} className="btn-primary"
            whileTap={{ scale: 0.97 }}
            style={{ width: "100%", marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "0.8rem" }}>
            <Plus size={18} /> Drop a Confession
          </motion.button>

          {/* Post modal */}
          <AnimatePresence>
            {showPost && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="glass neon-border" style={{ borderRadius: 20, padding: "1.2rem", marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <p style={{ fontWeight: 700, fontSize: "0.9rem" }}>🤫 Anonymous Confession</p>
                  <button onClick={() => setShowPost(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)" }}><X size={18} /></button>
                </div>
                <textarea value={newPost} onChange={e => setNewPost(e.target.value)}
                  placeholder="Share your confession... no one will know it's you 🙈"
                  className="input-glass"
                  style={{ height: 100, resize: "none", marginBottom: "0.8rem", display: "block" }} />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "1rem" }}>
                  {CONFESSION_CATEGORIES.map(c => (
                    <button key={c} onClick={() => setSelectedCategory(c)}
                      className={`tag-chip${selectedCategory === c ? " selected" : ""}`}
                      style={{ fontSize: "0.7rem" }}>{c}</button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setShowPost(false)} className="btn-ghost" style={{ flex: 1, padding: "0.65rem" }}>Cancel</button>
                  <button onClick={submitConfession} className="btn-primary" style={{ flex: 1, padding: "0.65rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <Send size={14} /> Post Anonymously
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Confession cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filteredConfessions.map((c, i) => (
              <motion.div key={c.id} className="glass card-hover" style={{ borderRadius: 16, padding: "1.1rem", borderLeft: `3px solid ${c.authorColor}` }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.75rem" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center", background: `${c.authorColor}18`, border: `1px solid ${c.authorColor}33` }}>
                    {c.authorEmoji}
                  </div>
                  <div>
                    <p style={{ fontSize: "0.75rem", fontWeight: 600, color: c.authorColor }}>Anonymous Ghost</p>
                    <p style={{ fontSize: "0.65rem", color: "var(--text3)" }}>{timeAgo(c.timestamp)} · {c.category.split(" ")[0]}</p>
                  </div>
                </div>
                <p style={{ fontSize: "0.9rem", color: "var(--text)", lineHeight: 1.6, marginBottom: "0.9rem" }}>{c.content}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <button onClick={() => likeConfession(c.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, color: c.liked ? "#ec4899" : "var(--text3)", transition: "all 0.2s", fontSize: "0.8rem" }}>
                    <Heart size={16} fill={c.liked ? "#ec4899" : "none"} />
                    {c.likes}
                  </button>
                  <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, color: "var(--text3)", fontSize: "0.8rem" }}>
                    <MessageCircle size={16} /> {c.comments}
                  </button>
                  <span style={{ marginLeft: "auto", fontSize: "0.65rem" }} className="tag-chip">{c.category.split(" ")[0]}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ── ROOMS ── */}
      {activeTab === "rooms" && (
        <div style={{ padding: "0 1.25rem", display: "flex", flexDirection: "column", gap: 12 }}>
          {!adultMode && (
            <div className="glass" style={{ borderRadius: 12, padding: "0.75rem 1rem", display: "flex", alignItems: "center", gap: 10 }}>
              <Lock size={14} style={{ color: "#ec4899" }} />
              <p style={{ fontSize: "0.75rem", color: "var(--text2)" }}>Enable 18+ mode in Profile to unlock adult rooms</p>
            </div>
          )}
          {visibleRooms.map((room, i) => (
            <motion.div key={room.id} className="glass card-hover" style={{ borderRadius: 16, padding: "1rem 1.1rem", display: "flex", alignItems: "center", gap: 14 }}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <div style={{ width: 46, height: 46, borderRadius: 14, fontSize: "1.6rem", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)", flexShrink: 0 }}>
                {room.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <p style={{ fontWeight: 700, fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{room.name}</p>
                  {room.isPrivate && <Lock size={12} style={{ color: "#ec4899", flexShrink: 0 }} />}
                </div>
                <p style={{ fontSize: "0.73rem", color: "var(--text2)", marginBottom: 4 }}>{room.description}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Users size={11} style={{ color: "var(--text3)" }} />
                  <span style={{ fontSize: "0.68rem", color: "var(--text3)" }}>{room.members.toLocaleString()} members</span>
                  <span className="pulse-dot" style={{ width: 6, height: 6 }} />
                  <span style={{ fontSize: "0.68rem", color: "#10b981" }}>Live</span>
                </div>
              </div>
              <button onClick={() => { toast.success(`Joined ${room.name}! 🎉`); router.push("/chat"); }}
                className="btn-primary" style={{ padding: "0.5rem 0.9rem", fontSize: "0.78rem", flexShrink: 0 }}>
                Join
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── SECRET CRUSH ── */}
      {activeTab === "crush" && (
        <div style={{ padding: "0 1.25rem" }}>
          <div className="glass-pink" style={{ borderRadius: 20, padding: "1.5rem", marginBottom: "1.5rem", textAlign: "center" }}>
            <p style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>💘</p>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: 8 }} className="grad-text-alt">Secret Crush System</h2>
            <p style={{ fontSize: "0.82rem", color: "var(--text2)", lineHeight: 1.6 }}>
              Enter someone&apos;s Veil username. If they add you back, you&apos;ll both get a match notification — without anyone knowing otherwise.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: "1.5rem" }}>
            <input value={crushInput} onChange={e => setCrushInput(e.target.value)}
              placeholder="Enter username e.g. GhostPanda#1234"
              className="input-glass" style={{ flex: 1 }}
              onKeyDown={e => e.key === "Enter" && sendCrush()} />
            <button onClick={sendCrush} className="btn-primary" style={{ padding: "0.75rem 1rem", flexShrink: 0, display: "flex", alignItems: "center", gap: 6 }}>
              <Heart size={16} /> Send
            </button>
          </div>

          {sentCrushes.length > 0 && (
            <div>
              <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text2)", marginBottom: 10 }}>Crush signals sent 💌</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {sentCrushes.map((u, i) => (
                  <div key={i} className="glass" style={{ borderRadius: 12, padding: "0.8rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.85rem" }}>💘 {u}</span>
                    <span style={{ fontSize: "0.7rem", color: "var(--text3)" }}>Waiting...</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="glass" style={{ borderRadius: 16, padding: "1.1rem", marginTop: "1.5rem" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 600, marginBottom: 8 }}>💡 How it works</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {["You secretly add someone's username", "They have no idea unless they add yours too", "If it's mutual — 🎉 both get a match alert!", "Otherwise your crush stays completely hidden"].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: "linear-gradient(135deg,#a855f7,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text2)" }}>{s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <MobileNav />
    </main>
  );
}
