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
  myGender: "male" | "female" | null;
  messages: Message[];
  
  setStatus: (status: "idle" | "waiting" | "matched") => void;
  setRoomId: (id: string | null) => void;
  setMyGender: (gender: "male" | "female") => void;
  addMessage: (msg: Message) => void;
  clearMessages: () => void;
  resetChat: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  status: "idle",
  roomId: null,
  myGender: null,
  messages: [],

  setStatus: (status) => set({ status }),
  setRoomId: (roomId) => set({ roomId }),
  setMyGender: (gender) => set({ myGender: gender }),
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  clearMessages: () => set({ messages: [] }),
  resetChat: () => set({ status: "idle", roomId: null, messages: [] })
}));
