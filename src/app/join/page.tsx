"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { generateAnonymousIdentity, INTERESTS } from "@/lib/utils";
import { Ghost, Mail, Eye, EyeOff, ArrowLeft, Shuffle, Check } from "lucide-react";
import toast from "react-hot-toast";

type Tab = "guest" | "email";

export default function JoinPage() {
  const router = useRouter();
  const { setUser } = useAppStore();
  const [tab, setTab] = useState<Tab>("guest");
  const [identity, setIdentity] = useState({ username: "GhostPanda#0000", emoji: "👻", color: "#a855f7" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [age, setAge] = useState("");
  const [isAdult, setIsAdult] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [step, setStep] = useState(1);

  useEffect(() => { setIdentity(generateAnonymousIdentity()); }, []);

  const toggleInterest = (i: string) => {
    setSelectedInterests(p => p.includes(i) ? p.filter(x => x !== i) : p.length < 5 ? [...p, i] : p);
  };

  const handleGuestJoin = () => {
    setUser({
      id: `g_${Date.now()}`,
      username: identity.username,
      emoji: identity.emoji,
      color: identity.color,
      isAnonymous: true,
      isAdult,
      interests: selectedInterests,
      mood: "chill",
      isOnline: true,
      joinedAt: new Date(),
    });
    toast.success("Welcome to Veil! 👻");
    router.push("/discover");
  };

  const handleEmailJoin = () => {
    if (!email || !password) return toast.error("Fill in all fields");
    if (isAdult && (!age || parseInt(age) < 18)) return toast.error("Must be 18+ for adult mode");
    setUser({
      id: `u_${Date.now()}`,
      username: identity.username,
      emoji: identity.emoji,
      color: identity.color,
      isAnonymous: false,
      email,
      isAdult,
      age: age ? parseInt(age) : undefined,
      interests: selectedInterests,
      mood: "chill",
      isOnline: true,
      joinedAt: new Date(),
    });
    toast.success("Account created! 🎉");
    router.push("/discover");
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem 1.25rem 6rem" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text2)", display: "flex", alignItems: "center", gap: 6, marginBottom: "1.5rem", fontSize: "0.85rem" }}>
          <ArrowLeft size={16} /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="grad-text" style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 6, fontFamily: "Space Grotesk, sans-serif" }}>
            Join Veil
          </h1>
          <p style={{ color: "var(--text2)", fontSize: "0.85rem", marginBottom: "1.8rem" }}>
            Your identity stays anonymous. Always.
          </p>

          {/* Tabs */}
          <div className="glass" style={{ borderRadius: 12, padding: 4, display: "flex", marginBottom: "1.8rem" }}>
            {(["guest", "email"] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{
                  flex: 1, padding: "0.6rem", borderRadius: 10, border: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, transition: "all 0.3s",
                  background: tab === t ? "linear-gradient(135deg,#a855f7,#ec4899)" : "transparent",
                  color: tab === t ? "white" : "var(--text2)",
                }}>
                {t === "guest" ? "👻 Guest" : "✉️ Email"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === "guest" ? (
              <motion.div key="guest" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                {/* Identity Card */}
                <div className="glass-purple" style={{ borderRadius: 16, padding: "1.2rem", marginBottom: "1.2rem" }}>
                  <p style={{ fontSize: "0.65rem", color: "var(--text3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Your Anonymous Identity</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 50, height: 50, borderRadius: 14, fontSize: "1.6rem",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: `${identity.color}22`, border: `2px solid ${identity.color}55`,
                        boxShadow: `0 0 20px ${identity.color}30`,
                      }}>{identity.emoji}</div>
                      <div>
                        <p style={{ fontWeight: 700, color: identity.color }}>{identity.username}</p>
                        <p style={{ fontSize: "0.72rem", color: "var(--text3)" }}>Anonymous Ghost</p>
                      </div>
                    </div>
                    <button onClick={() => setIdentity(generateAnonymousIdentity())} className="btn-ghost"
                      style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: 6 }}>
                      <Shuffle size={14} /> Reroll
                    </button>
                  </div>
                </div>

                {/* Interests */}
                <div className="glass" style={{ borderRadius: 16, padding: "1.2rem", marginBottom: "1.2rem" }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: 600, marginBottom: 12 }}>Pick interests (max 5) <span style={{ color: "var(--text3)" }}>{selectedInterests.length}/5</span></p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {INTERESTS.map(i => (
                      <button key={i} onClick={() => toggleInterest(i)}
                        className={`tag-chip${selectedInterests.includes(i) ? " selected" : ""}`}>
                        {selectedInterests.includes(i) && <Check size={10} style={{ marginRight: 4 }} />}
                        {i}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Adult mode */}
                <div className="glass" style={{ borderRadius: 12, padding: "0.9rem 1.1rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: "0.85rem" }}>🔞 18+ Adult Mode</p>
                    <p style={{ fontSize: "0.7rem", color: "var(--text3)" }}>I am 18+ and consent to adult content</p>
                  </div>
                  <button onClick={() => setIsAdult(v => !v)} style={{ width: 44, height: 24, borderRadius: 12, cursor: "pointer", border: "none", background: isAdult ? "linear-gradient(135deg,#a855f7,#ec4899)" : "rgba(255,255,255,0.1)", position: "relative", transition: "all 0.3s" }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: "white", position: "absolute", top: 3, transition: "all 0.3s", left: isAdult ? 23 : 3 }} />
                  </button>
                </div>

                <motion.button onClick={handleGuestJoin} className="btn-primary" whileTap={{ scale: 0.97 }}
                  style={{ width: "100%", fontSize: "1rem", padding: "0.9rem", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <Ghost size={20} /> Enter as Ghost
                </motion.button>
                <p style={{ textAlign: "center", fontSize: "0.7rem", color: "var(--text3)", marginTop: 12 }}>No account needed. No tracking. Pure vibe.</p>
              </motion.div>
            ) : (
              <motion.div key="email" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: "1.2rem" }}>
                  {/* Identity */}
                  <div className="glass-purple" style={{ borderRadius: 14, padding: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: "1.5rem" }}>{identity.emoji}</span>
                      <div>
                        <p style={{ fontWeight: 700, color: identity.color, fontSize: "0.9rem" }}>{identity.username}</p>
                        <p style={{ fontSize: "0.7rem", color: "var(--text3)" }}>Public identity (anonymous)</p>
                      </div>
                    </div>
                    <button onClick={() => setIdentity(generateAnonymousIdentity())} className="btn-ghost" style={{ padding: "0.35rem 0.7rem", fontSize: "0.75rem" }}>
                      <Shuffle size={12} />
                    </button>
                  </div>

                  <div>
                    <label style={{ fontSize: "0.75rem", color: "var(--text2)", marginBottom: 6, display: "block" }}>Email Address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                      className="input-glass" />
                  </div>

                  <div style={{ position: "relative" }}>
                    <label style={{ fontSize: "0.75rem", color: "var(--text2)", marginBottom: 6, display: "block" }}>Password</label>
                    <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                      className="input-glass" style={{ paddingRight: "3rem" }} />
                    <button onClick={() => setShowPass(v => !v)} style={{ position: "absolute", right: 12, top: "calc(50% + 8px)", background: "none", border: "none", cursor: "pointer", color: "var(--text3)" }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  <div>
                    <label style={{ fontSize: "0.75rem", color: "var(--text2)", marginBottom: 6, display: "block" }}>Age <span style={{ color: "var(--text3)" }}>(optional)</span></label>
                    <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="18" min="13" max="99"
                      className="input-glass" />
                  </div>

                  {/* Interests */}
                  <div className="glass" style={{ borderRadius: 14, padding: "1rem" }}>
                    <p style={{ fontSize: "0.75rem", fontWeight: 600, marginBottom: 10 }}>Interests (max 5)</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {INTERESTS.map(i => (
                        <button key={i} onClick={() => toggleInterest(i)} className={`tag-chip${selectedInterests.includes(i) ? " selected" : ""}`}>
                          {i}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="glass" style={{ borderRadius: 12, padding: "0.9rem", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: "0.85rem" }}>🔞 18+ Adult Mode</p>
                      <p style={{ fontSize: "0.7rem", color: "var(--text3)" }}>Must be 18+ to enable</p>
                    </div>
                    <button onClick={() => setIsAdult(v => !v)} style={{ width: 44, height: 24, borderRadius: 12, cursor: "pointer", border: "none", background: isAdult ? "linear-gradient(135deg,#a855f7,#ec4899)" : "rgba(255,255,255,0.1)", position: "relative", transition: "all 0.3s" }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "white", position: "absolute", top: 3, transition: "all 0.3s", left: isAdult ? 23 : 3 }} />
                    </button>
                  </div>
                </div>

                <motion.button onClick={handleEmailJoin} className="btn-primary" whileTap={{ scale: 0.97 }}
                  style={{ width: "100%", fontSize: "1rem", padding: "0.9rem", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <Mail size={20} /> Create Account
                </motion.button>
                <p style={{ textAlign: "center", fontSize: "0.7rem", color: "var(--text3)", marginTop: 12 }}>
                  Your email is encrypted &amp; never shown publicly.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}
