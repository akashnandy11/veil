import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateAnonymousIdentity } from "./utils";

export interface User {
  id: string;
  username: string;
  emoji: string;
  color: string;
  isAnonymous: boolean;
  realName?: string;
  avatarUrl?: string;
  email?: string;
  phone?: string;
  age?: number;
  isAdult: boolean;
  interests: string[];
  mood: string;
  isOnline: boolean;
  joinedAt: Date;
  deviceId?: string;
  socketId?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderEmoji: string;
  content: string;
  timestamp: Date;
  selfDestruct?: number; // minutes
  isDeleted?: boolean;
  type: "text" | "image" | "system";
}

export interface ChatRoom {
  id: string;
  name: string;
  emoji: string;
  description: string;
  members: number;
  category: string;
  isPrivate: boolean;
}

export interface Confession {
  id: string;
  content: string;
  category: string;
  authorEmoji: string;
  authorColor: string;
  likes: number;
  liked: boolean;
  comments: number;
  timestamp: Date;
  isAnonymous: boolean;
}

export interface Match {
  id: string;
  username: string;
  emoji?: string;
  avatarUrl?: string;
  color: string;
  interests: string[];
  mood: string;
  bio: string;
  isOnline: boolean;
  distance: string;
  matchScore: number;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  activeChat: string | null;
  messages: Record<string, Message[]>;
  confessions: Confession[];
  matches: Match[];
  onlineUsers: User[];
  rooms: ChatRoom[];
  notifications: number;
  theme: "dark";
  adultMode: boolean;

  // Actions
  setUser: (user: User) => void;
  logout: () => void;
  setActiveChat: (id: string | null) => void;
  addMessage: (chatId: string, msg: Message) => void;
  toggleAdultMode: () => void;
  likeConfession: (id: string) => void;
  addConfession: (c: Confession) => void;
  setMatches: (m: Match[]) => void;
  setOnlineUsers: (users: User[]) => void;
  incrementNotifications: () => void;
  clearNotifications: () => void;
}

const generateMockConfessions = (): Confession[] =>
  [
    { content: "I have a crush on someone in my CSE batch but I'm too scared to talk to them 😭", category: "Love & Crush 💘" },
    { content: "I haven't attended a single class this week and somehow my attendance is still 75% 💀", category: "Academic Pressure 📚" },
    { content: "The WiFi in the library is genuinely faster than my career prospects rn", category: "Funny 😂" },
    { content: "I cried in the washroom after my viva. The professor asked me what my own project does 💀", category: "Campus Life 🏫" },
    { content: "I ghosted my project partner and now we present together next week. Help.", category: "Secrets 🤫" },
    { content: "Honestly? The canteen chai is the only thing keeping me alive during exams ☕", category: "Random 🎲" },
    { content: "I study 20 minutes before the exam and still pass. My friends study for days and fail. I feel guilty.", category: "Secrets 🤫" },
    { content: "Asked someone to be my lab partner as an excuse to talk to them. We've been dating for 3 months 🥰", category: "Love & Crush 💘" },
  ].map((c, i) => ({
    id: `conf-${i}`,
    content: c.content,
    category: c.category,
    authorEmoji: ["👻", "🦊", "🐺", "🦋", "🐉", "🦁", "🐯", "🦝"][i],
    authorColor: ["#a855f7", "#ec4899", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#3b82f6"][i],
    likes: Math.floor(Math.random() * 200) + 10,
    liked: false,
    comments: Math.floor(Math.random() * 50),
    timestamp: new Date(Date.now() - Math.random() * 86400000 * 3),
    isAnonymous: true,
  }));

const generateMockRooms = (): ChatRoom[] => [
  { id: "r1", name: "DCE General", emoji: "🏫", description: "General campus talk", members: 342, category: "Campus", isPrivate: false },
  { id: "r2", name: "Late Night Study", emoji: "🌙", description: "3am warriors only", members: 89, category: "Study", isPrivate: false },
  { id: "r3", name: "Crush Corner", emoji: "💘", description: "Anonymous confessions of love", members: 201, category: "Social", isPrivate: false },
  { id: "r4", name: "Meme Factory", emoji: "😂", description: "Campus memes & roasts", members: 567, category: "Fun", isPrivate: false },
  { id: "r5", name: "Hackathon Crew", emoji: "⚡", description: "Find your hackathon team", members: 134, category: "Tech", isPrivate: false },
  { id: "r6", name: "DCE Music Vibes", emoji: "🎵", description: "Share what you're listening to", members: 278, category: "Music", isPrivate: false },
  { id: "r7", name: "18+ Lounge 🔞", emoji: "🔥", description: "Adults only — flirty & bold", members: 156, category: "Adult", isPrivate: true },
  { id: "r8", name: "Mental Health Zone", emoji: "💙", description: "Safe space, no judgment", members: 93, category: "Support", isPrivate: false },
];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      activeChat: null,
      messages: {},
      confessions: generateMockConfessions(),
      matches: [],
      onlineUsers: [],
      rooms: generateMockRooms(),
      notifications: 3,
      theme: "dark",
      adultMode: false,

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
      toggleAdultMode: () => set((s) => ({ adultMode: !s.adultMode })),
      likeConfession: (id) =>
        set((s) => ({
          confessions: s.confessions.map((c) =>
            c.id === id ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 } : c
          ),
        })),
      addConfession: (c) => set((s) => ({ confessions: [c, ...s.confessions] })),
      setMatches: (matches) => set({ matches }),
      setOnlineUsers: (onlineUsers) => set({ onlineUsers }),
      incrementNotifications: () => set((s) => ({ notifications: s.notifications + 1 })),
      clearNotifications: () => set({ notifications: 0 }),
    }),
    { name: "veil-store", partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated, adultMode: s.adultMode }) }
  )
);
