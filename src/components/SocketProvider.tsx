"use client";
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useAppStore } from "@/lib/store";

let socket: Socket | null = null;

export const getSocket = () => socket;

export default function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, setOnlineUsers, addMessage } = useAppStore();

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

      socket.on("users_update", (users) => {
        // Filter out self
        const others = users.filter((u: any) => u.id !== user.id);
        setOnlineUsers(others);
      });

      socket.on("receive_message", (msg) => {
        // Find who sent it to organize the chat
        const chatId = msg.senderId === user.id ? msg.toId : msg.senderId;
        addMessage(chatId, msg);
      });

      return () => {
        socket?.disconnect();
        socket = null;
      };
    }
  }, [isAuthenticated, user, setOnlineUsers, addMessage]);

  return <>{children}</>;
}
