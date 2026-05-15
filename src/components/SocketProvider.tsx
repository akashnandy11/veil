"use client";
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useAppStore } from "@/lib/store";
import toast from "react-hot-toast";

let socket: Socket | null = null;

export const getSocket = () => socket;

export default function SocketProvider({ children }: { children: React.ReactNode }) {
  const { setStatus, setRoomId, addMessage, clearMessages, resetChat } = useAppStore();

  useEffect(() => {
    if (!socket) {
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
      socket = io(socketUrl, {
        extraHeaders: {
          "Bypass-Tunnel-Reminder": "true"
        }
      });
    }

    socket.on("connect", () => {
      console.log("Connected to Socket.IO Server", socket?.id);
    });

    socket.on("waiting", () => {
      setStatus("waiting");
    });

    socket.on("matched", ({ roomId }) => {
      setRoomId(roomId);
      setStatus("matched");
      clearMessages();
    });

    socket.on("receive-message", (data) => {
      addMessage({
        id: Math.random().toString(),
        text: data.message,
        mine: false,
        timestamp: new Date()
      });
    });

    socket.on("disconnected-stranger", () => {
      toast.error("Stranger disconnected.");
      resetChat();
    });

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [setStatus, setRoomId, addMessage, clearMessages, resetChat]);

  return <>{children}</>;
}
