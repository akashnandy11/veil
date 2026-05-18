"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { getSocket } from "@/components/SocketProvider";
import { Send, Shuffle, Loader2, MessageCircle, ArrowRight, LogIn, LogOut, Smile, UserCircle, Shield } from "lucide-react";
import toast from "react-hot-toast";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const EMOJIS = ["😂","❤️","🔥","👀","😭","✨","😍","🥺","💀","🙏","😊","💯","🤣","😘","🥰","😎","🤔","😅","🫶","👏","🎉","💪","🤩","😆","🥳","😋","😢","🤗","💖","🫠"];

export default function App() {
  const { data: session } = useSession();
  const router = useRouter();
  const { status, messages, addMessage, resetChat, roomId, partnerTyping, onlineCount } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const emojiRef = useRef<HTMLDivElement>(null);

  const [guestForm, setGuestForm] = useState({ name: "", age: "", gender: "male", interests: "" });

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, partnerTyping]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const emitTyping = useCallback(() => {
    const socket = getSocket();
    if (!roomId) return;
    socket?.emit("typing", { roomId });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket?.emit("stop-typing", { roomId });
    }, 1500);
  }, [roomId]);

  const connectToStranger = () => {
    if (!guestForm.name || !guestForm.age || !guestForm.gender) {
      toast.error("Please fill in Name, Age, and Gender to connect.");
      return;
    }
    
    const guestDetails = {
      name: guestForm.name,
      age: parseInt(guestForm.age),
      gender: guestForm.gender,
      interests: guestForm.interests.split(",").map(i => i.trim()).filter(Boolean)
    };

    const socket = getSocket();
    socket?.emit("find-partner", guestDetails);
  };

  const nextStranger = () => {
    const socket = getSocket();
    socket?.emit("next");
    resetChat();
    setTimeout(connectToStranger, 150);
  };

  const sendMessage = () => {
    if (!input.trim() || status !== "matched") return;
    const socket = getSocket();
    socket?.emit("send-message", { roomId, message: input.trim() });
    socket?.emit("stop-typing", { roomId });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    addMessage({ id: Math.random().toString(), text: input.trim(), mine: true, timestamp: new Date() });
    setInput("");
    setShowEmoji(false);
  };

  const insertEmoji = (emoji: string) => {
    setInput((prev) => prev + emoji);
  };

  if (!mounted) return null;

  return (
    <main style={{ minHeight: "100vh", padding: "1.25rem", maxWidth: 640, margin: "0 auto", display: "flex", flexDirection: "column" }}>
      
      {/* Header */}
      <header style={{ padding: "0.8rem 0", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <MessageCircle size={22} color="#a855f7" />
          <h1 style={{ fontSize: "1.1rem", fontWeight: 800, fontFamily: "Space Grotesk, sans-serif" }}>DCE Anonymous</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", padding: "2px 8px", borderRadius: 999 }}>
            <span className="pulse-dot" />
            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#10b981" }}>{onlineCount} Online</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {session?.user && (session.user as any).role === "admin" ? (
            <>
              <button onClick={() => router.push("/admin")} style={{ color: "#ec4899", display: "flex", alignItems: "center", gap: 4, fontSize: "0.8rem", fontWeight: 600 }}>
                <Shield size={15} /> Admin Dashboard
              </button>
              <button onClick={() => signOut()} style={{ color: "var(--text2)", display: "flex", alignItems: "center", gap: 4, fontSize: "0.8rem", fontWeight: 600 }}>
                <LogOut size={15} /> Logout
              </button>
            </>
          ) : (
            <button onClick={() => router.push("/auth/login")} style={{ color: "var(--text3)", display: "flex", alignItems: "center", gap: 4, fontSize: "0.8rem" }}>
              <Shield size={15} /> Admin Login
            </button>
          )}
        </div>
      </header>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}>
        <AnimatePresence mode="wait">
          
          {/* SCREEN 1: IDLE */}
          {status === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ textAlign: "center", width: "100%", maxWidth: 400, margin: "0 auto" }}>
              <div style={{ fontSize: "4rem", marginBottom: "0.5rem" }}>🤫</div>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                DCE Anonymous Chat
              </h2>
              <p style={{ color: "var(--text2)", marginBottom: "1.5rem", fontSize: "0.95rem", lineHeight: 1.6 }}>
                Enter your details to instantly match with a DCE stranger of the opposite gender. No account required!
              </p>

              <div className="glass" style={{ padding: "1.5rem", borderRadius: 20, textAlign: "left", display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text2)", marginBottom: 4, display: "block" }}>Display Name</label>
                  <input value={guestForm.name} onChange={(e) => setGuestForm({ ...guestForm, name: e.target.value })} className="input-glass" placeholder="Your anonymous alias" style={{ width: "100%" }} />
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text2)", marginBottom: 4, display: "block" }}>Age</label>
                    <input type="number" value={guestForm.age} onChange={(e) => setGuestForm({ ...guestForm, age: e.target.value })} className="input-glass" placeholder="18" style={{ width: "100%" }} min="13" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text2)", marginBottom: 4, display: "block" }}>Gender</label>
                    <select value={guestForm.gender} onChange={(e) => setGuestForm({ ...guestForm, gender: e.target.value })} className="input-glass" style={{ width: "100%" }}>
                      <option value="male" style={{ background: "#0a0a12", color: "white" }}>Male</option>
                      <option value="female" style={{ background: "#0a0a12", color: "white" }}>Female</option>
                      <option value="other" style={{ background: "#0a0a12", color: "white" }}>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text2)", marginBottom: 4, display: "block" }}>Interests (optional)</label>
                  <input value={guestForm.interests} onChange={(e) => setGuestForm({ ...guestForm, interests: e.target.value })} className="input-glass" placeholder="Anime, Coding, Music..." style={{ width: "100%" }} />
                </div>
                
                <button onClick={connectToStranger} className="btn-primary"
                  style={{ width: "100%", padding: "1rem", marginTop: 8, fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 12 }}>
                  Start Chatting <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* SCREEN 2: WAITING */}
          {status === "waiting" && (
            <motion.div key="waiting" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ textAlign: "center" }}>
              <Loader2 size={40} className="spin" color="#a855f7" style={{ margin: "0 auto 2rem" }} />
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>Searching...</h2>
              <p style={{ color: "var(--text3)" }}>Finding a DCE student of the opposite gender...</p>
            </motion.div>
          )}

          {/* SCREEN 3: CHAT */}
          {status === "matched" && (
            <motion.div key="matched" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
              
              {/* Chat Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.6rem 0 1rem", borderBottom: "1px solid var(--border)", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.82rem", color: "#10b981", fontWeight: 600, background: "rgba(16,185,129,0.1)", padding: "4px 12px", borderRadius: 999 }}>
                  🟢 Connected to a {guestForm.gender === "male" ? "female" : "male"} stranger
                </span>
                <button onClick={nextStranger} className="glass" style={{ padding: "5px 14px", borderRadius: 10, display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: "var(--text2)" }}>
                  <Shuffle size={14} /> Next
                </button>
              </div>

              {/* Chat Log */}
              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, paddingBottom: 12, paddingRight: 4 }}>
                {messages.length === 0 && (
                  <p style={{ textAlign: "center", color: "var(--text3)", fontSize: "0.85rem", marginTop: "auto", marginBottom: "auto" }}>
                    Say hi! 👋
                  </p>
                )}
                {messages.map((msg) => (
                  <div key={msg.id} style={{ display: "flex", justifyContent: msg.mine ? "flex-end" : "flex-start" }}>
                    <div className={msg.mine ? "bubble-sent" : "bubble-recv"} style={{ maxWidth: "75%" }}>
                      {msg.text}
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                <AnimatePresence>
                  {partnerTyping && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                      style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div className="bubble-recv" style={{ display: "flex", gap: 4, alignItems: "center", padding: "10px 16px" }}>
                        {[0, 1, 2].map((i) => (
                          <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                            style={{ width: 6, height: 6, borderRadius: "50%", background: "#a855f7" }} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={bottomRef} />
              </div>

              {/* Emoji Picker */}
              <AnimatePresence>
                {showEmoji && (
                  <motion.div ref={emojiRef} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="glass" style={{ padding: "0.75rem", borderRadius: 16, marginBottom: 8, display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {EMOJIS.map((emoji) => (
                      <button key={emoji} onClick={() => insertEmoji(emoji)} style={{ fontSize: "1.4rem", lineHeight: 1, padding: "2px" }}>
                        {emoji}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input Area */}
              <div style={{ display: "flex", gap: 8, paddingTop: 6 }}>
                <button onClick={() => setShowEmoji((p) => !p)} className="btn-ghost" style={{ padding: "0 0.75rem", borderRadius: 12, color: showEmoji ? "#a855f7" : "var(--text2)" }}>
                  <Smile size={20} />
                </button>
                <input
                  value={input}
                  onChange={(e) => { setInput(e.target.value); emitTyping(); }}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  className="input-glass"
                  style={{ flex: 1 }}
                />
                <button onClick={sendMessage} className="btn-primary" style={{ padding: "0 1rem", borderRadius: 12 }}>
                  <Send size={18} />
                </button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  );
}
