"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { useState, useEffect } from "react";
import { Zap, Users, MessageCircle, Lock, User } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, onlineCount } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated) router.push("/discover");
  }, [isAuthenticated, router]);

  const features = [
    { icon: <User size={18} />, color: "#a855f7", title: "Real People", desc: "No bots, no fake aliases. Connect using your real name." },
    { icon: <Zap size={18} />, color: "#f59e0b", title: "Instant Connect", desc: "Instantly connect with a random person of the opposite gender." },
    { icon: <MessageCircle size={18} />, color: "#06b6d4", title: "Only Chats", desc: "No swiping, no approval queue. Just pure conversation." },
    { icon: <Lock size={18} />, color: "#ec4899", title: "100% Authentic", desc: "Everyone starts at zero. If the counter says 0, you're the first one here." },
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
              <Users size={28} color="white" />
            </div>
            <span style={{ fontSize: "2.2rem", fontWeight: 800, fontFamily: "Space Grotesk, sans-serif" }} className="grad-text">VEIL</span>
          </motion.div>

          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 999, padding: "5px 14px", fontSize: "0.72rem", color: "#10b981", fontWeight: 600, marginBottom: "1.2rem" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "pulse 1.5s infinite" }} />
            {onlineCount} real {onlineCount === 1 ? "user" : "users"} online right now
          </div>

          <h1 style={{ fontSize: "2.6rem", fontWeight: 900, lineHeight: 1.15, marginBottom: "1rem", fontFamily: "Space Grotesk, sans-serif" }}>
            Real Names.<br />
            <span className="grad-text">Real Connections.</span>
          </h1>
          <p style={{ color: "var(--text2)", fontSize: "1rem", lineHeight: 1.65, marginBottom: "2rem" }}>
            A simple space to connect with someone of the opposite gender. Enter your real name, select your gender, and instantly start chatting. Zero bots. Zero fake profiles.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <motion.button onClick={() => router.push("/join")} className="btn-primary"
              whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}
              style={{ width: "100%", fontSize: "1rem", padding: "1rem 1.5rem", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <Zap size={20} /> Enter Your Name to Connect
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section style={{ padding: "0 1.25rem 2rem", maxWidth: 520, margin: "0 auto" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "1.4rem", textAlign: "center", fontFamily: "Space Grotesk, sans-serif" }}>
          How it works ✨
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {features.map((f, i) => (
            <motion.div key={f.title} className="glass card-hover" style={{ borderRadius: 16, padding: "1rem 1.2rem", display: "flex", alignItems: "flex-start", gap: 14 }}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 * i + 0.2 }}>
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

    </main>
  );
}
