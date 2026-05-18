"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Users, Mail, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    age: "",
    gender: "male",
    interests: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    // Auto-focus next
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.username || !formData.email || !formData.password) {
        toast.error("Please fill all required fields");
        return;
      }
      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
      setStep(2);
    }
  };

  const handleSendOtp = async () => {
    if (!formData.age) {
      toast.error("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(`Verification code sent to ${formData.email}!`);
      setOtpSent(true);
      setStep(3);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndSignup = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter the full 6-digit code");
      return;
    }
    setLoading(true);
    try {
      const interestsArray = formData.interests.split(",").map((i) => i.trim()).filter(Boolean);
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age),
          interests: interestsArray,
          otp: otpString,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Account created! Please log in.");
      router.push("/auth/login");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const stepIcons = [<Users size={24} color="white" />, <Mail size={24} color="white" />, <ShieldCheck size={24} color="white" />];
  const stepTitles = ["Create Account", "Your Profile", "Verify Email"];
  const stepDescs = ["Set your username and password", "Tell us a bit about yourself", `Enter the code sent to ${formData.email}`];

  return (
    <main style={{ minHeight: "100vh", padding: "1.25rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass" style={{ width: "100%", maxWidth: 460, padding: "2rem", borderRadius: 24 }}>
        
        {/* Step Indicator */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: "2rem" }}>
          {[1, 2, 3].map((s) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: step >= s ? "linear-gradient(135deg,#a855f7,#ec4899)" : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700, transition: "all 0.3s" }}>
                {s}
              </div>
              {s < 3 && <div style={{ width: 32, height: 2, background: step > s ? "#a855f7" : "rgba(255,255,255,0.1)", transition: "all 0.3s" }} />}
            </div>
          ))}
        </div>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,#a855f7,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", boxShadow: "0 0 20px rgba(168,85,247,0.4)" }}>
            {stepIcons[step - 1]}
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "Space Grotesk, sans-serif", marginBottom: 4 }}>{stepTitles[step - 1]}</h1>
          <p style={{ color: "var(--text2)", fontSize: "0.88rem" }}>{stepDescs[step - 1]}</p>
        </div>

        <AnimatePresence mode="wait">

          {/* STEP 1 */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text2)", marginBottom: 6, display: "block" }}>Username</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} className="input-glass" placeholder="Your unique alias" style={{ width: "100%" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text2)", marginBottom: 6, display: "block" }}>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-glass" placeholder="you@college.edu" style={{ width: "100%" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text2)", marginBottom: 6, display: "block" }}>Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} className="input-glass" placeholder="Min. 6 characters" style={{ width: "100%" }} />
              </div>
              <button type="button" onClick={handleNext} className="btn-primary" style={{ width: "100%", padding: "1rem", borderRadius: 12, marginTop: 8, display: "flex", justifyContent: "center", gap: 8 }}>
                Continue <ArrowRight size={18} />
              </button>
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text2)", marginBottom: 6, display: "block" }}>Age</label>
                  <input type="number" name="age" value={formData.age} onChange={handleChange} className="input-glass" placeholder="18" style={{ width: "100%" }} min="13" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text2)", marginBottom: 6, display: "block" }}>Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="input-glass" style={{ width: "100%", appearance: "none" }}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text2)", marginBottom: 6, display: "block" }}>Interests <span style={{ color: "var(--text3)", fontWeight: 400 }}>(comma separated)</span></label>
                <input type="text" name="interests" value={formData.interests} onChange={handleChange} className="input-glass" placeholder="Anime, Coding, Music..." style={{ width: "100%" }} />
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button type="button" onClick={() => setStep(1)} className="glass" style={{ padding: "1rem 1.5rem", borderRadius: 12, fontWeight: 600 }}>Back</button>
                <button type="button" onClick={handleSendOtp} disabled={loading} className="btn-primary" style={{ flex: 1, padding: "1rem", borderRadius: 12, display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
                  {loading ? <Loader2 size={18} className="spin" /> : <><Mail size={18} /> Send Verification Code</>}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3 - OTP */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "center" }}>
              
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="input-glass"
                    style={{ width: 52, height: 60, textAlign: "center", fontSize: "1.5rem", fontWeight: 800, padding: 0, borderRadius: 12, border: digit ? "2px solid #a855f7" : "2px solid rgba(255,255,255,0.1)" }}
                  />
                ))}
              </div>

              <p style={{ color: "var(--text3)", fontSize: "0.82rem", textAlign: "center" }}>
                Didn't receive it?{" "}
                <button type="button" onClick={handleSendOtp} style={{ color: "#a855f7", fontWeight: 600 }}>
                  Resend code
                </button>
              </p>

              <div style={{ display: "flex", gap: 10, width: "100%" }}>
                <button type="button" onClick={() => setStep(2)} className="glass" style={{ padding: "1rem 1.5rem", borderRadius: 12, fontWeight: 600 }}>Back</button>
                <button type="button" onClick={handleVerifyAndSignup} disabled={loading} className="btn-primary" style={{ flex: 1, padding: "1rem", borderRadius: 12, display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
                  {loading ? <Loader2 size={18} className="spin" /> : <><ShieldCheck size={18} /> Verify & Create Account</>}
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        <p style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.85rem", color: "var(--text2)" }}>
          Already have an account? <button onClick={() => router.push("/auth/login")} style={{ color: "#a855f7", fontWeight: 600 }}>Log in</button>
        </p>

      </motion.div>
    </main>
  );
}
