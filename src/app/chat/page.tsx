"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { ArrowLeft, MessageCircle } from "lucide-react";
import MobileNav from "@/components/MobileNav";

export default function ChatInboxPage() {
  const router = useRouter();
  const { isAuthenticated, currentSession } = useAppStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    } else if (currentSession) {
      router.push(`/chat/${currentSession.roomId}`);
    }
  }, [isAuthenticated, currentSession, router]);

  return (
    <main style={{ minHeight: "100vh", paddingBottom: 80, maxWidth: 480, margin: "0 auto" }}>
      <div style={{ padding: "2rem 1.25rem 1rem", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => router.push("/discover")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text2)", display: "flex" }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "Space Grotesk, sans-serif" }} className="grad-text">Chats</h1>
          <p style={{ fontSize: "0.75rem", color: "var(--text3)" }}>Your active connections</p>
        </div>
      </div>

      <div style={{ padding: "0 1.25rem" }}>
        <div style={{ textAlign: "center", padding: "4rem 2rem", opacity: 0.7 }}>
          <MessageCircle size={40} style={{ margin: "0 auto 1rem", color: "var(--text3)" }} />
          <p>No active chat session. Go connect with a random person!</p>
          <button onClick={() => router.push("/discover")} className="btn-primary" style={{ marginTop: "1.5rem", padding: "0.8rem 1.5rem" }}>
            Find a Match
          </button>
        </div>
      </div>

      <MobileNav />
    </main>
  );
}
