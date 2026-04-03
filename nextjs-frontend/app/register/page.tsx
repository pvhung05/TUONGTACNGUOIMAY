"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signlearnoTheme as theme, signlearnoText, signlearnoUpperLabel } from "@/components/signlearno/theme";
import { registerUser, setStoredToken } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await registerUser({ username, email, password });
      setStoredToken(result.token);
      router.push("/dashboard");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        fontFamily: theme.fontFamily,
        background: theme.colors.canvas,
      }}
    >
      {/* Left panel — branding */}
      <div
        style={{
          flex: "0 0 420px",
          background: theme.colors.green,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          padding: 48,
        }}
        className="hidden md:flex"
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ fontSize: 42, fontWeight: 900, color: "#fff", letterSpacing: -1.5, ...signlearnoText }}>
            signlearno
          </div>
        </Link>
        <div style={{ fontSize: 18, fontWeight: 600, color: "rgba(255,255,255,0.88)", textAlign: "center", lineHeight: "28px", ...signlearnoText }}>
          Start your sign language<br />learning journey today
        </div>

        {/* Feature list */}
        {["Completely free", "Short, easy lessons", "XP system & achievements"].map((f) => (
          <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, color: "#fff", fontSize: 15, fontWeight: 600, ...signlearnoText }}>
            <span style={{ fontSize: 18 }}>✓</span> {f}
          </div>
        ))}
      </div>

      {/* Right panel — form */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 400 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div
              style={{ fontSize: 32, fontWeight: 900, color: theme.colors.green, letterSpacing: -1, marginBottom: 8, textAlign: "center", ...signlearnoText }}
              className="md:hidden"
            >
              signlearno
            </div>
          </Link>

          <div style={{ ...signlearnoText, fontSize: 26, fontWeight: 800, color: theme.colors.textStrong, marginBottom: 8 }}>
            Create your free account
          </div>
          <div style={{ ...signlearnoText, fontSize: 15, color: theme.colors.textMuted, marginBottom: 32, lineHeight: "22px" }}>
            Takes less than 30 seconds.
          </div>

          {/* Google button */}
          <button
            type="button"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              padding: "14px 20px",
              borderRadius: 12,
              border: `2px solid ${theme.colors.border}`,
              borderBottom: `4px solid ${theme.colors.border}`,
              background: theme.colors.surface,
              cursor: "pointer",
              fontSize: 15,
              fontWeight: 700,
              color: theme.colors.textStrong,
              ...signlearnoText,
              transition: "border-color 140ms, transform 140ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = theme.colors.blue;
              e.currentTarget.style.transform = "translateY(1px)";
              e.currentTarget.style.borderBottomWidth = "2px";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = theme.colors.border;
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderBottomWidth = "4px";
            }}
          >
            <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="#FFC107" d="M43.6 20.5h-1.9V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.9 1.1 8 3l5.7-5.7C34.2 6.7 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z" />
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.9 1.1 8 3l5.7-5.7C34.2 6.7 29.3 4 24 4 16.3 4 9.7 8.6 6.3 14.7z" />
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5.1l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.2 0-9.7-3.4-11.3-8H6.2C9.5 38.9 16.2 44 24 44z" />
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.4 4.3-4.4 5.7l6.2 5.2C41.1 35.3 44 30 44 24c0-1.2-.1-2.3-.4-3.5z" />
            </svg>
            Sign up with Google
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
            <div style={{ flex: 1, height: 1, background: theme.colors.border }} />
            <span style={{ ...signlearnoUpperLabel, color: theme.colors.textMuted }}>OR</span>
            <div style={{ flex: 1, height: 1, background: theme.colors.border }} />
          </div>

          <form style={{ display: "flex", flexDirection: "column", gap: 12 }} onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ ...signlearnoUpperLabel, color: theme.colors.textMuted }}>DISPLAY NAME</label>
              <input
                type="text"
                placeholder="John Doe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "13px 16px",
                  borderRadius: 12,
                  border: `2px solid ${theme.colors.border}`,
                  fontSize: 15,
                  fontFamily: theme.fontFamily,
                  color: theme.colors.textStrong,
                  outline: "none",
                  boxSizing: "border-box",
                  background: theme.colors.surface,
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = theme.colors.blue)}
                onBlur={(e) => (e.currentTarget.style.borderColor = theme.colors.border)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ ...signlearnoUpperLabel, color: theme.colors.textMuted }}>EMAIL</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "13px 16px",
                  borderRadius: 12,
                  border: `2px solid ${theme.colors.border}`,
                  fontSize: 15,
                  fontFamily: theme.fontFamily,
                  color: theme.colors.textStrong,
                  outline: "none",
                  boxSizing: "border-box",
                  background: theme.colors.surface,
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = theme.colors.blue)}
                onBlur={(e) => (e.currentTarget.style.borderColor = theme.colors.border)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ ...signlearnoUpperLabel, color: theme.colors.textMuted }}>PASSWORD</label>
              <input
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "13px 16px",
                  borderRadius: 12,
                  border: `2px solid ${theme.colors.border}`,
                  fontSize: 15,
                  fontFamily: theme.fontFamily,
                  color: theme.colors.textStrong,
                  outline: "none",
                  boxSizing: "border-box",
                  background: theme.colors.surface,
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = theme.colors.blue)}
                onBlur={(e) => (e.currentTarget.style.borderColor = theme.colors.border)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px 20px",
                borderRadius: 12,
                border: "none",
                borderBottom: `4px solid ${theme.colors.greenDark}`,
                background: theme.colors.green,
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: 16,
                fontWeight: 800,
                color: "#fff",
                ...signlearnoText,
                marginTop: 4,
                transition: "transform 140ms",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(2px)";
                e.currentTarget.style.borderBottomWidth = "2px";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderBottomWidth = "4px";
              }}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
            {error ? (
              <div style={{ ...signlearnoText, color: theme.colors.red, fontSize: 14, lineHeight: "20px" }}>
                {error}
              </div>
            ) : null}
          </form>

          {/* Terms */}
          <div style={{ ...signlearnoText, fontSize: 13, color: theme.colors.textMuted, textAlign: "center", marginTop: 16, lineHeight: "20px" }}>
            By signing up, you agree to our{" "}
            <Link href="#" style={{ color: theme.colors.blue, textDecoration: "none", fontWeight: 600 }}>Terms of Service</Link>
            {" "}and{" "}
            <Link href="#" style={{ color: theme.colors.blue, textDecoration: "none", fontWeight: 600 }}>Privacy Policy</Link>.
          </div>

          {/* Login link */}
          <div
            style={{
              marginTop: 24,
              padding: "18px 20px",
              borderRadius: 14,
              border: `2px solid ${theme.colors.border}`,
              textAlign: "center",
              ...signlearnoText,
              fontSize: 14,
              color: theme.colors.textMuted,
            }}
          >
            Already have an account?{" "}
            <Link href="/login" style={{ color: theme.colors.green, fontWeight: 700, textDecoration: "none" }}>
              Log in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
