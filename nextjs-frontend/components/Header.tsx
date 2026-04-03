"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signlearnoTheme as theme, signlearnoText } from "@/components/signlearno/theme";
import { Flame, LogOut, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { clearStoredToken, getProfile, getStoredToken } from "@/lib/api";

const navigation = [
  { name: "Home", href: "/", icon: "home" },
  { name: "Translator", href: "/translator", icon: "translator" },
  { name: "Learn", href: "/learn", icon: "learn" },
  { name: "Leaderboard", href: "/leaderboard", icon: "leaderboard" },
  { name: "Dictionary", href: "/dictionary", icon: "dictionary" },
  { name: "Dashboard", href: "/dashboard", icon: "dashboard" },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [translatorDropdownOpen, setTranslatorDropdownOpen] = useState(false);
  const [mobileTranslatorOpen, setMobileTranslatorOpen] = useState(false);
  const [learnDropdownOpen, setLearnDropdownOpen] = useState(false);
  const [mobileLearnOpen, setMobileLearnOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const token = getStoredToken();
      if (!token) {
        setUsername(null);
        return;
      }
      try {
        const profile = await getProfile();
        setUsername(profile.username);
      } catch {
        clearStoredToken();
        setUsername(null);
      }
    };
    void loadProfile();
  }, [pathname]);

  const handleLogout = () => {
    clearStoredToken();
    setUsername(null);
    setMobileMenuOpen(false);
    router.push("/login");
  };

  return (
    <header
      style={{
        width: "100%",
        borderBottom: `2px solid ${theme.colors.border}`,
        background: theme.colors.surface,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "70px",
        }}
      >
        {/* Logo */}
        <Link href="/">
          <div
            style={{
              color: theme.colors.green,
              fontSize: 28,
              lineHeight: "34px",
              fontWeight: 800,
              letterSpacing: -1.2,
              textTransform: "lowercase",
              ...signlearnoText,
              cursor: "pointer",
            }}
          >
            signlearno
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
          className="hidden md:flex"
        >
          {navigation.map((item) => {
            if (item.name === "Translator") {
              return (
                <div
                  key={item.href}
                  style={{ position: "relative" }}
                  onMouseEnter={() => setTranslatorDropdownOpen(true)}
                  onMouseLeave={() => setTranslatorDropdownOpen(false)}
                >
                  <div
                    style={{
                      padding: "10px 18px",
                      borderRadius: 12,
                      background: pathname.startsWith("/translator") ? theme.colors.greenSoft : "transparent",
                      color: pathname.startsWith("/translator") ? theme.colors.green : theme.colors.textMuted,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 200ms ease",
                      ...signlearnoText,
                    }}
                  >
                    {item.name}
                  </div>
                  {translatorDropdownOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        marginTop: 4,
                        borderRadius: 12,
                        background: theme.colors.surface,
                        border: `2px solid ${theme.colors.border}`,
                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                        zIndex: 50,
                        minWidth: 220,
                        overflow: "hidden",
                      }}
                    >
                      <Link href="/translator/signtotext">
                        <div
                          style={{
                            padding: "12px 18px",
                            cursor: "pointer",
                            color: pathname === "/translator/signtotext" ? theme.colors.green : theme.colors.textMuted,
                            fontSize: 14,
                            fontWeight: 500,
                            transition: "all 200ms ease",
                            background: pathname === "/translator/signtotext" ? theme.colors.greenSoft : "transparent",
                            ...signlearnoText,
                          }}
                        >
                          Sign to Text
                        </div>
                      </Link>
                      <Link href="/translator/texttosign">
                        <div
                          style={{
                            padding: "12px 18px",
                            cursor: "pointer",
                            color: pathname === "/translator/texttosign" ? theme.colors.green : theme.colors.textMuted,
                            fontSize: 14,
                            fontWeight: 500,
                            transition: "all 200ms ease",
                            background: pathname === "/translator/texttosign" ? theme.colors.greenSoft : "transparent",
                            borderTop: `1px solid ${theme.colors.border}`,
                            ...signlearnoText,
                          }}
                        >
                          Text to Sign
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              );
            }
            if (item.name === "Learn") {
              return (
                <div
                  key={item.href}
                  style={{ position: "relative" }}
                  onMouseEnter={() => setLearnDropdownOpen(true)}
                  onMouseLeave={() => setLearnDropdownOpen(false)}
                >
                  <div
                    style={{
                      padding: "10px 18px",
                      borderRadius: 12,
                      background: pathname.startsWith("/learn") ? theme.colors.greenSoft : "transparent",
                      color: pathname.startsWith("/learn") ? theme.colors.green : theme.colors.textMuted,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 200ms ease",
                      ...signlearnoText,
                    }}
                  >
                    {item.name}
                  </div>
                  {learnDropdownOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        marginTop: 4,
                        borderRadius: 12,
                        background: theme.colors.surface,
                        border: `2px solid ${theme.colors.border}`,
                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                        zIndex: 50,
                        minWidth: 220,
                        overflow: "hidden",
                      }}
                    >
                      <Link href="/learn/lesson">
                        <div
                          style={{
                            padding: "12px 18px",
                            cursor: "pointer",
                            color: pathname === "/learn/lesson" ? theme.colors.green : theme.colors.textMuted,
                            fontSize: 14,
                            fontWeight: 500,
                            transition: "all 200ms ease",
                            background: pathname === "/learn/lesson" ? theme.colors.greenSoft : "transparent",
                            ...signlearnoText,
                          }}
                        >
                          Lesson
                        </div>
                      </Link>
                      <Link href="/learn/practice">
                        <div
                          style={{
                            padding: "12px 18px",
                            cursor: "pointer",
                            color: pathname === "/learn/practice" ? theme.colors.green : theme.colors.textMuted,
                            fontSize: 14,
                            fontWeight: 500,
                            transition: "all 200ms ease",
                            background: pathname === "/learn/practice" ? theme.colors.greenSoft : "transparent",
                            borderTop: `1px solid ${theme.colors.border}`,
                            ...signlearnoText,
                          }}
                        >
                          Practice
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              );
            }
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  style={{
                    padding: "10px 18px",
                    borderRadius: 12,
                    background: isActive ? theme.colors.greenSoft : "transparent",
                    color: isActive ? theme.colors.green : theme.colors.textMuted,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 200ms ease",
                    ...signlearnoText,
                  }}
                >
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Stats + Auth */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
          className="hidden md:flex"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Flame size={20} color={theme.colors.orange} fill={theme.colors.orange} />
            <span style={{ color: theme.colors.orange, fontSize: 16, fontWeight: 700, ...signlearnoText }}>1</span>
          </div>


          <div style={{ width: 1, height: 24, background: theme.colors.border }} />

          <ThemeToggle />

          {username ? (
            <>
              <div
                style={{
                  padding: "8px 14px",
                  borderRadius: 10,
                  border: `2px solid ${theme.colors.border}`,
                  fontSize: 14,
                  fontWeight: 700,
                  color: theme.colors.textStrong,
                  ...signlearnoText,
                }}
              >
                {username}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: `2px solid ${theme.colors.border}`,
                  background: theme.colors.surface,
                  color: theme.colors.textStrong,
                  cursor: "pointer",
                  fontWeight: 700,
                  ...signlearnoText,
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <div
                  style={{
                    padding: "8px 16px",
                    borderRadius: 10,
                    border: `2px solid ${theme.colors.border}`,
                    fontSize: 14,
                    fontWeight: 700,
                    color: theme.colors.textStrong,
                    cursor: "pointer",
                    ...signlearnoText,
                  }}
                >
                  Log in
                </div>
              </Link>
              <Link href="/register">
                <div
                  style={{
                    padding: "8px 18px",
                    borderRadius: 10,
                    border: "none",
                    borderBottom: `3px solid ${theme.colors.greenDark}`,
                    background: theme.colors.green,
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#fff",
                    cursor: "pointer",
                    ...signlearnoText,
                  }}
                >
                  Sign up
                </div>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: "none",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 8,
            color: theme.colors.textStrong,
          }}
          className="md:hidden"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            padding: "16px 20px",
            borderTop: `1px solid ${theme.colors.border}`,
            background: theme.colors.surface,
          }}
          className="md:hidden"
        >
          {navigation.map((item) => {
            if (item.name === "Translator") {
              return (
                <div key={item.href}>
                  <div
                    style={{
                      padding: "12px 16px",
                      borderRadius: 12,
                      background: pathname.startsWith("/translator") ? theme.colors.greenSoft : "transparent",
                      color: pathname.startsWith("/translator") ? theme.colors.green : theme.colors.textMuted,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      ...signlearnoText,
                    }}
                    onClick={() => setMobileTranslatorOpen(!mobileTranslatorOpen)}
                  >
                    {item.name} {mobileTranslatorOpen ? "▼" : "▶"}
                  </div>
                  {mobileTranslatorOpen && (
                    <>
                      <Link href="/translator/signtotext">
                        <div
                          style={{
                            padding: "10px 16px",
                            marginLeft: 12,
                            borderRadius: 8,
                            background: pathname === "/translator/signtotext" ? theme.colors.greenSoft : "transparent",
                            color: pathname === "/translator/signtotext" ? theme.colors.green : theme.colors.textMuted,
                            fontSize: 13,
                            fontWeight: 500,
                            cursor: "pointer",
                            marginTop: 6,
                            ...signlearnoText,
                          }}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Sign to Text
                        </div>
                      </Link>
                      <Link href="/translator/texttosign">
                        <div
                          style={{
                            padding: "10px 16px",
                            marginLeft: 12,
                            borderRadius: 8,
                            background: pathname === "/translator/texttosign" ? theme.colors.greenSoft : "transparent",
                            color: pathname === "/translator/texttosign" ? theme.colors.green : theme.colors.textMuted,
                            fontSize: 13,
                            fontWeight: 500,
                            cursor: "pointer",
                            marginTop: 6,
                            ...signlearnoText,
                          }}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Text to Sign
                        </div>
                      </Link>
                    </>
                  )}
                </div>
              );
            }
            if (item.name === "Learn") {
              return (
                <div key={item.href}>
                  <div
                    style={{
                      padding: "12px 16px",
                      borderRadius: 12,
                      background: pathname.startsWith("/learn") ? theme.colors.greenSoft : "transparent",
                      color: pathname.startsWith("/learn") ? theme.colors.green : theme.colors.textMuted,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      ...signlearnoText,
                    }}
                    onClick={() => setMobileLearnOpen(!mobileLearnOpen)}
                  >
                    {item.name} {mobileLearnOpen ? "▼" : "▶"}
                  </div>
                  {mobileLearnOpen && (
                    <>
                      <Link href="/learn/lesson">
                        <div
                          style={{
                            padding: "10px 16px",
                            marginLeft: 12,
                            borderRadius: 8,
                            background: pathname === "/learn/lesson" ? theme.colors.greenSoft : "transparent",
                            color: pathname === "/learn/lesson" ? theme.colors.green : theme.colors.textMuted,
                            fontSize: 13,
                            fontWeight: 500,
                            cursor: "pointer",
                            marginTop: 6,
                            ...signlearnoText,
                          }}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Lesson
                        </div>
                      </Link>
                      <Link href="/learn/practice">
                        <div
                          style={{
                            padding: "10px 16px",
                            marginLeft: 12,
                            borderRadius: 8,
                            background: pathname === "/learn/practice" ? theme.colors.greenSoft : "transparent",
                            color: pathname === "/learn/practice" ? theme.colors.green : theme.colors.textMuted,
                            fontSize: 13,
                            fontWeight: 500,
                            cursor: "pointer",
                            marginTop: 6,
                            ...signlearnoText,
                          }}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Practice
                        </div>
                      </Link>
                    </>
                  )}
                </div>
              );
            }
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius: 12,
                    background: isActive ? theme.colors.greenSoft : "transparent",
                    color: isActive ? theme.colors.green : theme.colors.textMuted,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    ...signlearnoText,
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </div>
              </Link>
            );
          })}
          {username ? (
            <button
              type="button"
              onClick={handleLogout}
              style={{
                marginTop: 8,
                padding: "12px 16px",
                borderRadius: 12,
                border: `2px solid ${theme.colors.border}`,
                background: theme.colors.surface,
                color: theme.colors.textStrong,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                textAlign: "left",
                ...signlearnoText,
              }}
            >
              {username} - Logout
            </button>
          ) : (
            <>
              <Link href="/login">
                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: `2px solid ${theme.colors.border}`,
                    color: theme.colors.textStrong,
                    fontSize: 14,
                    fontWeight: 700,
                    ...signlearnoText,
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log in
                </div>
              </Link>
              <Link href="/register">
                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: "none",
                    borderBottom: `3px solid ${theme.colors.greenDark}`,
                    background: theme.colors.green,
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 700,
                    ...signlearnoText,
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign up
                </div>
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
