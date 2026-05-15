import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  username: string; // the real name
  gender: "male" | "female";
  isOnline: boolean;
  joinedAt: Date;
  socketId?: string;
}

export interface ChatSession {
  roomId: string;
  partner: User;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  selfDestruct?: number; // minutes
  isDeleted?: boolean;
  type: "text" | "image" | "system";
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  activeChat: string | null;
  messages: Record<string, Message[]>;
  onlineCount: number;
  currentSession: ChatSession | null;
  theme: "dark";

  // Actions
  setUser: (user: User) => void;
  logout: () => void;
  setActiveChat: (id: string | null) => void;
  addMessage: (chatId: string, msg: Message) => void;
  setOnlineCount: (count: number) => void;
  setCurrentSession: (session: ChatSession | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      activeChat: null,
      messages: {},
      onlineCount: 0,
      currentSession: null,
      theme: "dark",

      setUser: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false, activeChat: null }),
      setActiveChat: (id) => set({ activeChat: id }),
      addMessage: (chatId, msg) =>
        set((s) => ({
          messages: {
            ...s.messages,
            [chatId]: [...(s.messages[chatId] || []), msg],
          },
        })),
      setOnlineCount: (onlineCount) => set({ onlineCount }),
      setCurrentSession: (currentSession) => set({ currentSession }),
    }),
    { name: "veil-store-real", partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }) }
  )
);
