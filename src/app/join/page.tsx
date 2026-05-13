"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { INTERESTS, MOODS, NEON_COLORS, AVATAR_EMOJIS, generateAnonymousIdentity } from "@/lib/utils";
import { Ghost, ChevronRight, ChevronLeft, Check, Shuffle, User, BookOpen, Smile, Zap } from "lucide-react";
import toast from "react-hot-toast";

const STEPS = ["identity", "campus", "vibe", "ready"] as const;
type Step = typeof STEPS[number];

const COLLEGES = [
  "Dronacharya College of Engineering",
  "Delhi Technological University",
  "NSUT Delhi",
  "IIT Delhi",
  "BITS Pilani",
  "Jamia Millia Islamia",
  "IP University",
  "Amity University",
  "Other / Don't say",
];

export default function JoinPage() {
  const router = useRouter();
  const { setUser, isAuthenticated } = useAppStore();
  const [step, setStep] = useState<Step>("identity");
  const [anonId, setAnonId] = useState(() => generateAnonymousIdentity());
  const [displayName, setDisplayName] = useState("");
  const [useRealName, setUseRealName] = useState(false);
  const [college, setCollege] = useState("");
  const [year, setYear] = useState("");
  const [selectedMood, setSelectedMood] = useState("chill");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedEmoji, setSelectedEmoji] = useState("👻");
  const [selectedColor, setSelectedColor] = useState(NEON_COLORS[0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSelectedEmoji(anonId.emoji);
    setSelectedColor(anonId.color);
    if (isAuthenticated) router.push("/discover");
  }, [isAuthenticated, router]);

  const toggleInterest = (i: string) => {
    setSelectedInterests(p => p.includes(i) ? p.filter(x => x !== i) : p.length < 6 ? [...p, i] : p);
  };

  const stepIdx = STEPS.indexOf(step);
  const canNext = () => {
    if (step === "identity") return true; // name is optional (anonymous by default)
    if (step === "campus") return true;
    if (step === "vibe") return selectedInterests.length >= 1;
    return true;
  };

  const next = () => {
    if (!canNext()) return toast.error("Pick at least 1 interest to continue");
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  };
  const back = () => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  };

  const handleJoin = () => {
    const finalName = useRealName && displayName.trim() ? displayName.trim() : anonId.username;
    setUser({
      id: `u_${Date.now()}`,
      username: anonId.username,
      realName: useRealName && displayName.trim() ? displayName.trim() : undefined,
      emoji: selectedEmoji,
      color: selectedColor,
      isAnonymous: !useRealName || !displayName.trim(),
      isAdult: false,
      interests: selectedInterests,
      mood: selectedMood,
      isOnline: true,
      joinedAt: new Date(),
    });
    toast.success(`Welcome to Veil, ${finalName.split("#")[0]}! 🎉`);
    router.push("/discover");
  };

  if (!mounted) return null;

  const progressPct = ((stepIdx) / (STEPS.length - 1)) * 100;

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem 1.25rem 6rem" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#a855f7,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(168,85,247,0.5)" }}>
              <Ghost size={22} color="white" />
            </div>
            <span style={{ fontSize: "1.6rem", fontWeight: 800, fontFamily: "Space Grotesk, sans-serif" }} className="grad-text">VEIL</span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: "1.8rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700,
                  background: i <= stepIdx ? "linear-gradient(135deg,#a855f7,#ec4899)" : "rgba(255,255,255,0.08)",
                  border: i === stepIdx ? "2px solid #a855f7" : "2px solid transparent",
                  color: i <= stepIdx ? "white" : "var(--text3)",
                  transition: "all 0.3s",
                }}>
                  {i < stepIdx ? <Check size={12} /> : i + 1}
                </div>
              </div>
            ))}
          </div>
          <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
            <motion.div animate={{ width: `${progressPct}%` }} transition={{ duration: 0.4 }}
              style={{ height: "100%", background: "linear-gradient(90deg,#a855f7,#ec4899)", borderRadius: 4 }} />
          </div>
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          {/* ── STEP 1: Identity ── */}
          {step === "identity" && (
            <motion.div key="identity" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <User size={16} color="#a855f7" />
                  <p style={{ fontSize: "0.7rem", color: "var(--text3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Step 1 — Your Identity</p>
                </div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "Space Grotesk, sans-serif" }}>Who are you <span className="grad-text">on campus?</span></h2>
                <p style={{ color: "var(--text2)", fontSize: "0.85rem", marginTop: 6 }}>Stay anonymous or add your name. You can always change this.</p>
              </div>

              {/* Emoji avatar picker */}
              <div className="glass" style={{ borderRadius: 18, padding: "1.2rem", marginBottom: "1rem" }}>
                <p style={{ fontSize: "0.75rem", color: "var(--text2)", fontWeight: 600, marginBottom: 12 }}>Pick your avatar</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                  {AVATAR_EMOJIS.slice(0, 15).map(e => (
                    <button key={e} onClick={() => setSelectedEmoji(e)} style={{
                      width: 42, height: 42, borderRadius: 12, fontSize: "1.3rem", cursor: "pointer", border: "none",
                      background: selectedEmoji === e ? `${selectedColor}33` : "rgba(255,255,255,0.06)",
                      outline: selectedEmoji === e ? `2px solid ${selectedColor}` : "none",
                      transition: "all 0.15s",
                    }}>{e}</button>
                  ))}
                </div>
                <p style={{ fontSize: "0.75rem", color: "var(--text2)", fontWeight: 600, marginBottom: 8 }}>Pick your color</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {NEON_COLORS.map(c => (
                    <button key={c} onClick={() => setSelectedColor(c)} style={{
                      width: 28, height: 28, borderRadius: "50%", background: c, cursor: "pointer", border: "none",
                      outline: selectedColor === c ? `3px solid white` : "2px solid transparent",
                      outlineOffset: 2, transition: "all 0.15s",
                    }} />
                  ))}
                </div>
              </div>

              {/* Identity preview */}
              <div className="glass-purple" style={{ borderRadius: 16, padding: "1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, fontSize: "1.7rem", display: "flex", alignItems: "center", justifyContent: "center", background: `${selectedColor}22`, border: `2px solid ${selectedColor}55`, boxShadow: `0 0 20px ${selectedColor}30`, flexShrink: 0 }}>
                  {selectedEmoji}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, color: selectedColor }}>{anonId.username}</p>
                  <p style={{ fontSize: "0.72rem", color: "var(--text3)" }}>Anonymous Ghost · DCE</p>
                </div>
                <button onClick={() => { const id = generateAnonymousIdentity(); setAnonId(id); }} className="btn-ghost" style={{ padding: "0.4rem 0.8rem", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: 5 }}>
                  <Shuffle size={12} /> Reroll
                </button>
              </div>

              {/* Optional real name */}
              <div className="glass" style={{ borderRadius: 16, padding: "1rem", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: useRealName ? 12 : 0 }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>Show my name <span style={{ fontSize: "0.7rem", color: "#10b981", background: "rgba(16,185,129,0.15)", padding: "2px 6px", borderRadius: 4, marginLeft: 4 }}>Optional</span></p>
                    <p style={{ fontSize: "0.72rem", color: "var(--text3)", marginTop: 2 }}>Build trust. Real names get 3× more matches.</p>
                  </div>
                  <button onClick={() => setUseRealName(v => !v)} style={{ width: 44, height: 24, borderRadius: 12, cursor: "pointer", border: "none", background: useRealName ? "linear-gradient(135deg,#a855f7,#ec4899)" : "rgba(255,255,255,0.1)", position: "relative", transition: "all 0.3s", flexShrink: 0 }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: "white", position: "absolute", top: 3, left: useRealName ? 23 : 3, transition: "all 0.3s", boxShadow: "0 2px 4px rgba(0,0,0,0.3)" }} />
                  </button>
                </div>
                <AnimatePresence>
                  {useRealName && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                      <input
                        type="text"
                        value={displayName}
                        onChange={e => setDisplayName(e.target.value)}
                        placeholder="Your first name (e.g. Akash)"
                        className="input-glass"
                        style={{ marginTop: 0 }}
                        autoFocus
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: Campus ── */}
          {step === "campus" && (
            <motion.div key="campus" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <BookOpen size={16} color="#a855f7" />
                  <p style={{ fontSize: "0.7rem", color: "var(--text3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Step 2 — Your Campus</p>
                </div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "Space Grotesk, sans-serif" }}>Where do you <span className="grad-text">study?</span></h2>
                <p style={{ color: "var(--text2)", fontSize: "0.85rem", marginTop: 6 }}>Connect with people on your campus. Shown anonymously.</p>
              </div>

              <div className="glass" style={{ borderRadius: 18, padding: "1.2rem", marginBottom: "1rem" }}>
                <p style={{ fontSize: "0.75rem", color: "var(--text2)", fontWeight: 600, marginBottom: 10 }}>Select your college</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {COLLEGES.map(c => (
                    <button key={c} onClick={() => setCollege(c)} style={{
                      padding: "0.75rem 1rem", borderRadius: 12, border: "none", cursor: "pointer", textAlign: "left", fontSize: "0.85rem", fontWeight: college === c ? 700 : 400,
                      background: college === c ? "linear-gradient(135deg, rgba(168,85,247,0.25), rgba(236,72,153,0.15))" : "rgba(255,255,255,0.04)",
                      color: college === c ? "#a855f7" : "var(--text2)",
                      outline: college === c ? "1.5px solid rgba(168,85,247,0.5)" : "1.5px solid rgba(255,255,255,0.06)",
                      transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}>
                      {c}
                      {college === c && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass" style={{ borderRadius: 14, padding: "1rem", marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "0.75rem", color: "var(--text2)", fontWeight: 600, marginBottom: 10 }}>Year of study <span style={{ color: "var(--text3)" }}>(optional)</span></p>
                <div style={{ display: "flex", gap: 8 }}>
                  {["1st", "2nd", "3rd", "4th", "PG"].map(y => (
                    <button key={y} onClick={() => setYear(y)} style={{
                      flex: 1, padding: "0.5rem", borderRadius: 10, border: "none", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600,
                      background: year === y ? "linear-gradient(135deg,#a855f7,#ec4899)" : "rgba(255,255,255,0.06)",
                      color: year === y ? "white" : "var(--text2)", transition: "all 0.2s",
                    }}>{y}</button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: Vibe ── */}
          {step === "vibe" && (
            <motion.div key="vibe" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <Smile size={16} color="#a855f7" />
                  <p style={{ fontSize: "0.7rem", color: "var(--text3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Step 3 — Your Vibe</p>
                </div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "Space Grotesk, sans-serif" }}>What's your <span className="grad-text">vibe today?</span></h2>
                <p style={{ color: "var(--text2)", fontSize: "0.85rem", marginTop: 6 }}>This helps us match you with the right energy.</p>
              </div>

              {/* Mood */}
              <div className="glass" style={{ borderRadius: 18, padding: "1.2rem", marginBottom: "1rem" }}>
                <p style={{ fontSize: "0.75rem", color: "var(--text2)", fontWeight: 600, marginBottom: 10 }}>Current mood</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {MOODS.map(m => (
                    <button key={m.value} onClick={() => setSelectedMood(m.value)} style={{
                      padding: "0.7rem", borderRadius: 12, border: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, transition: "all 0.2s",
                      background: selectedMood === m.value ? `${m.color}22` : "rgba(255,255,255,0.04)",
                      color: selectedMood === m.value ? m.color : "var(--text2)",
                      outline: selectedMood === m.value ? `1.5px solid ${m.color}66` : "1.5px solid rgba(255,255,255,0.06)",
                    }}>{m.label}</button>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div className="glass" style={{ borderRadius: 18, padding: "1.2rem", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <p style={{ fontSize: "0.75rem", color: "var(--text2)", fontWeight: 600 }}>Interests <span style={{ color: "var(--text3)" }}>(pick 1–6)</span></p>
                  <span style={{ fontSize: "0.72rem", color: selectedInterests.length >= 1 ? "#10b981" : "var(--text3)", fontWeight: 600 }}>{selectedInterests.length}/6</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {INTERESTS.map(i => (
                    <button key={i} onClick={() => toggleInterest(i)} className={`tag-chip${selectedInterests.includes(i) ? " selected" : ""}`}>
                      {selectedInterests.includes(i) && <Check size={10} style={{ marginRight: 4 }} />}
                      {i}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP 4: Ready ── */}
          {step === "ready" && (
            <motion.div key="ready" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <motion.div animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 0.6, delay: 0.2 }}
                  style={{ fontSize: "3.5rem", marginBottom: "0.8rem" }}>🎉</motion.div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "Space Grotesk, sans-serif" }}>You're all set, <span className="grad-text">{useRealName && displayName ? displayName : anonId.username.split("#")[0]}!</span></h2>
                <p style={{ color: "var(--text2)", fontSize: "0.85rem", marginTop: 6 }}>Your anonymous profile is ready. Go discover real people.</p>
              </div>

              {/* Summary card */}
              <div className="glass-purple" style={{ borderRadius: 20, padding: "1.4rem", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: "1.2rem" }}>
                  <div style={{ width: 60, height: 60, borderRadius: 16, fontSize: "2rem", display: "flex", alignItems: "center", justifyContent: "center", background: `${selectedColor}22`, border: `2px solid ${selectedColor}55`, boxShadow: `0 0 24px ${selectedColor}40` }}>
                    {selectedEmoji}
                  </div>
                  <div>
                    <p style={{ fontWeight: 800, fontSize: "1rem", color: selectedColor }}>{useRealName && displayName ? displayName : anonId.username}</p>
                    <p style={{ fontSize: "0.72rem", color: "var(--text3)", marginTop: 2 }}>
                      {college || "DCE"} {year && `· ${year} Year`}
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {selectedInterests.slice(0, 5).map(i => (
                    <span key={i} className="tag-chip" style={{ fontSize: "0.72rem", cursor: "default" }}>{i}</span>
                  ))}
                  <span style={{ fontSize: "0.72rem", padding: "4px 10px", background: `${MOODS.find(m => m.value === selectedMood)?.color || "#a855f7"}22`, color: MOODS.find(m => m.value === selectedMood)?.color || "#a855f7", borderRadius: 999, fontWeight: 600 }}>
                    {MOODS.find(m => m.value === selectedMood)?.label}
                  </span>
                </div>
              </div>

              <motion.button onClick={handleJoin} className="btn-primary" whileTap={{ scale: 0.97 }}
                style={{ width: "100%", fontSize: "1rem", padding: "1rem", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <Zap size={20} /> Enter Veil
              </motion.button>
              <p style={{ textAlign: "center", fontSize: "0.7rem", color: "var(--text3)", marginTop: 12 }}>No account needed. No tracking. Pure vibe.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        {step !== "ready" && (
          <div style={{ display: "flex", gap: 10, marginTop: "1.5rem" }}>
            {stepIdx > 0 && (
              <button onClick={back} className="btn-ghost" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "0.85rem" }}>
                <ChevronLeft size={16} /> Back
              </button>
            )}
            <motion.button onClick={next} className="btn-primary" whileTap={{ scale: 0.97 }}
              style={{ flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "0.85rem", borderRadius: 14 }}>
              {step === "vibe" ? "Preview →" : "Continue"} <ChevronRight size={16} />
            </motion.button>
          </div>
        )}

        {/* Skip to anonymous join on first step */}
        {step === "identity" && (
          <p style={{ textAlign: "center", marginTop: 14, fontSize: "0.72rem", color: "var(--text3)" }}>
            Already vibing?{" "}
            <button onClick={() => {
              setUser({ id: `g_${Date.now()}`, username: anonId.username, emoji: selectedEmoji, color: selectedColor, isAnonymous: true, isAdult: false, interests: [], mood: "chill", isOnline: true, joinedAt: new Date() });
              toast.success("Entered as Ghost 👻");
              router.push("/discover");
            }} style={{ background: "none", border: "none", cursor: "pointer", color: "#a855f7", fontWeight: 700, fontSize: "0.72rem" }}>
              Skip & enter anonymously
            </button>
          </p>
        )}
      </div>
    </main>
  );
}
