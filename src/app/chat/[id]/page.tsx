"use client";
import { useState, useRef, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { AI_STARTERS, timeAgo } from "@/lib/utils";
import { Message } from "@/lib/store";
import {
  ArrowLeft, Send, Smile, Timer, Trash2, Zap, MoreVertical,
  Shield, Flag, Phone, Video, Info, Lock
} from "lucide-react";
import toast from "react-hot-toast";
import { getSocket } from "@/components/SocketProvider";

const EMOJI_LIST = ["😂", "❤️", "🔥", "😭", "💀", "✨", "😍", "🥺", "😅", "🤡", "👻", "💘", "🎉", "😏", "🫠", "🙈"];
const DESTRUCT_OPTIONS = [{ label: "Off", value: 0 }, { label: "1 min", value: 1 }, { label: "5 min", value: 5 }, { label: "1 hr", value: 60 }, { label: "24 hr", value: 1440 }];

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: partnerId } = use(params);
  const { user, isAuthenticated, currentSession, messages: allMessages, addMessage } = useAppStore();
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const partner = currentSession?.partner;
  const chatMessages = allMessages['current'] || [];

  useEffect(() => {
    if (!isAuthenticated) router.push("/");
    if (!partner && currentSession === null) {
      toast.error("User disconnected.");
      router.push("/discover");
    }
  }, [isAuthenticated, partner, currentSession, router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const sendMessage = () => {
    if (!input.trim() || !user || !partner) return;
    
    const socket = getSocket();
    if (!socket) {
      toast.error("Not connected to server");
      return;
    }

    const msg: Message = {
      id: `m_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      senderId: user.id,
      senderName: user.username,
      content: input.trim(),
      timestamp: new Date(),
      type: "text",
    };

    // Add locally
    addMessage('current', msg);

    // Send via socket
    socket.emit("send_message", {
      roomId: currentSession.roomId,
      message: msg
    });

    setInput("");
    setShowEmoji(false);


  };

  if (!partner) return <div style={{ padding: "2rem", textAlign: "center", color: "white" }}>Loading partner...</div>;

  const partnerName = partner.username;
  
  return (
    <main style={{ height: "100dvh", display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto" }}>
      {/* Header */}
      <div className="glass" style={{ padding: "0.8rem 1rem", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
        <button onClick={() => {
          const socket = getSocket();
          socket?.emit("leave_chat");
          router.push("/discover");
        }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text2)", display: "flex" }}>
          <ArrowLeft size={20} />
        </button>
        
        <div style={{
          width: 40, height: 40, borderRadius: 12, fontSize: "1.4rem",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: partner.gender === 'male' ? "rgba(59, 130, 246, 0.2)" : "rgba(236, 72, 153, 0.2)",
          border: partner.gender === 'male' ? "1.5px solid rgba(59, 130, 246, 0.4)" : "1.5px solid rgba(236, 72, 153, 0.4)",
        }}>{partner.gender === 'male' ? '👨' : '👩'}</div>

        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 700, fontSize: "0.9rem", color: partner.gender === 'male' ? '#60a5fa' : '#f472b6' }}>{partnerName}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span className="pulse-dot" />
            <span style={{ fontSize: "0.68rem", color: "var(--text3)" }}>Online</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => toast.success("🎙️ Voice coming soon!")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)" }}>
            <Phone size={18} />
          </button>
          <button onClick={() => setShowInfo(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)" }}>
            <Info size={18} />
          </button>
        </div>
      </div>

      {/* Info panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden", flexShrink: 0 }}>
            <div className="glass" style={{ padding: "0.8rem 1rem", borderBottom: "1px solid var(--border)", display: "flex", gap: 8 }}>
              <button onClick={() => toast.success("Reported anonymously")} className="btn-ghost"
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: "0.78rem", padding: "0.5rem", color: "#ef4444", borderColor: "rgba(239,68,68,0.3)" }}>
                <Flag size={14} /> Report
              </button>
              <button onClick={() => { toast.success("User blocked"); router.push("/discover"); }} className="btn-ghost"
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: "0.78rem", padding: "0.5rem" }}>
                <Shield size={14} /> Block
              </button>
              <button onClick={() => { 
                  const socket = getSocket();
                  socket?.emit("leave_chat");
                  router.push("/discover"); 
                }} className="btn-ghost"
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: "0.78rem", padding: "0.5rem" }}>
                <Trash2 size={14} /> End Chat
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Encrypted notice */}
      <div style={{ textAlign: "center", padding: "0.5rem", flexShrink: 0 }}>
        <span style={{ fontSize: "0.65rem", color: "var(--text3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
          <Lock size={10} /> End-to-end encrypted · Authentic Connection
        </span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 1rem 1rem" }}>
        {chatMessages.map((msg, i) => {
          const isMe = msg.senderId === user?.id;
          return (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", marginBottom: 8, alignItems: "flex-end", gap: 8 }}>
              {!isMe && (
                <div style={{ width: 28, height: 28, borderRadius: 8, fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", background: partner.gender === 'male' ? "rgba(59, 130, 246, 0.2)" : "rgba(236, 72, 153, 0.2)", border: partner.gender === 'male' ? "1px solid rgba(59, 130, 246, 0.4)" : "1px solid rgba(236, 72, 153, 0.4)", flexShrink: 0 }}>
                  {partner.gender === 'male' ? '👨' : '👩'}
                </div>
              )}
              <div>
                <div className={isMe ? "bubble-sent" : "bubble-recv"}
                  style={{ opacity: msg.isDeleted ? 0.5 : 1, fontStyle: msg.isDeleted ? "italic" : "normal", fontSize: "0.9rem" }}>
                  {msg.content}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3, justifyContent: isMe ? "flex-end" : "flex-start" }}>
                  <span style={{ fontSize: "0.62rem", color: "var(--text3)" }}>{timeAgo(msg.timestamp)}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Emoji picker */}
      <AnimatePresence>
        {showEmoji && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden", flexShrink: 0 }}>
            <div className="glass" style={{ padding: "0.75rem 1rem", borderTop: "1px solid var(--border)" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {EMOJI_LIST.map(e => (
                  <button key={e} onClick={() => setInput(p => p + e)}
                    style={{ fontSize: "1.4rem", background: "none", border: "none", cursor: "pointer", padding: "2px", borderRadius: 6, transition: "transform 0.15s" }}
                    onMouseEnter={el => (el.currentTarget.style.transform = "scale(1.3)")}
                    onMouseLeave={el => (el.currentTarget.style.transform = "scale(1)")}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input bar */}
      <div className="glass" style={{ padding: "0.75rem 1rem", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <button onClick={() => { setShowEmoji(v => !v); }}
          style={{ background: "none", border: "none", cursor: "pointer", color: showEmoji ? "#a855f7" : "var(--text3)", transition: "color 0.2s" }}>
          <Smile size={22} />
        </button>
        <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Type a real message..."
          className="input-glass"
          style={{ flex: 1, padding: "0.6rem 0.9rem" }}
        />
        <motion.button onClick={sendMessage} whileTap={{ scale: 0.9 }}
          style={{
            width: 40, height: 40, borderRadius: 12, border: "none", cursor: "pointer",
            background: input.trim() ? "linear-gradient(135deg,#a855f7,#ec4899)" : "rgba(255,255,255,0.06)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: input.trim() ? "0 0 20px rgba(168,85,247,0.4)" : "none",
            transition: "all 0.3s", flexShrink: 0,
          }}>
          <Send size={18} color={input.trim() ? "white" : "var(--text3)"} />
        </motion.button>
      </div>
    </main>
  );
}
