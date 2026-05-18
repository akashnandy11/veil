import { create } from "zustand";

export interface Message {
  id: string;
  text: string;
  mine: boolean;
  timestamp: Date;
}

interface AppState {
  status: "idle" | "waiting" | "matched";
  roomId: string | null;
  messages: Message[];
  partnerTyping: boolean;
  onlineCount: number;
  
  setStatus: (status: "idle" | "waiting" | "matched") => void;
  setRoomId: (id: string | null) => void;
  setPartnerTyping: (val: boolean) => void;
  setOnlineCount: (count: number) => void;
  addMessage: (msg: Message) => void;
  clearMessages: () => void;
  resetChat: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  status: "idle",
  roomId: null,
  messages: [],
  partnerTyping: false,
  onlineCount: 0,

  setStatus: (status) => set({ status }),
  setRoomId: (roomId) => set({ roomId }),
  setPartnerTyping: (val) => set({ partnerTyping: val }),
  setOnlineCount: (count) => set({ onlineCount: count }),
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  clearMessages: () => set({ messages: [] }),
  resetChat: () => set({ status: "idle", roomId: null, messages: [], partnerTyping: false })
}));
