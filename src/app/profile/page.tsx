"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { INTERESTS, MOODS, generateAnonymousIdentity } from "@/lib/utils";
import { User, Shuffle, LogOut, Shield, Bell, Trash2, Check, ChevronRight, Moon, Eye, EyeOff } from "lucide-react";
import MobileNav from "@/components/MobileNav";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser, logout, adultMode, toggleAdultMode } = useAppStore();
  const [activeTab, setActiveTab] = useState<"profile" | "settings" | "privacy">("profile");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(user?.interests || []);
  const [selectedMood, setSelectedMood] = useState(user?.mood || "chill");
  const [bio, setBio] = useState("Just here to vibe 🌙");
  const [realName, setRealName] = useState(user?.realName || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  const [isAnonymous, setIsAnonymous] = useState(user?.isAnonymous ?? true);
  const [notifications, setNotifications] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => { if (!user) router.push("/"); }, [user, router]);

  const toggleInterest = (i: string) => {
    setSelectedInterests(p => p.includes(i) ? p.filter(x => x !== i) : p.length < 5 ? [...p, i] : p);
  };

  const saveProfile = () => {
    if (user) {
      setUser({ ...user, interests: selectedInterests, mood: selectedMood, realName, avatarUrl, isAnonymous });
      toast.success("Profile updated! ✨");
    }
  };

  const rerollIdentity = () => {
    if (user) {
      const id = generateAnonymousIdentity();
      setUser({ ...user, username: id.username, emoji: id.emoji, color: id.color });
      toast.success("New identity acquired! 👻");
    }
  };

  if (!user) return null;

  return (
    <main style={{ minHeight: "100vh", paddingBottom: 90, maxWidth: 480, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ padding: "2rem 1.25rem 0" }}>
        {/* Identity card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass neon-border" style={{ borderRadius: 24, padding: "1.5rem", marginBottom: "1.2rem", textAlign: "center" }}>
          
          {!isAnonymous && avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" style={{
              width: 80, height: 80, borderRadius: 22, objectFit: "cover", margin: "0 auto 1rem",
              border: `3px solid ${user.color}44`, boxShadow: `0 0 40px ${user.color}30`
            }} />
          ) : (
            <div style={{
              width: 80, height: 80, borderRadius: 22, fontSize: "2.8rem",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem",
              background: `${user.color}18`, border: `3px solid ${user.color}44`,
              boxShadow: `0 0 40px ${user.color}30`,
            }}>{user.emoji}</div>
          )}

          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: user.color, marginBottom: 4 }}>
            {!isAnonymous && realName ? realName : user.username}
          </h2>
          <p style={{ fontSize: "0.75rem", color: "var(--text3)", marginBottom: "1rem" }}>
            {isAnonymous ? "👻 Anonymous Ghost" : "✅ Real Identity"} · DCE Campus
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", marginBottom: "1rem" }}>
            <span className="pulse-dot" />
            <span style={{ fontSize: "0.72rem", color: "#10b981" }}>Online</span>
            <span style={{ color: "var(--text3)", fontSize: "0.72rem" }}>·</span>
            <span style={{ fontSize: "0.72rem", color: "var(--text3)" }}>Joined today</span>
          </div>
          <button onClick={rerollIdentity} className="btn-ghost"
            style={{ display: "flex", alignItems: "center", gap: 6, margin: "0 auto", padding: "0.5rem 1.2rem", fontSize: "0.8rem" }}>
            <Shuffle size={14} /> Reroll Identity
          </button>
        </motion.div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: "1.2rem" }}>
          {[{ v: "0", l: "Matches" }, { v: "0", l: "Chats" }, { v: "0", l: "Posts" }].map(s => (
            <div key={s.l} className="glass" style={{ borderRadius: 14, padding: "0.8rem", textAlign: "center" }}>
              <p style={{ fontSize: "1.3rem", fontWeight: 800 }} className="grad-text">{s.v}</p>
              <p style={{ fontSize: "0.65rem", color: "var(--text3)" }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: "0 1.25rem", marginBottom: "1.2rem" }}>
        <div className="glass" style={{ borderRadius: 12, padding: 4, display: "flex", gap: 4 }}>
          {[{ k: "profile", l: "👤 Profile" }, { k: "settings", l: "⚙️ Settings" }, { k: "privacy", l: "🔒 Privacy" }].map(t => (
            <button key={t.k} onClick={() => setActiveTab(t.k as any)}
              style={{ flex: 1, padding: "0.5rem", borderRadius: 9, border: "none", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600, transition: "all 0.3s", background: activeTab === t.k ? "linear-gradient(135deg,#a855f7,#ec4899)" : "transparent", color: activeTab === t.k ? "white" : "var(--text2)" }}>
              {t.l}
            </button>
          ))}
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div style={{ padding: "0 1.25rem", display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="glass" style={{ borderRadius: 16, padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text)" }}>👻 Anonymous Mode</label>
              <button onClick={() => setIsAnonymous(!isAnonymous)} style={{ width: 44, height: 24, borderRadius: 12, cursor: "pointer", border: "none", background: isAnonymous ? "linear-gradient(135deg,#a855f7,#ec4899)" : "rgba(255,255,255,0.1)", position: "relative", transition: "all 0.3s" }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: "white", position: "absolute", top: 3, transition: "all 0.3s", left: isAnonymous ? 23 : 3 }} />
              </button>
            </div>
            <p style={{ fontSize: "0.7rem", color: "var(--text3)" }}>{isAnonymous ? "You are currently hidden as an anonymous ghost." : "Your real identity will be visible to others."}</p>
          </div>

          {!isAnonymous && (
            <div className="glass" style={{ borderRadius: 16, padding: "1rem", display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--text2)", display: "block", marginBottom: 4 }}>Real Name</label>
                <input value={realName} onChange={e => setRealName(e.target.value)} placeholder="Enter your real name" className="input-glass" style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: 8, border: "1px solid var(--border)", background: "rgba(255,255,255,0.02)", color: "white" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--text2)", display: "block", marginBottom: 4 }}>Avatar Image URL (Optional)</label>
                <input value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} placeholder="https://example.com/avatar.jpg" className="input-glass" style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: 8, border: "1px solid var(--border)", background: "rgba(255,255,255,0.02)", color: "white" }} />
              </div>
            </div>
          )}

          <div className="glass" style={{ borderRadius: 16, padding: "1rem" }}>
            <label style={{ fontSize: "0.75rem", color: "var(--text2)", display: "block", marginBottom: 8 }}>Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="What's your vibe?" className="input-glass"
              style={{ height: 80, resize: "none", display: "block" }} />
          </div>

          <div className="glass" style={{ borderRadius: 16, padding: "1rem" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 600, marginBottom: 12 }}>Current Mood</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {MOODS.map(m => (
                <button key={m.value} onClick={() => setSelectedMood(m.value)}
                  style={{ padding: "0.4rem 0.9rem", borderRadius: 999, fontSize: "0.78rem", fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.2s", background: selectedMood === m.value ? `${m.color}22` : "rgba(255,255,255,0.05)", color: selectedMood === m.value ? m.color : "var(--text2)", borderColor: `${m.color}44`, borderStyle: "solid", borderWidth: 1 }}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="glass" style={{ borderRadius: 16, padding: "1rem" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 600, marginBottom: 12 }}>Interests <span style={{ color: "var(--text3)" }}>{selectedInterests.length}/5</span></p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {INTERESTS.map(i => (
                <button key={i} onClick={() => toggleInterest(i)} className={`tag-chip${selectedInterests.includes(i) ? " selected" : ""}`}>
                  {selectedInterests.includes(i) && <Check size={10} style={{ marginRight: 4 }} />} {i}
                </button>
              ))}
            </div>
          </div>

          <button onClick={saveProfile} className="btn-primary"
            style={{ padding: "0.85rem", fontSize: "0.95rem", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Check size={16} /> Save Profile
          </button>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div style={{ padding: "0 1.25rem", display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            {
              icon: "🔞", title: "18+ Adult Mode", desc: "Enable flirty chat & adult rooms", toggle: true,
              value: adultMode, onToggle: () => { toggleAdultMode(); toast.success(adultMode ? "Adult mode disabled" : "Adult mode enabled 🔥"); }
            },
            {
              icon: "🔔", title: "Notifications", desc: "Get alerts for matches & messages", toggle: true,
              value: notifications, onToggle: () => setNotifications(v => !v)
            },
          ].map(s => (
            <div key={s.title} className="glass" style={{ borderRadius: 14, padding: "0.9rem 1.1rem", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: "1.3rem" }}>{s.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: "0.85rem" }}>{s.title}</p>
                <p style={{ fontSize: "0.7rem", color: "var(--text3)" }}>{s.desc}</p>
              </div>
              <button onClick={s.onToggle} style={{ width: 44, height: 24, borderRadius: 12, cursor: "pointer", border: "none", background: s.value ? "linear-gradient(135deg,#a855f7,#ec4899)" : "rgba(255,255,255,0.1)", position: "relative", transition: "all 0.3s" }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: "white", position: "absolute", top: 3, transition: "all 0.3s", left: s.value ? 23 : 3 }} />
              </button>
            </div>
          ))}

          {/* Link to admin if not anon */}
          {!user.isAnonymous && (
            <button onClick={() => router.push("/admin")} className="glass card-hover"
              style={{ borderRadius: 14, padding: "0.9rem 1.1rem", display: "flex", alignItems: "center", gap: 12, background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)", cursor: "pointer", width: "100%", textAlign: "left" }}>
              <Shield size={20} style={{ color: "#a855f7" }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: "0.85rem" }}>Admin Dashboard</p>
                <p style={{ fontSize: "0.7rem", color: "var(--text3)" }}>Manage users, reports, analytics</p>
              </div>
              <ChevronRight size={16} style={{ color: "var(--text3)" }} />
            </button>
          )}

          <button onClick={() => { logout(); router.push("/"); toast.success("Logged out safely 👋"); }}
            style={{ borderRadius: 14, padding: "0.9rem 1.1rem", display: "flex", alignItems: "center", gap: 12, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", cursor: "pointer", color: "#ef4444", width: "100%", fontWeight: 600, fontSize: "0.85rem" }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      )}

      {/* Privacy Tab */}
      {activeTab === "privacy" && (
        <div style={{ padding: "0 1.25rem", display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="glass" style={{ borderRadius: 16, padding: "1.1rem" }}>
            <p style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.75rem" }}>🔒 What others can see</p>
            {[
              { label: "Your username", value: "Anonymous only", visible: true },
              { label: "Your avatar", value: "Emoji only, no photo", visible: true },
              { label: "Your email/phone", value: "Hidden from everyone", visible: false },
              { label: "Your location", value: "Approximate only (100m+)", visible: true },
              { label: "Your device info", value: "Admin-only, encrypted", visible: false },
            ].map(p => (
              <div key={p.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.6rem 0", borderBottom: "1px solid var(--border)" }}>
                <div>
                  <p style={{ fontSize: "0.82rem", fontWeight: 500 }}>{p.label}</p>
                  <p style={{ fontSize: "0.7rem", color: "var(--text3)" }}>{p.value}</p>
                </div>
                {p.visible ? <Eye size={16} style={{ color: "#10b981" }} /> : <EyeOff size={16} style={{ color: "var(--text3)" }} />}
              </div>
            ))}
          </div>

          <div className="glass" style={{ borderRadius: 16, padding: "1.1rem" }}>
            <p style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: 8 }}>⚠️ Data & Account</p>
            <p style={{ fontSize: "0.78rem", color: "var(--text2)", lineHeight: 1.6, marginBottom: "1rem" }}>
              Veil stores minimal metadata for safety. Admins can access IP logs and device info only for moderation purposes.
              Chats are end-to-end encrypted.
            </p>
            {!showDeleteConfirm ? (
              <button onClick={() => setShowDeleteConfirm(true)}
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444", borderRadius: 10, padding: "0.6rem 1rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                <Trash2 size={14} /> Delete Account & Data
              </button>
            ) : (
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => { logout(); router.push("/"); toast.success("Account deleted. Stay safe 👋"); }}
                  style={{ flex: 1, background: "#ef4444", border: "none", color: "white", borderRadius: 10, padding: "0.6rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>
                  Confirm Delete
                </button>
                <button onClick={() => setShowDeleteConfirm(false)} className="btn-ghost" style={{ flex: 1, padding: "0.6rem", fontSize: "0.8rem" }}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <MobileNav />
    </main>
  );
}
