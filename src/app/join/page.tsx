"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Users, Zap } from "lucide-react";
import toast from "react-hot-toast";

export default function JoinPage() {
  const router = useRouter();
  const { setUser, isAuthenticated } = useAppStore();
  const [displayName, setDisplayName] = useState("");
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated) router.push("/discover");
  }, [isAuthenticated, router]);

  const handleJoin = () => {
    if (!displayName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!gender) {
      toast.error("Please select your gender");
      return;
    }

    setUser({
      id: `u_${Date.now()}`,
      username: displayName.trim(),
      gender,
      isOnline: true,
      joinedAt: new Date(),
    });
    
    toast.success(`Welcome, ${displayName.trim()}!`);
    router.push("/discover");
  };

  if (!mounted) return null;

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem 1.25rem" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#a855f7,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(168,85,247,0.5)" }}>
              <Users size={22} color="white" />
            </div>
            <span style={{ fontSize: "1.6rem", fontWeight: 800, fontFamily: "Space Grotesk, sans-serif" }} className="grad-text">VEIL</span>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "Space Grotesk, sans-serif" }}>Get <span className="grad-text">Connected</span></h2>
            <p style={{ color: "var(--text2)", fontSize: "0.85rem", marginTop: 6 }}>Enter your details to find real people.</p>
          </div>

          <div className="glass" style={{ borderRadius: 16, padding: "1.5rem", marginBottom: "1.5rem" }}>
            <p style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: 12 }}>What's your real name?</p>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="e.g. Akash"
              className="input-glass"
              style={{ marginTop: 0 }}
              autoFocus
            />

            <p style={{ fontWeight: 600, fontSize: "0.9rem", marginTop: "1.5rem", marginBottom: 12 }}>I am a...</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button 
                onClick={() => setGender("male")}
                style={{
                  flex: 1, padding: "1rem", borderRadius: 12, border: "none", cursor: "pointer", fontWeight: 600, fontSize: "1rem",
                  background: gender === "male" ? "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.4))" : "rgba(255,255,255,0.06)",
                  color: gender === "male" ? "#60a5fa" : "var(--text2)",
                  outline: gender === "male" ? "2px solid #3b82f6" : "none",
                  transition: "all 0.2s"
                }}
              >
                👨 Male
              </button>
              <button 
                onClick={() => setGender("female")}
                style={{
                  flex: 1, padding: "1rem", borderRadius: 12, border: "none", cursor: "pointer", fontWeight: 600, fontSize: "1rem",
                  background: gender === "female" ? "linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(219, 39, 119, 0.4))" : "rgba(255,255,255,0.06)",
                  color: gender === "female" ? "#f472b6" : "var(--text2)",
                  outline: gender === "female" ? "2px solid #ec4899" : "none",
                  transition: "all 0.2s"
                }}
              >
                👩 Female
              </button>
            </div>
          </div>

          <motion.button onClick={handleJoin} className="btn-primary" whileTap={{ scale: 0.97 }}
            style={{ width: "100%", fontSize: "1rem", padding: "1rem", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <Zap size={20} /> Enter Chat
          </motion.button>
        </motion.div>
      </div>
    </main>
  );
}
