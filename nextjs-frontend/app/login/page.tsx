"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signlearnoTheme as theme, signlearnoText, signlearnoUpperLabel } from "@/components/signlearno/theme";
import { loginUser, setStoredToken } from "@/lib/api";
import heroLogo from "@/components/Gemini_Generated_Image_7bvlng7bvlng7bvl (1).png";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await loginUser({ email, password });
      setStoredToken(result.token);
      router.push("/dashboard");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const heroCtaBaseStyle = {
    width: "100%",
    padding: "16px 32px",
    borderRadius: 16,
    border: "none",
    background: theme.colors.green,
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    boxShadow: "0 8px 24px rgba(88, 204, 2, 0.3)",
    transition: "background-color 220ms ease, border-color 220ms ease, filter 220ms ease",
    ...signlearnoText,
  };

  const ctaLabelLiftStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: 12,
    transition: "transform 180ms ease",
  };

  const onHeroCtaMouseEnter = (event: React.MouseEvent<HTMLButtonElement>) => {
    const label = event.currentTarget.querySelector<HTMLElement>("[data-cta-label]");
    if (label) label.style.transform = "translateY(-2px)";
    event.currentTarget.style.boxShadow = "0 14px 30px rgba(15, 23, 42, 0.16)";
  };

  const onHeroCtaMouseLeave = (event: React.MouseEvent<HTMLButtonElement>) => {
    const label = event.currentTarget.querySelector<HTMLElement>("[data-cta-label]");
    if (label) label.style.transform = "none";
    const resetShadow = event.currentTarget.dataset.shadowRest;
    if (resetShadow) event.currentTarget.style.boxShadow = resetShadow;
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "minmax(320px, 44vw) 1fr",
        fontFamily: theme.fontFamily,
        background: `linear-gradient(135deg, ${theme.colors.greenSoft} 0%, rgba(28, 176, 246, 0.05) 100%)`,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Left panel — home-like hero with faded logo */}
      <div
        style={{
          position: "relative",
          background: "transparent",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: 28,
          padding: "56px 52px",
          borderRight: "none",
          overflow: "hidden",
        }}
        className="hidden md:flex"
      >
        <div
          style={{
            position: "absolute",
            left: "-18%",
            top: "50%",
            width: "170%",
            aspectRatio: "1 / 1",
            transform: "translateY(-50%)",
            opacity: 0.24,
            pointerEvents: "none",
          }}
        >
          <Image
            src={heroLogo}
            alt="Signlearno faded logo"
            fill
            priority
            style={{
              objectFit: "contain",
              transform: "scale(1.62)",
              transformOrigin: "center",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 56, lineHeight: "58px", fontWeight: 900, color: theme.colors.green, letterSpacing: -1.8, ...signlearnoText }}>
            signlearno
          </div>
        </Link>
        {/* Tagline */}
        <div style={{ position: "relative", zIndex: 1, fontSize: 50, fontWeight: 800, color: theme.colors.textStrong, lineHeight: "60px", letterSpacing: -1.4, ...signlearnoText }}>
          Learn sign language
          <br />
          for free - fun as a game
        </div>

        <div style={{ position: "relative", zIndex: 1, fontSize: 34, color: theme.colors.textMuted, lineHeight: "46px", maxWidth: 680, ...signlearnoText }}>
          Join thousands of learners practicing sign language every day
        </div>

      </div>

      {/* Right panel — form */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px 32px",
          background: "transparent",
        }}
      >
        <div style={{ width: "100%", maxWidth: 430, borderRadius: 28, border: `2px solid ${theme.colors.border}`, background: theme.colors.surface, boxShadow: "0 22px 50px rgba(17, 24, 39, 0.08)", padding: "28px 26px" }}>
          {/* Mobile logo */}
          <Link href="/" style={{ textDecoration: "none" }}>
            <div
              style={{ fontSize: 32, fontWeight: 900, color: theme.colors.green, letterSpacing: -1, marginBottom: 8, textAlign: "center", ...signlearnoText }}
              className="md:hidden"
            >
              signlearno
            </div>
          </Link>

          <div style={{ ...signlearnoText, fontSize: 34, lineHeight: "40px", fontWeight: 800, color: theme.colors.textStrong, marginBottom: 8, letterSpacing: -1 }}>
            Welcome back!
          </div>
          <div style={{ ...signlearnoText, fontSize: 15, color: theme.colors.textMuted, marginBottom: 32, lineHeight: "22px" }}>
            Log in to continue your learning journey.
          </div>

          {/* Google button */}
          <button
            type="button"
            data-shadow-rest="0 8px 24px rgba(88, 204, 2, 0.3)"
            style={{
              ...heroCtaBaseStyle,
            }}
            onMouseEnter={onHeroCtaMouseEnter}
            onMouseLeave={onHeroCtaMouseLeave}
          >
            <span data-cta-label style={ctaLabelLiftStyle}>
              {/* Google G icon SVG */}
              <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path fill="#FFC107" d="M43.6 20.5h-1.9V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.9 1.1 8 3l5.7-5.7C34.2 6.7 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.9 1.1 8 3l5.7-5.7C34.2 6.7 29.3 4 24 4 16.3 4 9.7 8.6 6.3 14.7z" />
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5.1l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.2 0-9.7-3.4-11.3-8H6.2C9.5 38.9 16.2 44 24 44z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.4 4.3-4.4 5.7l6.2 5.2C41.1 35.3 44 30 44 24c0-1.2-.1-2.3-.4-3.5z" />
              </svg>
              Continue with Google
            </span>
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
            <div style={{ flex: 1, height: 1, background: theme.colors.border }} />
            <span style={{ ...signlearnoUpperLabel, color: theme.colors.textMuted }}>OR</span>
            <div style={{ flex: 1, height: 1, background: theme.colors.border }} />
          </div>

          <form style={{ display: "flex", flexDirection: "column", gap: 12 }} onSubmit={handleSubmit}>
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
                placeholder="••••••••"
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

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              data-shadow-rest="0 8px 24px rgba(88, 204, 2, 0.3)"
              style={{
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.8 : 1,
                marginTop: 4,
                ...heroCtaBaseStyle,
              }}
              onMouseEnter={onHeroCtaMouseEnter}
              onMouseLeave={onHeroCtaMouseLeave}
            >
              <span data-cta-label style={ctaLabelLiftStyle}>
                {loading ? "Logging in..." : "Log in"}
              </span>
            </button>
            {error ? (
              <div style={{ ...signlearnoText, color: theme.colors.red, fontSize: 14, lineHeight: "20px" }}>
                {error}
              </div>
            ) : null}
          </form>

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
