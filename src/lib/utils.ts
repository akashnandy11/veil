import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ANONYMOUS_NAMES = [
  "GhostPanda", "NeonWolf", "CrypticFox", "ShadowByte", "MysticCrow",
  "VoidRaven", "StealthCat", "NightOwl", "PhantomEel", "LunarTiger",
  "CosmicBat", "DarkMatter", "QuantumGhost", "NebulaDrake", "SilentLynx",
  "VelvetShark", "AstralCoyote", "CipherBear", "EclipseHawk", "IronMoth",
  "GlitchFawn", "StarlitViper", "PixelDragon", "NullPointer", "VoidWalker",
  "SilverWraith", "CryptoKnight", "NeonSpectre", "BinaryGhost", "DataPhantom",
];

export const AVATAR_EMOJIS = [
  "👻", "🐺", "🦊", "🐱", "🦅", "🐉", "🦁", "🐯", "🦋", "🐸",
  "🦝", "🐻", "🦜", "🐧", "🦊", "🐼", "🦑", "🐙", "🦈", "🦄",
  "🐲", "🦩", "🦭", "🦘", "🐨", "🦎", "🐬", "🦋", "🐞", "🦀",
];

export const NEON_COLORS = [
  "#a855f7", "#ec4899", "#06b6d4", "#10b981", "#f59e0b",
  "#ef4444", "#8b5cf6", "#3b82f6", "#14b8a6", "#f97316",
];

export function generateAnonymousIdentity() {
  const name = ANONYMOUS_NAMES[Math.floor(Math.random() * ANONYMOUS_NAMES.length)];
  const num = Math.floor(Math.random() * 9999);
  const emoji = AVATAR_EMOJIS[Math.floor(Math.random() * AVATAR_EMOJIS.length)];
  const color = NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];
  return { username: `${name}#${num}`, emoji, color };
}

export function timeAgo(date: Date | string | number): string {
  const d = new Date(date);
  const seconds = Math.floor((new Date().getTime() - d.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export const INTERESTS = [
  "Gaming", "Music", "Movies", "Coding", "Art", "Photography", "Sports",
  "Fitness", "Travel", "Food", "Anime", "Books", "Fashion", "Dance",
  "Memes", "Tech", "Startup", "Poetry", "Debate", "Science",
];

export const MOODS = [
  { label: "Chill 😌", value: "chill", color: "#06b6d4" },
  { label: "Flirty 😏", value: "flirty", color: "#ec4899" },
  { label: "Intellectual 🧠", value: "intellectual", color: "#8b5cf6" },
  { label: "Adventurous ⚡", value: "adventurous", color: "#f59e0b" },
  { label: "Lonely 🌙", value: "lonely", color: "#6366f1" },
  { label: "Excited 🔥", value: "excited", color: "#ef4444" },
];

export const CONFESSION_CATEGORIES = [
  "Love & Crush 💘", "Campus Life 🏫", "Academic Pressure 📚",
  "Friendship 🤝", "Secrets 🤫", "Funny 😂", "Advice Needed 🙏", "Random 🎲",
];

export const AI_STARTERS = [
  "If you could teleport anywhere on campus right now, where would it be? 🏛️",
  "What's the most chaotic thing that happened in your lab this semester? 😅",
  "Hot take: which college canteen item slaps the hardest? 🍜",
  "Rate your Monday motivation from 1-10. I'll go first: 2. 😐",
  "What subject would you delete from existence if you could? 💀",
  "Describe your study style using only a movie title.",
  "If your life was a meme right now, which one would it be? 😂",
  "What's your 3am thought that you'd never say in class?",
];
