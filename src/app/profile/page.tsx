"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { LogOut } from "lucide-react";
import MobileNav from "@/components/MobileNav";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAppStore();

  useEffect(() => { 
    if (!user) router.push("/"); 
  }, [user, router]);

  if (!user) return null;

  return (
    <main style={{ minHeight: "100vh", paddingBottom: 90, maxWidth: 480, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ padding: "2rem 1.25rem 0" }}>
        {/* Identity card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass neon-border" style={{ borderRadius: 24, padding: "2rem 1.5rem", marginBottom: "2rem", textAlign: "center" }}>
          
          <div style={{
            width: 80, height: 80, borderRadius: 22, fontSize: "2.8rem",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem",
            background: user.gender === 'male' ? "rgba(59, 130, 246, 0.2)" : "rgba(236, 72, 153, 0.2)",
            border: user.gender === 'male' ? "3px solid rgba(59, 130, 246, 0.4)" : "3px solid rgba(236, 72, 153, 0.4)",
          }}>{user.gender === 'male' ? '👨' : '👩'}</div>

          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: user.gender === 'male' ? '#60a5fa' : '#f472b6', marginBottom: 4 }}>
            {user.username}
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text3)", marginBottom: "1rem" }}>
            Real Identity · {user.gender === 'male' ? 'Male' : 'Female'}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
            <span className="pulse-dot" />
            <span style={{ fontSize: "0.8rem", color: "#10b981" }}>Online</span>
          </div>
        </motion.div>
        
        <button onClick={() => { logout(); router.push("/"); toast.success("Logged out safely 👋"); }}
          style={{ borderRadius: 14, padding: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", cursor: "pointer", color: "#ef4444", width: "100%", fontWeight: 600, fontSize: "1rem" }}>
          <LogOut size={20} /> Logout
        </button>
      </div>

      <MobileNav />
    </main>
  );
}
