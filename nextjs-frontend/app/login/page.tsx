"use client";

import Link from "next/link";
import { signlearnoTheme as theme, signlearnoText, signlearnoUpperLabel } from "@/components/signlearno/theme";

export default function LoginPage() {
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
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ fontSize: 42, fontWeight: 900, color: "#fff", letterSpacing: -1.5, ...signlearnoText }}>
            signlearno
          </div>
        </Link>
        {/* Tagline */}
        <div style={{ fontSize: 18, fontWeight: 600, color: "rgba(255,255,255,0.88)", textAlign: "center", lineHeight: "28px", ...signlearnoText }}>
          Learn sign language<br />for free — fun as a game
        </div>

        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", textAlign: "center", lineHeight: "22px", ...signlearnoText }}>
          Join thousands of learners<br />practicing sign language every day
        </div>
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
          {/* Mobile logo */}
          <Link href="/" style={{ textDecoration: "none" }}>
            <div
              style={{ fontSize: 32, fontWeight: 900, color: theme.colors.green, letterSpacing: -1, marginBottom: 8, textAlign: "center", ...signlearnoText }}
              className="md:hidden"
            >
              signlearno
            </div>
          </Link>

          <div style={{ ...signlearnoText, fontSize: 26, fontWeight: 800, color: theme.colors.textStrong, marginBottom: 8 }}>
            Welcome back!
          </div>
          <div style={{ ...signlearnoText, fontSize: 15, color: theme.colors.textMuted, marginBottom: 32, lineHeight: "22px" }}>
            Log in to continue your learning journey.
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
            {/* Google G icon SVG */}
            <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="#FFC107" d="M43.6 20.5h-1.9V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.9 1.1 8 3l5.7-5.7C34.2 6.7 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z" />
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.9 1.1 8 3l5.7-5.7C34.2 6.7 29.3 4 24 4 16.3 4 9.7 8.6 6.3 14.7z" />
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5.1l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.2 0-9.7-3.4-11.3-8H6.2C9.5 38.9 16.2 44 24 44z" />
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.4 4.3-4.4 5.7l6.2 5.2C41.1 35.3 44 30 44 24c0-1.2-.1-2.3-.4-3.5z" />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
            <div style={{ flex: 1, height: 1, background: theme.colors.border }} />
            <span style={{ ...signlearnoUpperLabel, color: theme.colors.textMuted }}>OR</span>
            <div style={{ flex: 1, height: 1, background: theme.colors.border }} />
          </div>

          {/* Email input */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ ...signlearnoUpperLabel, color: theme.colors.textMuted }}>EMAIL</label>
              <input
                type="email"
                placeholder="you@example.com"
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
                placeholder="••••••••"
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

            {/* Login button */}
            <button
              type="button"
              style={{
                width: "100%",
                padding: "14px 20px",
                borderRadius: 12,
                border: "none",
                borderBottom: `4px solid ${theme.colors.greenDark}`,
                background: theme.colors.green,
                cursor: "pointer",
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
              Log in
            </button>
          </div>

          {/* Forgot password */}
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Link href="#" style={{ ...signlearnoText, fontSize: 14, color: theme.colors.blue, fontWeight: 600, textDecoration: "none" }}>
              Forgot password?
            </Link>
          </div>

          {/* Sign up link */}
          <div
            style={{
              marginTop: 32,
              padding: "18px 20px",
              borderRadius: 14,
              border: `2px solid ${theme.colors.border}`,
              textAlign: "center",
              ...signlearnoText,
              fontSize: 14,
              color: theme.colors.textMuted,
            }}
          >
            Don't have an account?{" "}
            <Link href="/register" style={{ color: theme.colors.green, fontWeight: 700, textDecoration: "none" }}>
              Sign up for free
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
