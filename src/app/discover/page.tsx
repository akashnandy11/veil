"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore, Match } from "@/lib/store";
import { INTERESTS, MOODS, AI_STARTERS, generateAnonymousIdentity, NEON_COLORS } from "@/lib/utils";
import { Zap, X, Heart, Filter, Shuffle, MessageCircle, Star, Map, Users } from "lucide-react";
import MobileNav from "@/components/MobileNav";
import toast from "react-hot-toast";

const generateMatches = (): Match[] =>
  Array.from({ length: 12 }, (_, i) => {
    const id = generateAnonymousIdentity();
    return {
      id: `m_${i}`,
      username: id.username,
      emoji: id.emoji,
      color: id.color,
      interests: INTERESTS.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 2),
      mood: MOODS[Math.floor(Math.random() * MOODS.length)].value,
      bio: [
        "Just here to vibe 🌙",
        "Night owl & coffee addict ☕",
        "CSE final year. Send help 💀",
        "Looking for my lab partner 🔬",
        "Meme lord seeking equal 😂",
        "Overthinker with good playlists 🎵",
        "Bored in class, ping me 👀",
        "Arts + engineering crossover 🎨",
      ][i % 8],
      isOnline: Math.random() > 0.4,
      distance: `${Math.floor(Math.random() * 900) + 100}m away`,
      matchScore: Math.floor(Math.random() * 40) + 60,
    };
  });

function MatchCard({ match, onSwipe }: { match: Match; onSwipe: (dir: "left" | "right") => void }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-150, -50], [1, 0]);
  const mood = MOODS.find(m => m.value === match.mood);

  return (
    <motion.div
      className="match-card"
      style={{ x, rotate, touchAction: "none" }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 120) onSwipe("right");
        else if (info.offset.x < -120) onSwipe("left");
      }}
      whileTap={{ cursor: "grabbing" }}
    >
      <div className="glass neon-border" style={{ borderRadius: 24, padding: "1.5rem", position: "relative", overflow: "hidden" }}>
        {/* Match % badge + LIVE badge */}
        <div style={{ position: "absolute", top: 16, right: 16, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
          <div style={{ background: `${match.color}22`, border: `1px solid ${match.color}55`, borderRadius: 999, padding: "4px 10px", fontSize: "0.75rem", fontWeight: 700, color: match.color }}>
            {match.matchScore}% match
          </div>
          {match.matchScore === 99 && (
            <div style={{ background: "rgba(16,185,129,0.2)", border: "1px solid #10b981", borderRadius: 999, padding: "2px 8px", fontSize: "0.65rem", fontWeight: 700, color: "#10b981", display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "pulse 1.5s infinite" }} />
              LIVE
            </div>
          )}
        </div>

        {/* Like/Nope overlays */}
        <motion.div style={{ opacity: likeOpacity, position: "absolute", top: 16, left: 16, zIndex: 10 }}>
          <div style={{ border: "2px solid #10b981", borderRadius: 8, padding: "4px 12px", color: "#10b981", fontWeight: 800, fontSize: "1.2rem", transform: "rotate(-15deg)" }}>VIBE ✓</div>
        </motion.div>
        <motion.div style={{ opacity: nopeOpacity, position: "absolute", top: 16, right: 16, zIndex: 10 }}>
          <div style={{ border: "2px solid #ef4444", borderRadius: 8, padding: "4px 12px", color: "#ef4444", fontWeight: 800, fontSize: "1.2rem", transform: "rotate(15deg)" }}>PASS ✗</div>
        </motion.div>

        {/* Avatar */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "1rem" }}>
          {match.avatarUrl ? (
            <img src={match.avatarUrl} alt="Avatar" style={{
              width: 100, height: 100, borderRadius: 28, objectFit: "cover", marginBottom: "1rem",
              border: `3px solid ${match.color}44`, boxShadow: `0 0 40px ${match.color}30`
            }} />
          ) : (
            <div style={{
              width: 100, height: 100, borderRadius: 28, fontSize: "3.5rem",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: `${match.color}18`, border: `3px solid ${match.color}44`,
              boxShadow: `0 0 40px ${match.color}30`, marginBottom: "1rem",
            }}>{match.emoji}</div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: match.color }}>{match.username}</h2>
            {match.isOnline && <span className="pulse-dot" />}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "1rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text3)" }}>{match.distance}</span>
            <span style={{ color: "var(--text3)" }}>·</span>
            <span style={{ fontSize: "0.75rem", background: `${mood?.color || "#a855f7"}22`, color: mood?.color || "#a855f7", padding: "2px 8px", borderRadius: 999, border: `1px solid ${mood?.color || "#a855f7"}44` }}>
              {MOODS.find(m => m.value === match.mood)?.label || match.mood}
            </span>
          </div>

          <p style={{ color: "var(--text2)", fontSize: "0.9rem", textAlign: "center", marginBottom: "1.2rem", fontStyle: "italic" }}>&quot;{match.bio}&quot;</p>

          {/* Interests */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginBottom: "1rem" }}>
            {match.interests.map(i => (
              <span key={i} className="tag-chip" style={{ cursor: "default" }}>{i}</span>
            ))}
          </div>

          {/* Starter */}
          <div className="glass" style={{ borderRadius: 12, padding: "0.75rem 1rem", width: "100%", textAlign: "center" }}>
            <p style={{ fontSize: "0.65rem", color: "var(--text3)", marginBottom: 4 }}>💡 Try saying</p>
            <p style={{ fontSize: "0.8rem", color: "var(--text2)", fontStyle: "italic" }}>&quot;{AI_STARTERS[Math.floor(Math.random() * AI_STARTERS.length)]}&quot;</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function DiscoverPage() {
  const router = useRouter();
  const { user, isAuthenticated, adultMode, onlineUsers } = useAppStore();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<"swipe" | "nearby" | "rooms">("swipe");
  const [filterMood, setFilterMood] = useState<string>("all");
  const [showFilter, setShowFilter] = useState(false);
  const [likedIds, setLikedIds] = useState<string[]>([]);

  useEffect(() => {
    if (!isAuthenticated) router.push("/");
  }, [isAuthenticated, router]);

  // Seed users always visible (generated once per session on the client)
  const [seedMatches] = useState<Match[]>(() => generateMatches());

  // Real socket users mapped to Match shape
  const liveMatches: Match[] = onlineUsers
    .filter(u => u.id !== user?.id) // exclude self
    .map(u => ({
      id: u.id,
      username: u.isAnonymous ? u.username : (u.realName || u.username),
      emoji: u.emoji,
      avatarUrl: !u.isAnonymous ? u.avatarUrl : undefined,
      color: u.color,
      interests: u.interests,
      mood: u.mood,
      bio: "🟢 Online right now — real person!",
      isOnline: true,
      distance: "On campus",
      matchScore: 99,
    }));

  // Merge: real users on top, seed users fill the deck
  const matches: Match[] = [
    ...liveMatches,
    ...seedMatches.filter(s => !liveMatches.find(l => l.id === s.id)),
  ].filter(m => filterMood === "all" || m.mood === filterMood);

  const handleSwipe = (dir: "left" | "right", id: string) => {
    if (dir === "right") {
      setLikedIds(p => [...p, id]);
      toast.success("💘 You vibed! Check if they vibe back.", { duration: 2000 });
    }
    setCurrentIdx(i => i + 1);
  };

  const [deckKey, setDeckKey] = useState(0);
  const resetDeck = () => {
    setCurrentIdx(0);
    setDeckKey(k => k + 1);
  };

  const currentMatch = matches[currentIdx];

  return (
    <main style={{ minHeight: "100vh", paddingBottom: 80, maxWidth: 480, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ padding: "2rem 1.25rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "Space Grotesk, sans-serif" }} className="grad-text">Discover</h1>
          <p style={{ fontSize: "0.75rem", color: "var(--text3)" }}>Swipe to find your vibe ⚡</p>
        </div>
        <button onClick={() => setShowFilter(v => !v)} className="btn-ghost" style={{ padding: "0.5rem 0.8rem", display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem" }}>
          <Filter size={14} /> Filter
        </button>
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilter && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ padding: "0 1.25rem", overflow: "hidden" }}>
            <div className="glass" style={{ borderRadius: 16, padding: "1rem", marginBottom: "1rem" }}>
              <p style={{ fontSize: "0.75rem", fontWeight: 600, marginBottom: 10, color: "var(--text2)" }}>Filter by Mood</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <button onClick={() => setFilterMood("all")} className={`tag-chip${filterMood === "all" ? " selected" : ""}`}>All Moods</button>
                {MOODS.map(m => (
                  <button key={m.value} onClick={() => setFilterMood(m.value)} className={`tag-chip${filterMood === m.value ? " selected" : ""}`} style={{ borderColor: `${m.color}44`, color: filterMood === m.value ? m.color : undefined }}>
                    {m.label}
                  </button>
                ))}
              </div>
              {adultMode && (
                <p style={{ fontSize: "0.7rem", color: "#ec4899", marginTop: 10 }}>🔞 Adult mode active — showing 18+ profiles</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div style={{ padding: "0 1.25rem", marginBottom: "1.2rem" }}>
        <div className="glass" style={{ borderRadius: 12, padding: 4, display: "flex", gap: 4 }}>
          {[
            { key: "swipe", label: "⚡ Swipe" },
            { key: "nearby", label: "📍 Nearby" },
            { key: "rooms", label: "🏠 Rooms" },
          ].map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key as any)}
              style={{
                flex: 1, padding: "0.5rem", borderRadius: 9, border: "none", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, transition: "all 0.3s",
                background: activeTab === t.key ? "linear-gradient(135deg,#a855f7,#ec4899)" : "transparent",
                color: activeTab === t.key ? "white" : "var(--text2)",
              }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Swipe Tab */}
      {activeTab === "swipe" && (
        <div style={{ padding: "0 1.25rem" }}>
          {currentMatch ? (
            <>
              <div style={{ position: "relative", height: 460, marginBottom: "1.5rem" }}>
                <AnimatePresence>
                  {matches.slice(currentIdx, currentIdx + 2).reverse().map((m, i) => (
                    <motion.div key={m.id} style={{ position: "absolute", width: "100%", transform: i === 0 ? `scale(0.96) translateY(8px)` : "scale(1)" }}
                      initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: i === 0 ? 0.96 : 1, opacity: 1 }}>
                      {i === 1 ? <MatchCard match={m} onSwipe={(dir) => handleSwipe(dir, m.id)} /> : (
                        <div className="glass" style={{ borderRadius: 24, padding: "1.5rem", height: 400 }} />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleSwipe("left", currentMatch.id)}
                  style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(239,68,68,0.15)", border: "2px solid rgba(239,68,68,0.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <X size={24} color="#ef4444" />
                </motion.button>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => { toast.success("⭐ Super vibe sent!"); setCurrentIdx(i => i + 1); }}
                  style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(245,158,11,0.15)", border: "2px solid rgba(245,158,11,0.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <Star size={18} color="#f59e0b" />
                </motion.button>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleSwipe("right", currentMatch.id)}
                  style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(16,185,129,0.15)", border: "2px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <Heart size={24} color="#10b981" />
                </motion.button>
              </div>
              <p style={{ textAlign: "center", fontSize: "0.7rem", color: "var(--text3)", marginTop: 12 }}>
                Drag or tap ✗ / ♥ — {matches.length - currentIdx} left
              </p>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
              <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</p>
              <h3 style={{ fontWeight: 700, marginBottom: 8 }}>You've seen everyone!</h3>
              <p style={{ color: "var(--text3)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>Refresh for new profiles</p>
              <button onClick={resetDeck} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 auto" }}>
                <Shuffle size={16} /> Find More Ghosts
              </button>
            </div>
          )}
        </div>
      )}

      {/* Nearby Tab */}
      {activeTab === "nearby" && (
        <div style={{ padding: "0 1.25rem" }}>
          {matches.slice(0, 8).length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text3)", padding: "2rem 0" }}>No users nearby right now</p>
          ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {matches.slice(0, 8).map((m, i) => (
              <motion.div key={m.id} className="glass card-hover" style={{ borderRadius: 16, padding: "1rem", textAlign: "center" }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                {m.avatarUrl ? (
                  <img src={m.avatarUrl} alt="Avatar" style={{ width: 48, height: 48, borderRadius: 14, objectFit: "cover", margin: "0 auto 8px", border: `2px solid ${m.color}44` }} />
                ) : (
                  <div style={{ fontSize: "2rem", marginBottom: 8, filter: `drop-shadow(0 0 10px ${m.color}80)` }}>{m.emoji}</div>
                )}
                <p style={{ fontWeight: 600, fontSize: "0.8rem", color: m.color, marginBottom: 2 }}>{m.username.split("#")[0]}</p>
                <p style={{ fontSize: "0.65rem", color: "var(--text3)", marginBottom: 4 }}>📍 {m.distance}</p>
                {m.isOnline && <span className="pulse-dot" style={{ display: "inline-block", marginBottom: 4 }} />}
                {m.matchScore === 99 && <p style={{ fontSize: "0.6rem", color: "#10b981", marginBottom: 4, fontWeight: 700 }}>🟢 LIVE</p>}
                <button onClick={() => router.push(`/chat/${m.id}`)} className="btn-ghost"
                  style={{ width: "100%", marginTop: 6, padding: "0.4rem", fontSize: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <MessageCircle size={12} /> Chat
                </button>
              </motion.div>
            ))}
          </div>
          )}
        </div>
      )}

      {/* Rooms Tab */}
      {activeTab === "rooms" && (
        <div style={{ padding: "0 1.25rem" }}>
          <button onClick={() => router.push("/community")} className="btn-primary"
            style={{ width: "100%", marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Users size={16} /> Browse All Community Rooms
          </button>
        </div>
      )}

      <MobileNav />
    </main>
  );
}
