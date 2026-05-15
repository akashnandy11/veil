"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { ArrowLeft, MessageCircle } from "lucide-react";
import MobileNav from "@/components/MobileNav";

export default function ChatInboxPage() {
  const router = useRouter();
  const { user, isAuthenticated, onlineUsers, messages } = useAppStore();

  useEffect(() => {
    if (!isAuthenticated) router.push("/");
  }, [isAuthenticated, router]);

  // Find users we have a chat history with
  const chatUserIds = Object.keys(messages);
  const recentChats = chatUserIds.map(id => {
    const chatUser = onlineUsers.find(u => u.id === id);
    const msgs = messages[id];
    const lastMsg = msgs[msgs.length - 1];
    return {
      partnerId: id,
      user: chatUser,
      lastMsg
    };
  }).sort((a, b) => new Date(b.lastMsg.timestamp).getTime() - new Date(a.lastMsg.timestamp).getTime());

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
        {recentChats.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", opacity: 0.7 }}>
            <MessageCircle size={40} style={{ margin: "0 auto 1rem", color: "var(--text3)" }} />
            <p>No active chats yet. Go connect with a random person!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {recentChats.map(chat => {
              const partnerName = chat.user ? chat.user.username : "Offline User";
              const partnerGender = chat.user?.gender;
              
              const isMale = partnerGender === 'male';
              const partnerEmoji = isMale ? '👨' : '👩';
              const partnerColor = isMale ? '#60a5fa' : '#f472b6';
              const bgStr = isMale ? 'rgba(59, 130, 246, 0.2)' : 'rgba(236, 72, 153, 0.2)';
              const borderStr = isMale ? 'rgba(59, 130, 246, 0.4)' : 'rgba(236, 72, 153, 0.4)';
              
              return (
                <div key={chat.partnerId} onClick={() => chat.user ? router.push(`/chat/${chat.partnerId}`) : null}
                  className="glass card-hover" style={{ padding: "1rem", borderRadius: 16, display: "flex", alignItems: "center", gap: 12, cursor: chat.user ? "pointer" : "default", opacity: chat.user ? 1 : 0.6 }}>
                  
                  <div style={{ width: 48, height: 48, borderRadius: 14, fontSize: "1.6rem", display: "flex", alignItems: "center", justifyContent: "center", background: bgStr, border: `1.5px solid ${borderStr}` }}>
                    {partnerEmoji}
                  </div>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: "0.95rem", color: partnerColor, marginBottom: 2 }}>{partnerName}</p>
                    <p style={{ fontSize: "0.8rem", color: "var(--text2)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {chat.lastMsg.senderId === user?.id ? "You: " : ""}{chat.lastMsg.content}
                    </p>
                  </div>
                  {!chat.user && <span style={{ fontSize: "0.65rem", background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: 4 }}>Offline</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <MobileNav />
    </main>
  );
}
