"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { signlearnoTheme as theme, signlearnoText, signlearnoUpperLabel } from "@/components/signlearno/theme";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Search } from "lucide-react";
import { addTranslatorWord, getTranslatorWords, searchTranslatorWords } from "@/lib/api";
import type { TranslatorWord } from "@/lib/api/backend";

export default function DictionaryPage() {
  const [search, setSearch] = useState("");
  const [words, setWords] = useState<TranslatorWord[]>([]);
  const [selected, setSelected] = useState<TranslatorWord | null>(null);
  const [newText, setNewText] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const loadWords = async (searchText?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = searchText ? await searchTranslatorWords(searchText) : (await getTranslatorWords()).words;
      setWords(data);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Failed to load dictionary.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadWords();
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      void loadWords(search.trim() ? search : undefined);
    }, 350);
    return () => window.clearTimeout(id);
  }, [search]);

  const filtered = useMemo(() => words, [words]);

  const handleAddWord = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAddError(null);
    setAdding(true);
    try {
      await addTranslatorWord({ text: newText, videoUrl: newVideoUrl });
      setNewText("");
      setNewVideoUrl("");
      await loadWords();
    } catch (nextError) {
      setAddError(nextError instanceof Error ? nextError.message : "Failed to add word.");
    } finally {
      setAdding(false);
    }
  };

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

          <form onSubmit={handleAddWord} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 10, marginBottom: 24 }}>
            <input
              placeholder="New word text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              required
              style={{ padding: "12px", borderRadius: 12, border: `2px solid ${theme.colors.border}` }}
            />
            <input
              placeholder="Video URL"
              value={newVideoUrl}
              onChange={(e) => setNewVideoUrl(e.target.value)}
              required
              style={{ padding: "12px", borderRadius: 12, border: `2px solid ${theme.colors.border}` }}
            />
            <button type="submit" disabled={adding} style={{ padding: "12px 16px", borderRadius: 12, border: "none", background: theme.colors.green, color: "#fff", fontWeight: 700 }}>
              {adding ? "Adding..." : "Add"}
            </button>
          </form>
          {addError ? <div style={{ ...signlearnoText, color: theme.colors.red, marginBottom: 16 }}>{addError}</div> : null}
          {error ? <div style={{ ...signlearnoText, color: theme.colors.red, marginBottom: 16 }}>{error}</div> : null}

          {/* Two-col layout: grid + detail */}
          <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
            {/* Word grid */}
            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
              {filtered.map((word) => {
                const color = theme.colors.green;
                const isSelected = selected?._id === word._id;
                return (
                  <div
                    key={word._id}
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
                      {word.text}
                    </div>
                    <div style={{ ...signlearnoUpperLabel, color: "#fff", background: color, borderRadius: 20, padding: "2px 8px", display: "inline-block", fontSize: 11 }}>
                      WORD
                    </div>
                  </div>
                );
              })}
              {loading ? <div style={{ ...signlearnoText, color: theme.colors.textMuted }}>Loading words...</div> : null}
              {filtered.length === 0 && (
                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 48, color: theme.colors.textMuted, ...signlearnoText }}>
                  No words found.
                </div>
              )}
            </div>

            {/* Detail panel */}
            {selected && (
              <div style={{ width: 360, flexShrink: 0, position: "sticky", top: 100, borderRadius: theme.radius.card, border: `2px solid ${theme.colors.border}`, background: theme.colors.surface, overflow: "hidden" }}>
                <div style={{ background: theme.colors.green, padding: "20px 24px" }}>
                  <div style={{ ...signlearnoText, fontSize: 28, fontWeight: 900, color: "#fff" }}>{selected.text}</div>
                  <div style={{ ...signlearnoUpperLabel, color: "rgba(255,255,255,0.8)", marginTop: 4 }}>Dictionary Word</div>
                </div>
                <div style={{ padding: 20 }}>
                  <p style={{ ...signlearnoText, fontSize: 15, color: theme.colors.textMuted, lineHeight: "24px", marginBottom: 16 }}>
                    Preview video from translator API.
                  </p>
                  <div style={{ borderRadius: 10, overflow: "hidden", background: "#000" }}>
                    <iframe
                      key={selected.videoUrl}
                      src={`${selected.videoUrl}${selected.videoUrl.includes("?") ? "&" : "?"}autoplay=1&mute=1&rel=0`}
                      title={`Sign for ${selected.text}`}
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
