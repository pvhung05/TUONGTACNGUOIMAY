"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signlearnoTheme as theme, signlearnoText } from "@/components/signlearno/theme";
import { Flame, Gem, Menu, X } from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Home", href: "/", icon: "home" },
  { name: "Learn", href: "/learn", icon: "learn" },
  { name: "Translator", href: "/translator", icon: "translator" },
  { name: "Dashboard", href: "/dashboard", icon: "dashboard" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

        {/* Stats */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
          className="hidden md:flex"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                display: "flex",
                width: 24,
                justifyContent: "center",
              }}
            >
              <Flame size={20} color={theme.colors.orange} fill={theme.colors.orange} />
            </div>
            <span
              style={{
                color: theme.colors.orange,
                fontSize: 16,
                lineHeight: "20px",
                fontWeight: 700,
                ...signlearnoText,
              }}
            >
              1
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                display: "flex",
                width: 24,
                justifyContent: "center",
              }}
            >
              <Gem size={20} color={theme.colors.border} fill={theme.colors.border} />
            </div>
            <span
              style={{
                color: theme.colors.border,
                fontSize: 16,
                lineHeight: "20px",
                fontWeight: 700,
                ...signlearnoText,
              }}
            >
              0
            </span>
          </div>
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
        </div>
      )}
    </header>
  );
}
