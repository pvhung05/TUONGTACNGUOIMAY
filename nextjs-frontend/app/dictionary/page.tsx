"use client";

import { useState } from "react";
import { signlearnoTheme as theme, signlearnoText, signlearnoUpperLabel } from "@/components/signlearno/theme";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Search } from "lucide-react";

const WORDS = [
  { word: "Hello", category: "Greetings", description: "A common greeting used when meeting someone.", videoUrl: "https://www.youtube.com/embed/aNvQjBYbA_Y" },
  { word: "Thank you", category: "Greetings", description: "Expressing gratitude toward someone.", videoUrl: "https://www.youtube.com/embed/Dj3vaOo8ULI" },
  { word: "Please", category: "Greetings", description: "Used when making a polite request.", videoUrl: "https://www.youtube.com/embed/1B3lOQMCzaE" },
  { word: "Sorry", category: "Greetings", description: "Expressing an apology.", videoUrl: "https://www.youtube.com/embed/L2DYI0MFXBE" },
  { word: "Yes", category: "Basics", description: "Affirmative response.", videoUrl: "https://www.youtube.com/embed/3-XyFBkz4rY" },
  { word: "No", category: "Basics", description: "Negative response.", videoUrl: "https://www.youtube.com/embed/3-XyFBkz4rY" },
  { word: "Help", category: "Basics", description: "To request or give assistance.", videoUrl: "https://www.youtube.com/embed/y5XB5rNXj3A" },
  { word: "Water", category: "Food & Drink", description: "A clear liquid essential for life.", videoUrl: "https://www.youtube.com/embed/bFPiXPk2NKo" },
  { word: "Eat", category: "Food & Drink", description: "The action of consuming food.", videoUrl: "https://www.youtube.com/embed/e2f0HVNrZ0g" },
  { word: "Drink", category: "Food & Drink", description: "The action of consuming a liquid.", videoUrl: "https://www.youtube.com/embed/e2f0HVNrZ0g" },
  { word: "More", category: "Food & Drink", description: "Requesting an additional amount.", videoUrl: "https://www.youtube.com/embed/e2f0HVNrZ0g" },
  { word: "Where", category: "Navigation", description: "Asking about location.", videoUrl: "https://www.youtube.com/embed/lFRPODEnAyU" },
  { word: "Left", category: "Navigation", description: "The left direction.", videoUrl: "https://www.youtube.com/embed/QmaVPMcB1fk" },
  { word: "Right", category: "Navigation", description: "The right direction.", videoUrl: "https://www.youtube.com/embed/QmaVPMcB1fk" },
];

const CATEGORIES = ["All", ...Array.from(new Set(WORDS.map((w) => w.category)))];

const categoryColors: Record<string, string> = {
  Greetings: theme.colors.green,
  Basics: theme.colors.blue,
  "Food & Drink": theme.colors.orange,
  Navigation: theme.colors.purple,
};

export default function DictionaryPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selected, setSelected] = useState<(typeof WORDS)[0] | null>(null);

  const filtered = WORDS.filter((w) => {
    const matchCat = activeCategory === "All" || w.category === activeCategory;
    const matchSearch = w.word.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <Header />
      <main style={{ minHeight: "100vh", paddingTop: 90, background: theme.colors.canvas, fontFamily: theme.fontFamily }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}>
          {/* Hero */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>📖</div>
            <h1 style={{ ...signlearnoText, fontSize: 32, fontWeight: 900, color: theme.colors.textStrong, margin: 0 }}>
              Sign Language Dictionary
            </h1>
            <p style={{ ...signlearnoText, fontSize: 16, color: theme.colors.textMuted, marginTop: 8 }}>
              Browse and learn signs for common words.
            </p>
          </div>

          {/* Search */}
          <div style={{ position: "relative", maxWidth: 480, margin: "0 auto 24px" }}>
            <Search size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: theme.colors.textMuted }} />
            <input
              type="text"
              placeholder="Search a word..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px 12px 42px",
                borderRadius: 12,
                border: `2px solid ${theme.colors.border}`,
                fontSize: 15,
                fontFamily: theme.fontFamily,
                color: theme.colors.textStrong,
                background: theme.colors.surface,
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = theme.colors.green)}
              onBlur={(e) => (e.currentTarget.style.borderColor = theme.colors.border)}
            />
          </div>

          {/* Category filter */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 32 }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "7px 18px",
                  borderRadius: 20,
                  border: `2px solid ${activeCategory === cat ? (categoryColors[cat] ?? theme.colors.green) : theme.colors.border}`,
                  background: activeCategory === cat ? (categoryColors[cat] ?? theme.colors.green) : theme.colors.surface,
                  color: activeCategory === cat ? "#fff" : theme.colors.textMuted,
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: 13,
                  ...signlearnoText,
                  transition: "all 140ms",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Two-col layout: grid + detail */}
          <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
            {/* Word grid */}
            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
              {filtered.map((word) => {
                const color = categoryColors[word.category] ?? theme.colors.green;
                const isSelected = selected?.word === word.word;
                return (
                  <div
                    key={word.word}
                    onClick={() => setSelected(word)}
                    style={{
                      padding: "20px 16px",
                      borderRadius: theme.radius.card,
                      border: `2px solid ${isSelected ? color : theme.colors.border}`,
                      borderBottom: `4px solid ${isSelected ? color : theme.colors.border}`,
                      background: isSelected ? `${color}14` : theme.colors.surface,
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 140ms",
                    }}
                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.borderColor = color; }}
                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.borderColor = theme.colors.border; }}
                  >
                    <div style={{ ...signlearnoText, fontSize: 18, fontWeight: 800, color: isSelected ? color : theme.colors.textStrong, marginBottom: 6 }}>
                      {word.word}
                    </div>
                    <div style={{ ...signlearnoUpperLabel, color: "#fff", background: color, borderRadius: 20, padding: "2px 8px", display: "inline-block", fontSize: 11 }}>
                      {word.category}
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 48, color: theme.colors.textMuted, ...signlearnoText }}>
                  No words found.
                </div>
              )}
            </div>

            {/* Detail panel */}
            {selected && (
              <div style={{ width: 360, flexShrink: 0, position: "sticky", top: 100, borderRadius: theme.radius.card, border: `2px solid ${theme.colors.border}`, background: theme.colors.surface, overflow: "hidden" }}>
                <div style={{ background: categoryColors[selected.category] ?? theme.colors.green, padding: "20px 24px" }}>
                  <div style={{ ...signlearnoText, fontSize: 28, fontWeight: 900, color: "#fff" }}>{selected.word}</div>
                  <div style={{ ...signlearnoUpperLabel, color: "rgba(255,255,255,0.8)", marginTop: 4 }}>{selected.category}</div>
                </div>
                <div style={{ padding: 20 }}>
                  <p style={{ ...signlearnoText, fontSize: 15, color: theme.colors.textMuted, lineHeight: "24px", marginBottom: 16 }}>
                    {selected.description}
                  </p>
                  <div style={{ borderRadius: 10, overflow: "hidden", background: "#000" }}>
                    <iframe
                      key={selected.videoUrl}
                      src={`${selected.videoUrl}?autoplay=1&mute=1&rel=0`}
                      title={`Sign for ${selected.word}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                      allowFullScreen
                      style={{ width: "100%", height: 200, border: "none", display: "block" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
