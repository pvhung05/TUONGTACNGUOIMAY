"use client";

import { signlearnoTheme as theme, signlearnoText } from "@/components/signlearno/theme";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        width: "100%",
        borderTop: `2px solid ${theme.colors.border}`,
        background: theme.colors.surface,
        marginTop: 64,
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "48px 20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 40,
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              color: theme.colors.green,
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: -1,
              textTransform: "lowercase",
              ...signlearnoText,
            }}
          >
            signlearno
          </div>
          <p
            style={{
              color: theme.colors.textMuted,
              fontSize: 14,
              lineHeight: "22px",
              fontWeight: 500,
              ...signlearnoText,
            }}
          >
            Learn sign language with AI-powered real-time translation and interactive lessons.
          </p>
        </div>

        {/* Product */}
        <div>
          <h4
            style={{
              color: theme.colors.textStrong,
              fontSize: 14,
              fontWeight: 700,
              marginBottom: 16,
              textTransform: "uppercase",
              letterSpacing: 0.8,
              ...signlearnoText,
            }}
          >
            Product
          </h4>
          <nav style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { name: "Home", href: "/landing" },
              { name: "Learn", href: "/" },
              { name: "Translator", href: "/translator" },
              { name: "Dashboard", href: "/dashboard" },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <span
                  style={{
                    color: theme.colors.textMuted,
                    fontSize: 14,
                    lineHeight: "20px",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "color 200ms",
                    ...signlearnoText,
                  }}
                  className="hover:text-blue-500"
                >
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Resources */}
        <div>
          <h4
            style={{
              color: theme.colors.textStrong,
              fontSize: 14,
              fontWeight: 700,
              marginBottom: 16,
              textTransform: "uppercase",
              letterSpacing: 0.8,
              ...signlearnoText,
            }}
          >
            Resources
          </h4>
          <nav style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {["Documentation", "Blog", "Support", "Community"].map((item) => (
              <Link key={item} href="#">
                <span
                  style={{
                    color: theme.colors.textMuted,
                    fontSize: 14,
                    lineHeight: "20px",
                    fontWeight: 500,
                    cursor: "pointer",
                    ...signlearnoText,
                  }}
                >
                  {item}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Legal */}
        <div>
          <h4
            style={{
              color: theme.colors.textStrong,
              fontSize: 14,
              fontWeight: 700,
              marginBottom: 16,
              textTransform: "uppercase",
              letterSpacing: 0.8,
              ...signlearnoText,
            }}
          >
            Legal
          </h4>
          <nav style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {["Privacy", "Terms", "License", "Contact"].map((item) => (
              <Link key={item} href="#">
                <span
                  style={{
                    color: theme.colors.textMuted,
                    fontSize: 14,
                    lineHeight: "20px",
                    fontWeight: 500,
                    cursor: "pointer",
                    ...signlearnoText,
                  }}
                >
                  {item}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          borderTop: `1px solid ${theme.colors.border}`,
          padding: "24px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <p
          style={{
            color: theme.colors.textMuted,
            fontSize: 12,
            lineHeight: "18px",
            fontWeight: 500,
            ...signlearnoText,
          }}
        >
          © {currentYear} SignLearn. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: 24 }}>
          <a
            href="#"
            style={{
              color: theme.colors.textMuted,
              fontSize: 12,
              fontWeight: 600,
              textDecoration: "none",
              ...signlearnoText,
            }}
          >
            Twitter
          </a>
          <a
            href="#"
            style={{
              color: theme.colors.textMuted,
              fontSize: 12,
              fontWeight: 600,
              textDecoration: "none",
              ...signlearnoText,
            }}
          >
            GitHub
          </a>
          <a
            href="#"
            style={{
              color: theme.colors.textMuted,
              fontSize: 12,
              fontWeight: 600,
              textDecoration: "none",
              ...signlearnoText,
            }}
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
