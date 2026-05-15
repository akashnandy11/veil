"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store";
import {
  Home, Zap, MessageCircle, User
} from "lucide-react";

const NAV = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/discover", icon: Zap, label: "Discover" },
  { href: "/chat", icon: MessageCircle, label: "Chat" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="mobile-nav">
      {NAV.map(({ href, icon: Icon, label }) => {
        const active = pathname === href;
        return (
          <Link key={href} href={href} className={`nav-item${active ? " active" : ""}`}>
            <div style={{ position: "relative" }}>
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
            </div>
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
