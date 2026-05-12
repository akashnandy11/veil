"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store";
import {
  Home, Zap, MessageCircle, Users, User, Shield, Bell
} from "lucide-react";

const NAV = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/discover", icon: Zap, label: "Discover" },
  { href: "/chat", icon: MessageCircle, label: "Chat" },
  { href: "/community", icon: Users, label: "Community" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { notifications, clearNotifications, user } = useAppStore();

  return (
    <nav className="mobile-nav">
      {NAV.map(({ href, icon: Icon, label }) => {
        const active = pathname === href;
        const showBadge = label === "Chat" && notifications > 0;
        return (
          <Link key={href} href={href} className={`nav-item${active ? " active" : ""}`}
            onClick={() => label === "Chat" && clearNotifications()}>
            <div style={{ position: "relative" }}>
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              {showBadge && (
                <span style={{
                  position: "absolute", top: -6, right: -6,
                  background: "linear-gradient(135deg,#a855f7,#ec4899)",
                  color: "white", fontSize: "0.6rem", fontWeight: 700,
                  borderRadius: "999px", padding: "1px 5px", minWidth: 16,
                  textAlign: "center", lineHeight: "16px",
                }}>{notifications}</span>
              )}
            </div>
            <span>{label}</span>
          </Link>
        );
      })}
      {user?.isAnonymous === false && (
        <Link href="/admin" className={`nav-item${pathname === "/admin" ? " active" : ""}`}>
          <Shield size={20} strokeWidth={1.8} />
          <span>Admin</span>
        </Link>
      )}
    </nav>
  );
}
