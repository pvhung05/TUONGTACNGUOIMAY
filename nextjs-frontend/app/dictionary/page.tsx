"use client";

import Link from "next/link";
import { signlearnoTheme as theme } from "@/components/signlearno/theme";

export default function DictionaryPage() {
  const cards = [
    {
      title: "Sign Alphabet",
      description: "Browse sign language letters and numbers, then open related videos for the symbol you choose.",
      href: "/dictionary/sign-alphabet",
      accent: theme.colors.green,
      ctaEdge: theme.colors.greenDark,
      iconBg: theme.colors.greenSoft,
      shadowTint: "color-mix(in srgb, var(--signlearno-green) 14%, transparent)",
      badgeBg: theme.colors.greenSoft,
      badgeFg: theme.colors.greenDark,
      badge: "ALPHABET",
      emoji: "A",
    },
    {
      title: "Word Search",
      description: "Type a word or phrase and discover related sign videos like a playful dictionary.",
      href: "/dictionary/word-search",
      accent: theme.colors.blue,
      ctaEdge: theme.colors.blueBorder,
      iconBg: theme.colors.blueSoft,
      shadowTint: "color-mix(in srgb, var(--signlearno-blue) 14%, transparent)",
      badgeBg: theme.colors.blueSoft,
      badgeFg: theme.colors.blue,
      badge: "WORDS",
      emoji: "W",
    },
  ];

  return (
    <>
      <main
        style={{
          minHeight: "100vh",
          paddingTop: 88,
          background: "transparent",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <section
            className="rounded-3xl border-2 p-6 sm:p-8"
            style={{
              background: `linear-gradient(135deg, ${theme.colors.greenSoft} 0%, ${theme.colors.yellowSoft} 100%)`,
              borderColor: theme.colors.border,
              boxShadow: "0 12px 0 rgba(0,0,0,0.08)",
            }}
          >
            <p className="text-xs font-extrabold uppercase tracking-[0.24em]" style={{ color: theme.colors.blue }}>
              Sign Dictionary
            </p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl" style={{ color: theme.colors.textStrong }}>
              Choose how you want to learn
            </h1>
            <p className="mt-2 max-w-2xl text-sm sm:text-base" style={{ color: theme.colors.textMuted }}>
              Pick a sign alphabet or search by word. Each path opens a dedicated page with related sign videos.
            </p>
          </section>

          <section className="mt-6 grid gap-5 lg:grid-cols-2">
            {cards.map((card) => (
              <Link key={card.href} href={card.href} style={{ textDecoration: "none" }}>
                <div
                  className="h-full rounded-3xl border-2 p-6 transition"
                  style={{
                    background: theme.colors.surface,
                    borderColor: theme.colors.border,
                    boxShadow: "0 10px 0 rgba(0,0,0,0.06)",
                  }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.borderColor = card.accent;
                    event.currentTarget.style.transform = "translateY(-3px)";
                    event.currentTarget.style.boxShadow = `0 14px 0 ${card.shadowTint}`;
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.borderColor = theme.colors.border;
                    event.currentTarget.style.transform = "translateY(0)";
                    event.currentTarget.style.boxShadow = "0 10px 0 rgba(0,0,0,0.06)";
                  }}
                >
                  <div
                    className="inline-flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-black"
                    style={{ background: card.iconBg, color: card.accent }}
                  >
                    {card.emoji}
                  </div>

                  <div className="mt-5 inline-flex rounded-full px-3 py-1 text-xs font-black" style={{ background: card.badgeBg, color: card.badgeFg }}>
                    {card.badge}
                  </div>

                  <h2 className="mt-4 text-2xl font-black" style={{ color: theme.colors.textStrong }}>
                    {card.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6" style={{ color: theme.colors.textMuted }}>
                    {card.description}
                  </p>

                  <div
                    className="mt-6 inline-flex items-center rounded-2xl px-4 py-3 text-sm font-extrabold"
                    style={{
                      background: card.accent,
                      color: theme.colors.surface,
                      borderBottom: `4px solid ${card.ctaEdge}`,
                    }}
                  >
                    Open {card.title}
                  </div>
                </div>
              </Link>
            ))}
          </section>
        </div>
      </main>
    </>
  );
}
