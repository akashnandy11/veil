"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, UserCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: "", interests: "", age: "" });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (session?.user) {
      setForm({
        username: session.user.name || "",
        interests: "",
        age: "",
      });
    }
  }, [session, status, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/profile/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      await update(); // Refresh session
      toast.success("Profile updated!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 size={32} className="spin" color="#a855f7" />
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", padding: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass" style={{ width: "100%", maxWidth: 480, padding: "2rem", borderRadius: 24 }}>
        
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "2rem" }}>
          <button onClick={() => router.push("/")} className="glass" style={{ padding: "0.5rem 1rem", borderRadius: 10, display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem" }}>
            <ArrowLeft size={16} /> Back
          </button>
          <h1 style={{ fontSize: "1.3rem", fontWeight: 800, fontFamily: "Space Grotesk, sans-serif" }}>My Profile</h1>
        </div>

        {/* Avatar */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#a855f7,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", boxShadow: "0 0 24px rgba(168,85,247,0.4)", fontSize: "2.5rem" }}>
            {(session?.user as any)?.gender === "female" ? "👩" : "👨"}
          </div>
          <p style={{ fontWeight: 700, fontSize: "1.1rem" }}>{session?.user?.name}</p>
          <p style={{ color: "var(--text3)", fontSize: "0.85rem" }}>{session?.user?.email}</p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 6, background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 999, padding: "3px 12px", fontSize: "0.75rem", color: "#a855f7", fontWeight: 600 }}>
            {(session?.user as any)?.gender === "female" ? "Female" : "Male"} · DCE Student
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text2)", marginBottom: 6, display: "block" }}>Username</label>
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="input-glass"
              placeholder="Your username"
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text2)", marginBottom: 6, display: "block" }}>Age</label>
            <input
              type="number"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              className="input-glass"
              placeholder="Your age"
              style={{ width: "100%" }}
              min="13"
            />
          </div>
          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text2)", marginBottom: 6, display: "block" }}>
              Interests <span style={{ color: "var(--text3)", fontWeight: 400 }}>(comma separated)</span>
            </label>
            <input
              value={form.interests}
              onChange={(e) => setForm({ ...form, interests: e.target.value })}
              className="input-glass"
              placeholder="Coding, Music, Anime..."
              style={{ width: "100%" }}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ padding: "1rem", borderRadius: 12, display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 8 }}>
            {loading ? <Loader2 size={18} className="spin" /> : <><Save size={18} /> Save Changes</>}
          </button>
        </form>

      </motion.div>
    </main>
  );
}
