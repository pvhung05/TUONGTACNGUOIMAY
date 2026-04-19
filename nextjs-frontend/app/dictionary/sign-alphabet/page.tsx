"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { signlearnoTheme as theme, signlearnoText, signlearnoUpperLabel } from "@/components/signlearno/theme";
import { getAlphabetSignVideos, getNumberSignVideos } from "@/lib/api";
import type { SignVideoItem } from "@/lib/api/backend";
import alphabetA from "@/components/assets/alphabets/a.jpg";
import alphabetB from "@/components/assets/alphabets/b.jpg";
import alphabetC from "@/components/assets/alphabets/c.jpg";
import alphabetD from "@/components/assets/alphabets/d.jpg";
import alphabetE from "@/components/assets/alphabets/e.jpg";
import alphabetF from "@/components/assets/alphabets/f.jpg";
import alphabetG from "@/components/assets/alphabets/g.jpg";
import alphabetH from "@/components/assets/alphabets/h.jpg";
import alphabetI from "@/components/assets/alphabets/i.jpg";
import alphabetJ from "@/components/assets/alphabets/j.jpg";
import alphabetK from "@/components/assets/alphabets/k.jpg";
import alphabetL from "@/components/assets/alphabets/l.jpg";
import alphabetM from "@/components/assets/alphabets/m.jpg";
import alphabetN from "@/components/assets/alphabets/n.jpg";
import alphabetO from "@/components/assets/alphabets/o.jpg";
import alphabetP from "@/components/assets/alphabets/p.jpg";
import alphabetQ from "@/components/assets/alphabets/q.jpg";
import alphabetR from "@/components/assets/alphabets/r.jpg";
import alphabetS from "@/components/assets/alphabets/s.jpg";
import alphabetT from "@/components/assets/alphabets/t.jpg";
import alphabetU from "@/components/assets/alphabets/u.jpg";
import alphabetV from "@/components/assets/alphabets/v.jpg";
import alphabetW from "@/components/assets/alphabets/w.jpg";
import alphabetX from "@/components/assets/alphabets/x.jpg";
import alphabetY from "@/components/assets/alphabets/y.jpg";
import alphabetZ from "@/components/assets/alphabets/z.jpg";
import number1 from "@/components/assets/numbers/1.jpg";
import number2 from "@/components/assets/numbers/2.jpg";
import number3 from "@/components/assets/numbers/3.jpg";
import number4 from "@/components/assets/numbers/4.jpg";
import number5 from "@/components/assets/numbers/5.jpg";
import number6 from "@/components/assets/numbers/6.jpg";
import number7 from "@/components/assets/numbers/7.jpg";
import number8 from "@/components/assets/numbers/8.jpg";
import number9 from "@/components/assets/numbers/9.jpg";
import number10 from "@/components/assets/numbers/10.jpg";
import number11 from "@/components/assets/numbers/11.jpg";
import number12 from "@/components/assets/numbers/12.jpg";
import number13 from "@/components/assets/numbers/13.jpg";
import number14 from "@/components/assets/numbers/14.jpg";
import number15 from "@/components/assets/numbers/15.jpg";
import number16 from "@/components/assets/numbers/16.jpg";
import number17 from "@/components/assets/numbers/17.jpg";
import number18 from "@/components/assets/numbers/18.jpg";
import number19 from "@/components/assets/numbers/19.jpg";
import number20 from "@/components/assets/numbers/20.jpg";

type SignSet = "letters" | "numbers";

type VideoItem = {
  title: string;
  url: string;
};

const LETTER_SIGNS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const NUMBER_SIGNS = Array.from({ length: 20 }, (_, index) => String(index + 1));

const LETTER_SIGN_IMAGES: Record<string, string | null> = {
  A: alphabetA.src,
  B: alphabetB.src,
  C: alphabetC.src,
  D: alphabetD.src,
  E: alphabetE.src,
  F: alphabetF.src,
  G: alphabetG.src,
  H: alphabetH.src,
  I: alphabetI.src,
  J: alphabetJ.src,
  K: alphabetK.src,
  L: alphabetL.src,
  M: alphabetM.src,
  N: alphabetN.src,
  O: alphabetO.src,
  P: alphabetP.src,
  Q: alphabetQ.src,
  R: alphabetR.src,
  S: alphabetS.src,
  T: alphabetT.src,
  U: alphabetU.src,
  V: alphabetV.src,
  W: alphabetW.src,
  X: alphabetX.src,
  Y: alphabetY.src,
  Z: alphabetZ.src,
};

/** Viền + nền ô đang chọn: pha trắng để xanh tươi, không “đậm như cỏ” như greenDark */
const SYMBOL_TILE_ACTIVE_BORDER =
  "color-mix(in srgb, var(--signlearno-green) 78%, #ffffff)";
const SYMBOL_TILE_ACTIVE_FILL =
  "color-mix(in srgb, var(--signlearno-green) 68%, #ffffff)";

const NUMBER_SIGN_IMAGES: Record<string, string> = {
  "1": number1.src,
  "2": number2.src,
  "3": number3.src,
  "4": number4.src,
  "5": number5.src,
  "6": number6.src,
  "7": number7.src,
  "8": number8.src,
  "9": number9.src,
  "10": number10.src,
  "11": number11.src,
  "12": number12.src,
  "13": number13.src,
  "14": number14.src,
  "15": number15.src,
  "16": number16.src,
  "17": number17.src,
  "18": number18.src,
  "19": number19.src,
  "20": number20.src,
};

function getWordLabel(word: SignVideoItem): string {
  return String(word.name || "").trim();
}

/** Bỏ tiền tố kỹ thuật kiểu signvideo:access — chỉ giữ phần hiển thị cho người dùng */
function formatSignVideoDisplayName(raw: string, fallback: string): string {
  let s = String(raw || "").trim();
  if (!s) return fallback;
  s = s.replace(/^signvideo:\s*/i, "");
  s = s.replace(/^sign_video:\s*/i, "");
  s = s.replace(/^[:_\s]+/, "").trim();
  if (!s) return fallback;
  return s;
}

/** Không hiển thị các nhãn kỹ thuật đơn lẻ kiểu "access", "video" */
const BLOCKED_WORD_LABELS = new Set(["access", "video", "clip", "sign", "default", "preview"]);

function isBlockedWordLabel(label: string): boolean {
  return BLOCKED_WORD_LABELS.has(label.trim().toLowerCase());
}

/** Tiêu đề hiển thị cho một mục từ điển — tránh chỉ còn "access" sau khi strip */
function getDisplayTitleForWord(word: SignVideoItem, symbol: string): string {
  const nameClean = formatSignVideoDisplayName(getWordLabel(word), "");
  if (nameClean && !isBlockedWordLabel(nameClean)) {
    return nameClean;
  }
  const groupClean = formatSignVideoDisplayName(String(word.group || "").trim(), "");
  if (groupClean && !isBlockedWordLabel(groupClean)) {
    return groupClean;
  }
  return symbol;
}

function getWordVideos(word: SignVideoItem | null, symbol: string): VideoItem[] {
  if (!word) return [];
  const url = String(word.url || "").trim();
  if (!url) return [];
  const title = getDisplayTitleForWord(word, symbol);
  return [{ title, url }];
}

function rankByPrefix(words: SignVideoItem[], symbol: string): SignVideoItem[] {
  const normalized = symbol.toLowerCase();

  const startsWith = words.filter((word) => getWordLabel(word).toLowerCase().startsWith(normalized));
  const includes = words.filter((word) => {
    const label = getWordLabel(word).toLowerCase();
    return !label.startsWith(normalized) && label.includes(normalized);
  });

  return [...startsWith, ...includes];
}

function isDirectVideoUrl(url: string): boolean {
  const normalized = String(url || "").trim().toLowerCase();
  return /\.(mp4|webm|ogg)(\?|#|$)/.test(normalized) || normalized.includes("/video/upload/");
}

export default function SignAlphabetPage() {
  const [signSet, setSignSet] = useState<SignSet>("letters");
  const [hoveredSignSet, setHoveredSignSet] = useState<SignSet | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState("A");
  const [words, setWords] = useState<SignVideoItem[]>([]);
  const [selectedWord, setSelectedWord] = useState<SignVideoItem | null>(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [relatedWordsFilter, setRelatedWordsFilter] = useState("");

  /** Giống cột video Text to Sign — gradient đậm hơn color-mix panel trái nên không bị trông như nền trắng */
  const videoSurfaceBg =
    "linear-gradient(180deg, var(--signlearno-soft-gradient-start) 0%, var(--signlearno-soft-gradient-end) 100%)";

  const availableSymbols = useMemo(() => (signSet === "letters" ? LETTER_SIGNS : NUMBER_SIGNS), [signSet]);
  const filteredRelatedWords = useMemo(() => {
    const q = relatedWordsFilter.trim().toLowerCase();
    if (!q) return words;
    return words.filter((w) => {
      const label = getDisplayTitleForWord(w, selectedSymbol).toLowerCase();
      const group = String(w.group || "").toLowerCase();
      const name = String(w.name || "").toLowerCase();
      return label.includes(q) || group.includes(q) || name.includes(q);
    });
  }, [words, relatedWordsFilter, selectedSymbol]);
  const selectedWordVideos = useMemo(() => getWordVideos(selectedWord, selectedSymbol), [selectedWord, selectedSymbol]);

  useEffect(() => {
    if (availableSymbols.includes(selectedSymbol)) return;
    setSelectedSymbol(availableSymbols[0]);
  }, [availableSymbols, selectedSymbol]);

  useEffect(() => {
    setRelatedWordsFilter("");
  }, [selectedSymbol, signSet]);

  useEffect(() => {
    const q = relatedWordsFilter.trim();
    if (!q) return;
    if (filteredRelatedWords.length === 0) {
      setSelectedWord(null);
      return;
    }
    if (!selectedWord || !filteredRelatedWords.some((w) => w.id === selectedWord.id)) {
      setSelectedWord(filteredRelatedWords[0]);
    }
  }, [relatedWordsFilter, filteredRelatedWords, selectedWord]);

  useEffect(() => {
    if (selectedWordVideos.length === 0) {
      setActiveVideoUrl("");
      return;
    }

    const stillExists = selectedWordVideos.some((video) => video.url === activeVideoUrl);
    if (!stillExists) {
      setActiveVideoUrl(selectedWordVideos[0].url);
    }
  }, [selectedWordVideos, activeVideoUrl]);

  useEffect(() => {
    if (signSet !== "letters") {
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAlphabetSignVideos(selectedSymbol);
        const incoming = Array.isArray(response) ? response : [];
        const ranked = rankByPrefix(incoming, selectedSymbol);
        setWords(ranked);
        setSelectedWord(ranked[0] || null);
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : "Failed to load symbols.");
        setWords([]);
        setSelectedWord(null);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [signSet, selectedSymbol]);

  useEffect(() => {
    if (signSet !== "numbers") {
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const source = await getNumberSignVideos(selectedSymbol);
        const nextWords = Array.isArray(source) ? source : [];
        setWords(nextWords);
        setSelectedWord(nextWords[0] || null);
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : "Failed to load symbols.");
        setWords([]);
        setSelectedWord(null);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [signSet, selectedSymbol]);

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
          <div className="w-full">
            <div
              style={{
                borderRadius: 30,
                overflow: "hidden",
                border: `2px solid ${theme.colors.border}`,
                background: "transparent",
                boxShadow: "0 24px 48px rgba(15, 23, 42, 0.08)",
              }}
            >
              {/* 1 — Chọn ký hiệu: cùng gradient với hai nửa dưới (không dùng surface trắng) */}
              <div
                style={{
                  padding: "24px",
                  borderBottom: `2px solid ${theme.colors.border}`,
                  background: videoSurfaceBg,
                }}
              >
                <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
                  <div className="inline-flex rounded-2xl p-1" style={{ background: theme.colors.greenSoft }}>
                <button
                  type="button"
                  onClick={() => {
                    setSignSet("letters");
                    setSelectedSymbol("A");
                  }}
                  onMouseEnter={() => setHoveredSignSet("letters")}
                  onMouseLeave={() => setHoveredSignSet(null)}
                  className="rounded-xl px-4 py-2 text-sm font-semibold"
                  style={{
                    background: signSet === "letters" ? theme.colors.green : "transparent",
                    color: signSet === "letters" ? theme.colors.surface : hoveredSignSet === "letters" ? theme.colors.green : theme.colors.textStrong,
                    transition: "color 180ms ease",
                  }}
                >
                  LETTER SIGNS
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSignSet("numbers");
                    setSelectedSymbol("1");
                  }}
                  onMouseEnter={() => setHoveredSignSet("numbers")}
                  onMouseLeave={() => setHoveredSignSet(null)}
                  className="rounded-xl px-4 py-2 text-sm font-semibold"
                  style={{
                    background: signSet === "numbers" ? theme.colors.green : "transparent",
                    color: signSet === "numbers" ? theme.colors.surface : hoveredSignSet === "numbers" ? theme.colors.green : theme.colors.textStrong,
                    transition: "color 180ms ease",
                  }}
                >
                  NUMBER SIGNS
                </button>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-3 sm:grid-cols-8 lg:grid-cols-10">
              {availableSymbols.map((symbol) => {
                const active = symbol === selectedSymbol;
                const mediaSrc = signSet === "letters" ? LETTER_SIGN_IMAGES[symbol] : NUMBER_SIGN_IMAGES[symbol];
                return (
                  <button
                    key={symbol}
                    type="button"
                    onClick={() => setSelectedSymbol(symbol)}
                    className="aspect-square overflow-hidden rounded-2xl border-2 transition"
                    style={{
                      borderColor: active ? SYMBOL_TILE_ACTIVE_BORDER : theme.colors.border,
                      background: active ? SYMBOL_TILE_ACTIVE_FILL : "var(--signlearno-glass)",
                      boxShadow: active
                        ? "0 8px 24px color-mix(in srgb, var(--signlearno-green) 35%, transparent)"
                        : "0 2px 10px rgba(15, 23, 42, 0.06)",
                      transform: "translateY(0)",
                      filter: "none",
                      transition: "transform 180ms ease, box-shadow 180ms ease, filter 180ms ease",
                    }}
                    onMouseEnter={(event) => {
                      event.currentTarget.style.transform = "translateY(-3px)";
                      event.currentTarget.style.boxShadow = active
                        ? "0 12px 28px color-mix(in srgb, var(--signlearno-green) 42%, transparent)"
                        : "0 8px 20px rgba(15, 23, 42, 0.1)";
                      event.currentTarget.style.filter = "brightness(1.03)";
                    }}
                    onMouseLeave={(event) => {
                      event.currentTarget.style.transform = "translateY(0)";
                      event.currentTarget.style.boxShadow = active
                        ? "0 8px 24px color-mix(in srgb, var(--signlearno-green) 35%, transparent)"
                        : "0 2px 10px rgba(15, 23, 42, 0.06)";
                      event.currentTarget.style.filter = "none";
                    }}
                    aria-label={`Select sign ${symbol}`}
                  >
                    <span style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
                      <span style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "var(--signlearno-glass)" }}>
                        {mediaSrc ? (
                          <img
                            src={mediaSrc}
                            alt={`${symbol} sign`}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          />
                        ) : (
                          <span style={{ fontSize: 22, fontWeight: 800, color: theme.colors.textStrong }}>{symbol}</span>
                        )}
                      </span>
                      <span
                        style={{
                          height: 28,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 14,
                          fontWeight: 800,
                          background: active ? theme.colors.green : "color-mix(in srgb, var(--signlearno-grid) 65%, transparent)",
                          color: active ? theme.colors.surface : theme.colors.textStrong,
                          borderTop: `1px solid ${active ? "color-mix(in srgb, var(--signlearno-green) 72%, #ffffff)" : theme.colors.border}`,
                          ...signlearnoText,
                        }}
                      >
                        {symbol}
                      </span>
                    </span>
                  </button>
                );
              })}
                </div>
                </div>
              </div>

              {error ? (
                <div
                  style={{
                    padding: "14px 24px",
                    borderBottom: `2px solid ${theme.colors.border}`,
                    background: "#fff5f5",
                    color: theme.colors.red,
                    fontSize: 14,
                    fontWeight: 700,
                    ...signlearnoText,
                  }}
                >
                  {error}
                </div>
              ) : null}

              {/* 2–3 — Related Words | Preview — cột trái hẹp (chỉ từ), video chiếm phần lớn */}
              <div
                className="grid grid-cols-1 gap-0 lg:h-[600px] lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]"
                style={{ alignItems: "stretch" }}
              >
              {/* Trái — Related Words (gradient giống panel Text to Sign) */}
              <div
                className="flex h-auto min-h-0 min-w-0 flex-col border-b-2 p-3 text-card-foreground sm:p-4 lg:h-full lg:border-b-0 lg:border-r-2"
                style={{ borderColor: theme.colors.border, background: videoSurfaceBg }}
              >
                <div className="mb-2 flex shrink-0 items-center justify-between gap-1.5 sm:mb-3 sm:gap-2">
                  <span
                    style={{
                      color: theme.colors.green,
                      ...signlearnoUpperLabel,
                      fontSize: 14,
                      lineHeight: "18px",
                      letterSpacing: 0.65,
                    }}
                  >
                    Related Words
                  </span>
                  <span
                    className="shrink-0 rounded-full px-2.5 py-1 text-xs font-black sm:px-3 sm:py-1.5 sm:text-[13px]"
                    style={{ background: theme.colors.greenSoft, color: theme.colors.greenDark }}
                  >
                    {relatedWordsFilter.trim() ? `${filteredRelatedWords.length}/${words.length}` : `${words.length} results`}
                  </span>
                </div>

                {!loading && words.length > 0 ? (
                  <div className="relative mb-2 shrink-0 sm:mb-3">
                    <Search
                      size={15}
                      strokeWidth={2.5}
                      className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2"
                      style={{ color: theme.colors.textMuted }}
                      aria-hidden
                    />
                    <input
                      type="search"
                      value={relatedWordsFilter}
                      onChange={(e) => setRelatedWordsFilter(e.target.value)}
                      placeholder="Search words…"
                      autoComplete="off"
                      className="w-full rounded-lg border py-2 pl-8 pr-2.5 text-[13px] font-semibold outline-none ring-0 transition-shadow focus-visible:shadow-[0_0_0_3px_var(--signlearno-focus)] sm:rounded-xl sm:py-2.5 sm:pl-9 sm:text-sm"
                      style={{
                        borderColor: theme.colors.border,
                        background: theme.colors.surface,
                        color: theme.colors.textStrong,
                        ...signlearnoText,
                      }}
                    />
                  </div>
                ) : null}

                {loading ? (
                  <div
                    className="rounded-2xl border-2 px-4 py-5 text-sm font-bold"
                    style={{
                      borderColor: theme.colors.border,
                      color: theme.colors.textMuted,
                      background: "var(--signlearno-glass)",
                      ...signlearnoText,
                    }}
                  >
                    Loading dictionary videos...
                  </div>
                ) : null}

                {!loading && words.length === 0 ? (
                  <div
                    className="rounded-2xl border-2 px-4 py-5 text-sm font-bold"
                    style={{
                      borderColor: theme.colors.border,
                      color: theme.colors.textMuted,
                      background: "var(--signlearno-glass)",
                      ...signlearnoText,
                    }}
                  >
                    No words found for this symbol.
                  </div>
                ) : null}

                {!loading && words.length > 0 ? (
                  <div
                    className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-0.5 max-h-[min(520px,calc(100vh-280px))] lg:max-h-none sm:gap-2.5"
                    style={{
                      scrollbarWidth: "thin",
                      scrollbarColor: `${theme.colors.border} transparent`,
                    }}
                  >
                    {filteredRelatedWords.length === 0 ? (
                      <div
                        className="rounded-xl border px-3 py-4 text-center text-[13px] font-bold leading-snug sm:text-sm"
                        style={{
                          borderColor: theme.colors.border,
                          color: theme.colors.textMuted,
                          background: "var(--signlearno-glass)",
                          ...signlearnoText,
                        }}
                      >
                        No matches for your search.
                      </div>
                    ) : (
                      filteredRelatedWords.map((word) => {
                        const wordLabel = getDisplayTitleForWord(word, selectedSymbol);
                        const isActive = selectedWord?.id === word.id;

                        return (
                          <button
                            key={word.id}
                            type="button"
                            onClick={() => setSelectedWord(word)}
                            className="flex w-full min-w-0 shrink-0 items-center rounded-xl text-left transition-colors duration-150 sm:rounded-2xl"
                            style={{
                              boxSizing: "border-box",
                              minHeight: 44,
                              padding: "11px 14px",
                              border: `1px solid ${theme.colors.border}`,
                              background: isActive ? theme.colors.green : "var(--signlearno-glass)",
                              color: isActive ? theme.colors.surface : theme.colors.textStrong,
                              fontSize: 15,
                              lineHeight: 1.35,
                              fontWeight: 700,
                              ...signlearnoText,
                            }}
                            title={wordLabel}
                          >
                            <span className="min-w-0 flex-1 truncate">{wordLabel}</span>
                          </button>
                        );
                      })
                    )}
                  </div>
                ) : null}
              </div>

              {/* Phải — preview (nền gradient giống cột video Text to Sign) */}
              <div className="flex min-h-0 min-w-0 flex-col lg:min-h-[600px]" style={{ background: videoSurfaceBg }}>
                {selectedWord ? (
                  <>
                    <div className="relative flex min-h-[280px] flex-1 flex-col overflow-hidden bg-black lg:min-h-0">
                      <div className="relative min-h-0 flex-1 overflow-hidden">
                        <div
                          style={{
                            position: "absolute",
                            top: 24,
                            left: 24,
                            zIndex: 2,
                            color: theme.colors.green,
                            textShadow: "0 1px 0 color-mix(in srgb, var(--signlearno-elevated) 75%, transparent)",
                            ...signlearnoUpperLabel,
                          }}
                        >
                          Sign preview
                        </div>
                        {activeVideoUrl ? (
                          isDirectVideoUrl(activeVideoUrl) ? (
                            <video
                              key={activeVideoUrl}
                              src={activeVideoUrl}
                              controls
                              autoPlay
                              muted
                              playsInline
                              style={{
                                position: "absolute",
                                inset: 0,
                                width: "100%",
                                height: "100%",
                                border: "none",
                                display: "block",
                                objectFit: "cover",
                                background: "#000",
                              }}
                            />
                          ) : (
                            <iframe
                              key={activeVideoUrl}
                              src={`${activeVideoUrl}${activeVideoUrl.includes("?") ? "&" : "?"}autoplay=1&mute=1&rel=0`}
                              title="Sign video"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                              allowFullScreen
                              style={{
                                position: "absolute",
                                inset: 0,
                                width: "100%",
                                height: "100%",
                                border: "none",
                                display: "block",
                              }}
                            />
                          )
                        ) : (
                          <div
                            className="flex h-full min-h-[200px] items-center justify-center px-6 text-center text-sm font-bold"
                            style={{ color: theme.colors.textSoft, ...signlearnoText }}
                          >
                            No playable video for this entry.
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedWordVideos.length > 1 ? (
                      <div
                        style={{
                          padding: "12px 16px",
                          borderTop: "2px solid rgba(88, 204, 2, 0.16)",
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 8,
                          alignItems: "center",
                          background: "var(--signlearno-glass)",
                          boxSizing: "border-box",
                        }}
                      >
                        {selectedWordVideos.map((video) => {
                          const isVideoActive = video.url === activeVideoUrl;
                          return (
                            <button
                              key={`${video.title}-${video.url}`}
                              type="button"
                              onClick={() => setActiveVideoUrl(video.url)}
                              style={{
                                padding: "8px 12px",
                                borderRadius: 999,
                                border: `2px solid ${isVideoActive ? theme.colors.green : theme.colors.border}`,
                                background: isVideoActive ? theme.colors.greenSoft : "var(--signlearno-glass)",
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                                color: theme.colors.textStrong,
                                fontSize: 13,
                                lineHeight: "18px",
                                fontWeight: 700,
                                ...signlearnoText,
                                whiteSpace: "nowrap",
                                maxWidth: "100%",
                              }}
                            >
                              <span className="truncate">{video.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    ) : null}
                  </>
                ) : (
                  <div
                    className="flex min-h-[280px] flex-1 items-center justify-center px-6 text-center lg:min-h-0"
                    style={{
                      background: videoSurfaceBg,
                      color: theme.colors.textMuted,
                      fontSize: 16,
                      fontWeight: 700,
                      ...signlearnoText,
                    }}
                  >
                    Pick a related word on the left to preview the sign video.
                  </div>
                )}
              </div>
            </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
