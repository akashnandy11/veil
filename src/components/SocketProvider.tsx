"use client";
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useAppStore } from "@/lib/store";

let socket: Socket | null = null;

export const getSocket = () => socket;

export default function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, setOnlineCount, addMessage, setCurrentSession } = useAppStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (!socket) {
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3031";
        socket = io(socketUrl, {
          extraHeaders: {
            "Bypass-Tunnel-Reminder": "true"
          }
        });
      }

      socket.on("connect", () => {
        console.log("Connected to Socket.IO Server", socket?.id);
        socket?.emit("register", user);
      });

      socket.on("users_update", (count) => {
        setOnlineCount(count);
      });

      socket.on("chat_started", ({ partner, roomId }) => {
        setCurrentSession({ partner, roomId });
      });

      socket.on("partner_disconnected", () => {
        setCurrentSession(null);
      });

      socket.on("receive_message", (msg) => {
        // Chat room doesn't use the array of objects anymore, but for now just use activeChat or 'current'
        addMessage('current', msg);
      });

      return () => {
        socket?.disconnect();
        socket = null;
      };
    }
  }, [isAuthenticated, user, setOnlineCount, addMessage, setCurrentSession]);

  return <>{children}</>;
}
