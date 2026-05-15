"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { getSocket } from "@/components/SocketProvider";
import MobileNav from "@/components/MobileNav";
import { Loader2, Zap } from "lucide-react";
import toast from "react-hot-toast";

export default function DiscoverPage() {
  const router = useRouter();
  const { user, currentSession, isAuthenticated } = useAppStore();
  const [status, setStatus] = useState<"idle" | "waiting" | "matched">("idle");

  useEffect(() => {
    if (!isAuthenticated) router.push("/join");
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (currentSession) {
      setStatus("matched");
      toast.success("Found a match! 🚀");
      setTimeout(() => router.push(`/chat/${currentSession.roomId}`), 600);
    } else {
      setStatus("idle");
    }
  }, [currentSession, router]);

  const joinQueue = () => {
    const socket = getSocket();
    if (!socket) return toast.error("Disconnected from server");
    
    setStatus("waiting");
    socket.emit("join_queue");
  };

  const leaveQueue = () => {
    const socket = getSocket();
    if (socket) socket.emit("leave_queue");
    setStatus("idle");
  };

  if (!user) return null;

  return (
    <main style={{ minHeight: "100vh", paddingBottom: 90, maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ padding: "1.25rem", textAlign: "center" }}>
        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
              <div style={{ width: 100, height: 100, borderRadius: "50%", background: "linear-gradient(135deg,#a855f7,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem", boxShadow: "0 0 50px rgba(168,85,247,0.4)" }}>
                <Zap size={48} color="white" />
              </div>
              <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>Ready to chat?</h1>
              <p style={{ color: "var(--text2)", marginBottom: "3rem", fontSize: "1rem" }}>
                Connect anonymously with a real person right now. No swipes. No profiles. Just chat.
              </p>
              <button onClick={joinQueue} className="btn-primary" style={{ width: "100%", padding: "1.2rem", fontSize: "1.2rem", borderRadius: 16 }}>
                Connect Now
              </button>
            </motion.div>
          )}

          {status === "waiting" && (
            <motion.div key="waiting" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
              <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto 2rem" }}>
                <div style={{ position: "absolute", inset: 0, border: "4px solid rgba(168,85,247,0.3)", borderRadius: "50%", animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite" }} />
                <div style={{ position: "absolute", inset: 10, background: "rgba(168,85,247,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Loader2 size={40} className="spin" color="#a855f7" />
                </div>
              </div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>Searching...</h2>
              <p style={{ color: "var(--text2)", marginBottom: "3rem" }}>Waiting for someone to connect.</p>
              <button onClick={leaveQueue} className="btn-ghost" style={{ padding: "0.8rem 2rem", borderRadius: 12, border: "1px solid var(--border)" }}>
                Cancel
              </button>
            </motion.div>
          )}

          {status === "matched" && (
            <motion.div key="matched" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
              <div style={{ width: 100, height: 100, borderRadius: "50%", background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem", boxShadow: "0 0 50px rgba(16,185,129,0.4)" }}>
                <Zap size={48} color="white" />
              </div>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#10b981" }}>Match Found!</h2>
              <p style={{ color: "var(--text2)", marginTop: "0.5rem" }}>Connecting you now...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <MobileNav />
    </main>
  );
}

