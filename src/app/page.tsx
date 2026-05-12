"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { generateAnonymousIdentity, AI_STARTERS } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Ghost, Shield, ChevronRight, Shuffle, Star } from "lucide-react";
import toast from "react-hot-toast";

export default function LandingPage() {
  const router = useRouter();
  const { setUser, isAuthenticated } = useAppStore();
  const [identity, setIdentity] = useState({ username: "GhostPanda#0000", emoji: "👻", color: "#a855f7" });
  const [mounted, setMounted] = useState(false);
  const [starterIdx, setStarterIdx] = useState(0);
  const [adultConsent, setAdultConsent] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIdentity(generateAnonymousIdentity());
    if (isAuthenticated) router.push("/discover");
    const t = setInterval(() => setStarterIdx(i => (i + 1) % AI_STARTERS.length), 3500);
    return () => clearInterval(t);
  }, [isAuthenticated, router]);

  const joinAnonymously = () => {
    const id = generateAnonymousIdentity();
    setUser({
      id: `u_${Date.now()}`,
      username: id.username,
      emoji: id.emoji,
      color: id.color,
      isAnonymous: true,
      isAdult: adultConsent,
      interests: [],
      mood: "chill",
      isOnline: true,
      joinedAt: new Date(),
    });
    toast.success("You're now anonymous 👻");
    router.push("/discover");
  };

  const stats = [
    { label: "Active Now", value: "1.2K", icon: "🟢" },
    { label: "Messages Today", value: "48K", icon: "💬" },
    { label: "Matches Made", value: "3.4K", icon: "💘" },
    { label: "Confessions", value: "892", icon: "🤫" },
  ];

  const features = [
    { icon: "👻", title: "Fully Anonymous", desc: "No real name, no face. Just vibes." },
    { icon: "⚡", title: "Instant Match", desc: "Swipe & connect with DCE students instantly." },
    { icon: "💬", title: "Disappearing Chats", desc: "Auto-delete messages after your set time." },
    { icon: "🔞", title: "18+ Mode", desc: "Opt-in adult chat for consenting users only." },
    { icon: "🏫", title: "Campus Rooms", desc: "DCE-specific community rooms & confessions." },
    { icon: "💘", title: "Secret Crush", desc: "Send anonymous crushes. Reveal on mutual match." },
  ];

  return (
    <main style={{ minHeight: "100vh", paddingBottom: "100px" }}>
      {/* Hero */}
      <section style={{ padding: "4rem 1.25rem 2rem", textAlign: "center", maxWidth: 520, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: "1.5rem" }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16,
              background: "linear-gradient(135deg,#a855f7,#ec4899)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 30px rgba(168,85,247,0.5)",
            }}>
              <Ghost size={28} color="white" />
            </div>
            <span style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "Space Grotesk, sans-serif" }}
              className="grad-text">VEIL</span>
          </div>

          <h1 style={{ fontSize: "2.6rem", fontWeight: 900, lineHeight: 1.15, marginBottom: "1rem", fontFamily: "Space Grotesk, sans-serif" }}>
            Connect Anonymously.<br />
            <span className="grad-text">No Judgement.</span>
          </h1>
          <p style={{ color: "var(--text2)", fontSize: "1rem", lineHeight: 1.6, marginBottom: "2rem" }}>
            The anonymous social platform built for <strong style={{ color: "#a855f7" }}>Dronacharya College</strong> students.
            Meet, vibe, confess — your identity stays hidden.
          </p>

          {/* AI Starter ticker */}
          <div className="glass" style={{ borderRadius: 14, padding: "0.9rem 1.2rem", marginBottom: "2rem", textAlign: "left" }}>
            <p style={{ fontSize: "0.65rem", color: "var(--text3)", marginBottom: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>AI Conversation Starter</p>
            <AnimatePresence mode="wait">
              <motion.p key={starterIdx}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                style={{ color: "var(--text)", fontSize: "0.9rem", fontStyle: "italic" }}>
                &quot;{AI_STARTERS[starterIdx]}&quot;
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Identity preview */}
          <motion.div className="glass-purple" style={{ borderRadius: 16, padding: "1.2rem", marginBottom: "1.5rem" }}
            whileHover={{ scale: 1.02 }}>
            <p style={{ fontSize: "0.65rem", color: "var(--text3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Your Anonymous Identity</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 50, height: 50, borderRadius: 14, fontSize: "1.6rem",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: `${identity.color}22`, border: `2px solid ${identity.color}44`,
                  boxShadow: `0 0 20px ${identity.color}30`,
                }}>{identity.emoji}</div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "1rem", color: identity.color }}>{identity.username}</p>
                  <p style={{ fontSize: "0.72rem", color: "var(--text3)" }}>Anonymous · DCE Ghost</p>
                </div>
              </div>
              <button onClick={() => setIdentity(generateAnonymousIdentity())}
                className="btn-ghost" style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: 6 }}>
                <Shuffle size={14} /> Reroll
              </button>
            </div>
          </motion.div>

          {/* 18+ toggle */}
          <div className="glass" style={{ borderRadius: 12, padding: "0.8rem 1.2rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: "0.85rem" }}>🔞 Enable Adult Mode</p>
              <p style={{ fontSize: "0.72rem", color: "var(--text3)" }}>I confirm I am 18+ years old</p>
            </div>
            <button onClick={() => setAdultConsent(v => !v)}
              style={{
                width: 44, height: 24, borderRadius: 12, cursor: "pointer", border: "none",
                background: adultConsent ? "linear-gradient(135deg,#a855f7,#ec4899)" : "rgba(255,255,255,0.1)",
                position: "relative", transition: "all 0.3s",
              }}>
              <div style={{
                width: 18, height: 18, borderRadius: "50%", background: "white",
                position: "absolute", top: 3, transition: "all 0.3s",
                left: adultConsent ? 23 : 3, boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              }} />
            </button>
          </div>

          {/* CTA Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <motion.button onClick={joinAnonymously} className="btn-primary"
              whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}
              style={{ width: "100%", fontSize: "1rem", padding: "1rem", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <Ghost size={20} /> Join Anonymously — Instant
            </motion.button>
            <motion.button onClick={() => router.push("/join")} className="btn-ghost"
              whileTap={{ scale: 0.97 }}
              style={{ width: "100%", fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Star size={16} /> Sign up with Email/Google
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section style={{ padding: "2rem 1.25rem", maxWidth: 520, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {stats.map((s, i) => (
            <motion.div key={s.label} className="glass card-hover" style={{ borderRadius: 14, padding: "1rem", textAlign: "center" }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i + 0.5 }}>
              <p style={{ fontSize: "1.5rem", marginBottom: 4 }}>{s.icon}</p>
              <p style={{ fontSize: "1.4rem", fontWeight: 800 }} className="grad-text">{s.value}</p>
              <p style={{ fontSize: "0.72rem", color: "var(--text3)" }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "0 1.25rem 2rem", maxWidth: 520, margin: "0 auto" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.2rem", textAlign: "center" }}>Why Veil? ✨</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {features.map((f, i) => (
            <motion.div key={f.title} className="glass card-hover" style={{ borderRadius: 14, padding: "1rem 1.2rem", display: "flex", alignItems: "flex-start", gap: 14 }}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 * i + 0.8 }}>
              <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>{f.icon}</span>
              <div>
                <p style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: 2 }}>{f.title}</p>
                <p style={{ fontSize: "0.78rem", color: "var(--text2)" }}>{f.desc}</p>
              </div>
              <ChevronRight size={16} style={{ color: "var(--text3)", marginLeft: "auto", flexShrink: 0, marginTop: 2 }} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Privacy note */}
      <section style={{ padding: "0 1.25rem", maxWidth: 520, margin: "0 auto" }}>
        <div className="glass" style={{ borderRadius: 14, padding: "1rem 1.2rem", display: "flex", gap: 12, alignItems: "flex-start" }}>
          <Shield size={20} style={{ color: "#a855f7", flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontWeight: 600, fontSize: "0.85rem", marginBottom: 3 }}>Your privacy is protected</p>
            <p style={{ fontSize: "0.75rem", color: "var(--text2)", lineHeight: 1.5 }}>
              Public users only see your anonymous identity. Platform admins securely store metadata for safety & moderation only. Chats are encrypted.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
