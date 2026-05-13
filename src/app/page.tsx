"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { AI_STARTERS } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Ghost, Shield, ChevronRight, Zap, Users, MessageCircle, Lock } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppStore();
  const [starterIdx, setStarterIdx] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated) router.push("/discover");
    const t = setInterval(() => setStarterIdx(i => (i + 1) % AI_STARTERS.length), 3500);
    return () => clearInterval(t);
  }, [isAuthenticated, router]);

  const stats = [
    { label: "Online Now", value: "1.2K+", icon: "🟢" },
    { label: "Chats Today", value: "48K", icon: "💬" },
    { label: "Matches", value: "3.4K", icon: "💘" },
    { label: "Confessions", value: "892", icon: "🤫" },
  ];

  const features = [
    { icon: <Ghost size={18} />, color: "#a855f7", title: "100% Anonymous", desc: "No real name or photo required. Your identity is yours to control." },
    { icon: <Zap size={18} />, color: "#f59e0b", title: "Instant Matching", desc: "Swipe-based matching with real students currently online." },
    { icon: <MessageCircle size={18} />, color: "#06b6d4", title: "Disappearing Chats", desc: "Messages auto-delete after your chosen timer. Zero traces." },
    { icon: <Users size={18} />, color: "#10b981", title: "Campus Rooms", desc: "Join confessions, debates, and topic rooms exclusive to your college." },
    { icon: <Lock size={18} />, color: "#ec4899", title: "No Bots, Ever", desc: "Every profile is a real verified student. We actively ban fake accounts." },
    { icon: <Shield size={18} />, color: "#8b5cf6", title: "End-to-End Privacy", desc: "Your data never leaves our encrypted servers." },
  ];

  if (!mounted) return null;

  return (
    <main style={{ minHeight: "100vh", paddingBottom: "100px", overflowX: "hidden" }}>
      {/* Hero */}
      <section style={{ padding: "4rem 1.25rem 2rem", textAlign: "center", maxWidth: 520, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

          {/* Logo */}
          <motion.div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: "1.5rem" }}
            animate={{ filter: ["drop-shadow(0 0 20px rgba(168,85,247,0.3))", "drop-shadow(0 0 40px rgba(168,85,247,0.6))", "drop-shadow(0 0 20px rgba(168,85,247,0.3))"] }}
            transition={{ duration: 3, repeat: Infinity }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg,#a855f7,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 30px rgba(168,85,247,0.5)" }}>
              <Ghost size={28} color="white" />
            </div>
            <span style={{ fontSize: "2.2rem", fontWeight: 800, fontFamily: "Space Grotesk, sans-serif" }} className="grad-text">VEIL</span>
          </motion.div>

          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 999, padding: "5px 14px", fontSize: "0.72rem", color: "#10b981", fontWeight: 600, marginBottom: "1.2rem" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "pulse 1.5s infinite" }} />
            1,243 students online right now
          </div>

          <h1 style={{ fontSize: "2.6rem", fontWeight: 900, lineHeight: 1.15, marginBottom: "1rem", fontFamily: "Space Grotesk, sans-serif" }}>
            Meet. Vibe. Connect.<br />
            <span className="grad-text">No Judgement.</span>
          </h1>
          <p style={{ color: "var(--text2)", fontSize: "1rem", lineHeight: 1.65, marginBottom: "2rem" }}>
            The anonymous campus social platform for <strong style={{ color: "#a855f7" }}>real students</strong> at <strong style={{ color: "#ec4899" }}>Dronacharya College</strong> and beyond.
            Zero bots. Zero fake profiles. Pure human connection.
          </p>

          {/* Rotating conversation starter */}
          <div className="glass" style={{ borderRadius: 14, padding: "0.9rem 1.2rem", marginBottom: "2rem", textAlign: "left", borderLeft: "3px solid #a855f7" }}>
            <p style={{ fontSize: "0.6rem", color: "var(--text3)", marginBottom: 4, letterSpacing: "0.1em", textTransform: "uppercase" }}>💡 Conversation Starter</p>
            <AnimatePresence mode="wait">
              <motion.p key={starterIdx}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
                style={{ color: "var(--text)", fontSize: "0.9rem", fontStyle: "italic" }}>
                &quot;{AI_STARTERS[starterIdx]}&quot;
              </motion.p>
            </AnimatePresence>
          </div>

          {/* CTA Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <motion.button onClick={() => router.push("/join")} className="btn-primary"
              whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}
              style={{ width: "100%", fontSize: "1rem", padding: "1rem 1.5rem", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <Zap size={20} /> Create My Anonymous Profile
            </motion.button>
            <motion.button onClick={() => router.push("/join")} className="btn-ghost"
              whileTap={{ scale: 0.97 }}
              style={{ width: "100%", fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Ghost size={16} /> Skip — Enter as Ghost <ChevronRight size={14} />
            </motion.button>
          </div>

          <p style={{ marginTop: 14, fontSize: "0.7rem", color: "var(--text3)" }}>
            No account. No email. No tracking. Just vibes. 🔒
          </p>
        </motion.div>
      </section>

      {/* Stats */}
      <section style={{ padding: "0 1.25rem 2rem", maxWidth: 520, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {stats.map((s, i) => (
            <motion.div key={s.label} className="glass card-hover" style={{ borderRadius: 16, padding: "1.1rem", textAlign: "center" }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i + 0.4 }}>
              <p style={{ fontSize: "1.4rem", marginBottom: 4 }}>{s.icon}</p>
              <p style={{ fontSize: "1.5rem", fontWeight: 800 }} className="grad-text">{s.value}</p>
              <p style={{ fontSize: "0.72rem", color: "var(--text3)" }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "0 1.25rem 2rem", maxWidth: 520, margin: "0 auto" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "1.4rem", textAlign: "center", fontFamily: "Space Grotesk, sans-serif" }}>
          Why students love Veil ✨
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {features.map((f, i) => (
            <motion.div key={f.title} className="glass card-hover" style={{ borderRadius: 16, padding: "1rem 1.2rem", display: "flex", alignItems: "flex-start", gap: 14 }}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 * i + 0.6 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${f.color}18`, border: `1px solid ${f.color}33`, display: "flex", alignItems: "center", justifyContent: "center", color: f.color, flexShrink: 0 }}>
                {f.icon}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: 3 }}>{f.title}</p>
                <p style={{ fontSize: "0.78rem", color: "var(--text2)", lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ padding: "0 1.25rem", maxWidth: 520, margin: "0 auto" }}>
        <motion.div className="glass-purple" style={{ borderRadius: 20, padding: "1.8rem", textAlign: "center" }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
          <p style={{ fontSize: "1.8rem", marginBottom: 8 }}>👻</p>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, fontFamily: "Space Grotesk, sans-serif", marginBottom: 6 }}>
            Ready to meet your campus?
          </h3>
          <p style={{ fontSize: "0.82rem", color: "var(--text2)", marginBottom: "1.4rem" }}>
            Join 1,200+ students already vibing on Veil right now.
          </p>
          <motion.button onClick={() => router.push("/join")} className="btn-primary"
            whileTap={{ scale: 0.97 }}
            style={{ width: "100%", padding: "0.95rem", borderRadius: 14, fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <Zap size={20} /> Get Started — It&apos;s Free
          </motion.button>
        </motion.div>
      </section>
    </main>
  );
}
