"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { getSocket } from "@/components/SocketProvider";
import { Send, Shuffle, Loader2, MessageCircle, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function App() {
  const { status, messages, addMessage, resetChat, roomId, myGender, setMyGender } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === "matched") {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, status]);

  const connectToStranger = () => {
    if (!myGender) {
      toast.error("Please select your gender first!");
      return;
    }

    const socket = getSocket();
    socket?.emit("find-partner", { gender: myGender });
  };

  const nextStranger = () => {
    const socket = getSocket();
    socket?.emit("next");
    resetChat();
    setTimeout(connectToStranger, 100);
  };

  const sendMessage = () => {
    if (!input.trim() || status !== "matched") return;

    const socket = getSocket();
    socket?.emit("send-message", { roomId, message: input.trim() });

    addMessage({
      id: Math.random().toString(),
      text: input.trim(),
      mine: true,
      timestamp: new Date()
    });

    setInput("");
  };

  if (!mounted) return null;

  return (
    <main style={{ minHeight: "100vh", padding: "1.25rem", maxWidth: 600, margin: "0 auto", display: "flex", flexDirection: "column" }}>
      
      {/* Header */}
      <header style={{ padding: "1rem 0", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid var(--border)", marginBottom: "1rem" }}>
        <MessageCircle size={24} color="#a855f7" />
        <h1 style={{ fontSize: "1.2rem", fontWeight: 800, fontFamily: "Space Grotesk, sans-serif" }}>Anonymous Relay</h1>
      </header>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}>
        <AnimatePresence mode="wait">
          
          {/* SCREEN 1: IDLE */}
          {status === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              style={{ textAlign: "center" }}>
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🤫</div>
              <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1rem" }}>Instant Chat</h2>
              <p style={{ color: "var(--text2)", marginBottom: "2rem", fontSize: "1rem", lineHeight: 1.6 }}>
                Talk to strangers anonymously. Select your gender below to be paired with the opposite gender.
              </p>
              
              <div style={{ display: "flex", gap: 10, marginBottom: "2rem", justifyContent: "center" }}>
                <button onClick={() => setMyGender("male")} className="glass"
                  style={{ flex: 1, padding: "1rem", borderRadius: 16, border: myGender === "male" ? "2px solid #60a5fa" : "2px solid transparent", background: myGender === "male" ? "rgba(59, 130, 246, 0.15)" : "var(--glass)" }}>
                  <div style={{ fontSize: "2rem", marginBottom: 8 }}>👨</div>
                  <div style={{ fontWeight: 600, color: myGender === "male" ? "#60a5fa" : "inherit" }}>I am Male</div>
                </button>
                <button onClick={() => setMyGender("female")} className="glass"
                  style={{ flex: 1, padding: "1rem", borderRadius: 16, border: myGender === "female" ? "2px solid #f472b6" : "2px solid transparent", background: myGender === "female" ? "rgba(236, 72, 153, 0.15)" : "var(--glass)" }}>
                  <div style={{ fontSize: "2rem", marginBottom: 8 }}>👩</div>
                  <div style={{ fontWeight: 600, color: myGender === "female" ? "#f472b6" : "inherit" }}>I am Female</div>
                </button>
              </div>
              
              <button onClick={connectToStranger} className="btn-primary" 
                style={{ width: "100%", padding: "1.2rem", fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, borderRadius: 16 }}>
                Connect Now <ArrowRight size={20} />
              </button>
            </motion.div>
          )}

          {/* SCREEN 2: WAITING */}
          {status === "waiting" && (
            <motion.div key="waiting" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ textAlign: "center" }}>
              <Loader2 size={40} className="spin" color="#a855f7" style={{ margin: "0 auto 2rem" }} />
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>Searching...</h2>
              <p style={{ color: "var(--text3)" }}>Looking for a stranger of the opposite gender.</p>
            </motion.div>
          )}

          {/* SCREEN 3: MATCHED / CHATTING */}
          {status === "matched" && (
            <motion.div key="matched" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
              
              <div style={{ textAlign: "center", padding: "0.5rem 0 1.5rem", borderBottom: "1px solid var(--border)", marginBottom: "1rem" }}>
                <span style={{ fontSize: "0.85rem", color: "#10b981", fontWeight: 600, background: "rgba(16,185,129,0.1)", padding: "4px 12px", borderRadius: 999 }}>
                  Connected to a {myGender === "male" ? "female" : "male"} stranger
                </span>
              </div>

              {/* Chat Log */}
              <div style={{ flex: 1, overflowY: "auto", paddingRight: 10, display: "flex", flexDirection: "column", gap: 10, paddingBottom: 20 }}>
                {messages.length === 0 && (
                  <p style={{ textAlign: "center", color: "var(--text3)", fontSize: "0.85rem", marginTop: "auto", marginBottom: "auto" }}>
                    Say hi to the stranger! 👋
                  </p>
                )}
                {messages.map((msg) => (
                  <div key={msg.id} style={{ display: "flex", justifyContent: msg.mine ? "flex-end" : "flex-start" }}>
                    <div className={msg.mine ? "bubble-sent" : "bubble-recv"}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Input Area */}
              <div style={{ display: "flex", gap: 8, paddingTop: 10 }}>
                <button onClick={nextStranger} className="btn-ghost" style={{ padding: "0 1rem", borderRadius: 12 }}>
                  <Shuffle size={20} />
                </button>
                <input 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
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
