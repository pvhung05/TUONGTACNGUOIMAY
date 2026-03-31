"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { signlearnoTheme as theme, signlearnoText } from "@/components/signlearno/theme";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TranslatorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";

  const modes = [
    { id: "signtotext", path: "/translator/signtotext", label: "Sign to Text", description: "Convert hand gestures into text" },
    { id: "texttosign", path: "/translator/texttosign", label: "Text to Sign", description: "Convert text into sign language video" },
  ];

  return (
    <>
      <Header />
      <main style={{ minHeight: "100vh", paddingTop: "70px", background: theme.colors.surface }}>
        {/* Mode Selector */}
        <div style={{
          background: "white",
          borderBottom: `2px solid ${theme.colors.border}`,
          padding: "20px 0 0",
        }}>
          <div style={{
            maxWidth: "1440px",
            margin: "0 auto",
            padding: "0 20px",
            display: "flex",
            gap: "12px",
          }}>
          {modes.map((mode) => {
            const isActive = pathname.startsWith(mode.path);
            return (
              <Link 
                key={mode.id}
                href={mode.path}
                style={{
                  padding: "14px 24px",
                  paddingBottom: "12px",
                  borderRadius: "12px 12px 0 0",
                  border: "none",
                  background: isActive ? theme.colors.green : "transparent",
                  color: isActive ? "white" : theme.colors.textMuted,
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 200ms ease",
                  borderBottom: isActive ? "none" : `2px solid ${theme.colors.border}`,
                  textDecoration: "none",
                  display: "inline-block",
                  ...signlearnoText,
                }}
              >
                {mode.label}
              </Link>
            );
          })}
          </div>
        </div>

        {/* Mode Content */}
        <div style={{
          padding: "32px 24px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}>
          {children}
        </div>
      </main>

      <Footer />
    </>
  );
}
