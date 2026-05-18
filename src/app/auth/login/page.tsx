"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2, Lock } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (res?.error) {
        throw new Error(res.error);
      }

      toast.success("Welcome back!");
      router.push("/");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", padding: "1.25rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass" style={{ width: "100%", maxWidth: 400, padding: "2rem", borderRadius: 24, position: "relative", overflow: "hidden" }}>
        
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,#a855f7,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", boxShadow: "0 0 20px rgba(168,85,247,0.4)" }}>
            <Lock size={24} color="white" />
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "Space Grotesk, sans-serif" }}>Welcome Back</h1>
          <p style={{ color: "var(--text2)", fontSize: "0.9rem", marginTop: 4 }}>Log in to access Veil</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text2)", marginBottom: 6, display: "block" }}>Email</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="input-glass" placeholder="you@college.edu" style={{ width: "100%" }} />
          </div>
          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text2)", marginBottom: 6, display: "block" }}>Password</label>
            <input required type="password" name="password" value={formData.password} onChange={handleChange} className="input-glass" placeholder="••••••••" style={{ width: "100%" }} />
          </div>
          
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", padding: "1rem", borderRadius: 12, marginTop: 10, display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
            {loading ? <Loader2 size={18} className="spin" /> : "Log In"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.85rem", color: "var(--text2)" }}>
          Don't have an account? <button onClick={() => router.push("/auth/signup")} style={{ color: "#a855f7", fontWeight: 600 }}>Sign up</button>
        </p>

      </motion.div>
    </main>
  );
}
