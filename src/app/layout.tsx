import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import SocketProvider from "@/components/SocketProvider";

export const viewport: Viewport = {
  themeColor: "#a855f7",
};

export const metadata: Metadata = {
  title: "Veil — Anonymous Campus Social",
  description: "The anonymous social platform for DCE students. Meet, vibe, and confess — no strings attached.",
  keywords: ["anonymous", "campus", "DCE", "Dronacharya", "social", "chat", "confessions"],
  openGraph: {
    title: "Veil — Anonymous Campus Social",
    description: "Meet, vibe, and confess anonymously at DCE.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SocketProvider>
          {/* Background orbs */}
          <div className="orb orb-1" aria-hidden />
          <div className="orb orb-2" aria-hidden />
          <div className="orb orb-3" aria-hidden />
          <div className="orb orb-4" aria-hidden />
          <div className="scanline" aria-hidden />
          
          <div style={{ position: "relative", zIndex: 10 }}>
            {children}
          </div>
          
          <Toaster 
            position="top-center"
            toastOptions={{
              style: {
                background: "rgba(10, 10, 18, 0.8)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff",
                borderRadius: "16px",
                fontSize: "0.85rem",
              }
            }}
          />
        </SocketProvider>
      </body>
    </html>
  );
}
