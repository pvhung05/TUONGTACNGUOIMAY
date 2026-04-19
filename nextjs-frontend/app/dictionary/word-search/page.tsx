"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { signlearnoTheme as theme, signlearnoText, signlearnoUpperLabel } from "@/components/signlearno/theme";
import { getDictionaryEntries } from "@/lib/api";
import type { TranslatorWord } from "@/lib/api/backend";

type VideoItem = {
  title: string;
  url: string;
};

function getWordLabel(word: TranslatorWord): string {
  return String(word.title || word.text || "").trim();
}

function getWordVideos(word: TranslatorWord | null): VideoItem[] {
  if (!word) return [];

  if (Array.isArray(word.videos) && word.videos.length > 0) {
    return word.videos
      .map((video) => ({
        title: String(video.title || getWordLabel(word)).trim() || getWordLabel(word),
        url: String(video.url || "").trim(),
      }))
      .filter((video) => video.url);
  }

  if (word.videoUrl) {
    return [{ title: getWordLabel(word), url: word.videoUrl }];
  }

  return [];
}

function isDirectVideoUrl(url: string): boolean {
  const normalized = String(url || "").trim().toLowerCase();
  return /\.(mp4|webm|ogg)(\?|#|$)/.test(normalized) || normalized.includes("/video/upload/");
}

export default function WordSearchPage() {
  const [searchWord, setSearchWord] = useState("");
  const [words, setWords] = useState<TranslatorWord[]>([]);
  const [selectedWord, setSelectedWord] = useState<TranslatorWord | null>(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [relatedWordsFilter, setRelatedWordsFilter] = useState("");

  const videoSurfaceBg =
    "linear-gradient(180deg, var(--signlearno-soft-gradient-start) 0%, var(--signlearno-soft-gradient-end) 100%)";

  const selectedWordVideos = useMemo(() => getWordVideos(selectedWord), [selectedWord]);

  const filteredRelatedWords = useMemo(() => {
    const q = relatedWordsFilter.trim().toLowerCase();
    if (!q) return words;
    return words.filter((w) => {
      const label = getWordLabel(w).toLowerCase();
      return label.includes(q);
    });
  }, [words, relatedWordsFilter]);

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
    const q = relatedWordsFilter.trim();
    if (!q) return;
    if (filteredRelatedWords.length === 0) {
      setSelectedWord(null);
      return;
    }
    if (!selectedWord || !filteredRelatedWords.some((w) => w._id === selectedWord._id)) {
      setSelectedWord(filteredRelatedWords[0]);
    }
  }, [relatedWordsFilter, filteredRelatedWords, selectedWord]);

  useEffect(() => {
    setRelatedWordsFilter("");
  }, [searchWord]);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      const query = searchWord.trim();

      if (!query) {
        setWords([]);
        setSelectedWord(null);
        setError(null);
        setLoading(false);
        return;
      }

      const load = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await getDictionaryEntries(query, 80);
          const incomingWords = Array.isArray(response.words) ? response.words : [];
          setWords(incomingWords);
          setSelectedWord(incomingWords[0] || null);
        } catch (nextError) {
          setError(nextError instanceof Error ? nextError.message : "Failed to load words.");
          setWords([]);
          setSelectedWord(null);
        } finally {
          setLoading(false);
        }
      };

      void load();
    }, 320);

    return () => window.clearTimeout(timerId);
  }, [searchWord]);

  return (
    <>
      <main
        className="box-border flex flex-col overflow-x-hidden pt-[88px] max-lg:min-h-[100dvh] max-lg:overflow-y-auto lg:h-[100dvh] lg:overflow-hidden"
        style={{
          minHeight: 0,
          background: "transparent",
        }}
      >
        <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col px-4 pb-3 pt-1 sm:px-6 sm:pb-4 sm:pt-2 lg:px-8">
          <div className="flex min-h-0 w-full flex-1 flex-col">
            <div
              className="flex min-h-0 flex-1 flex-col overflow-hidden"
              style={{
                borderRadius: 30,
                border: `2px solid ${theme.colors.border}`,
                background: "transparent",
                boxShadow: "0 24px 48px rgba(15, 23, 42, 0.08)",
              }}
            >
              {/* Tìm kiếm — cùng gradient với khối dưới */}
              <div
                className="shrink-0"
                style={{
                  padding: "16px 20px",
                  borderBottom: `2px solid ${theme.colors.border}`,
                  background: videoSurfaceBg,
                }}
              >
                <div className="flex flex-col gap-2 sm:gap-3">
                  <div>
                    <span
                      style={{
                        color: theme.colors.green,
                        ...signlearnoUpperLabel,
                        fontSize: 14,
                        lineHeight: "18px",
                        letterSpacing: 0.65,
                      }}
                    >
                      Search by word
                    </span>
                    <p className="mt-1 text-sm font-semibold" style={{ color: theme.colors.textMuted, ...signlearnoText }}>
                      Type below and choose a result from Related Words.
                    </p>
                  </div>
                  <div className="relative">
                    <Search
                      size={17}
                      strokeWidth={2.5}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color: theme.colors.textMuted }}
                      aria-hidden
                    />
                    <input
                      value={searchWord}
                      onChange={(event) => setSearchWord(event.target.value)}
                      placeholder="Type a word, phrase, or number..."
                      autoComplete="off"
                      className="w-full rounded-xl border-2 py-2.5 pl-11 pr-4 text-[15px] font-semibold outline-none ring-0 transition-shadow focus-visible:shadow-[0_0_0_3px_var(--signlearno-focus)] sm:py-3 sm:text-base"
                      style={{
                        borderColor: theme.colors.border,
                        background: theme.colors.surface,
                        color: theme.colors.textStrong,
                        ...signlearnoText,
                      }}
                    />
                  </div>
                </div>
              </div>

              {error ? (
                <div
                  className="shrink-0"
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

              {/* Related Words | Preview — flex-1 để vừa viewport, scroll chỉ trong list */}
              <div
                className="grid min-h-0 flex-1 grid-cols-1 gap-0 max-lg:min-h-[min(60vh,520px)] lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]"
                style={{ alignItems: "stretch" }}
              >
                <div
                  className="flex min-h-0 min-w-0 flex-col border-b-2 p-3 text-card-foreground sm:p-4 max-lg:max-h-[min(42vh,380px)] lg:h-full lg:max-h-none lg:border-b-0 lg:border-r-2"
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

                  {!loading && searchWord.trim() && words.length === 0 ? (
                    <div
                      className="rounded-2xl border-2 px-4 py-5 text-sm font-bold"
                      style={{
                        borderColor: theme.colors.border,
                        color: theme.colors.textMuted,
                        background: "var(--signlearno-glass)",
                        ...signlearnoText,
                      }}
                    >
                      No words found for your search.
                    </div>
                  ) : null}

                  {!loading && !searchWord.trim() ? (
                    <div
                      className="rounded-2xl border-2 px-4 py-5 text-sm font-bold"
                      style={{
                        borderColor: theme.colors.border,
                        color: theme.colors.textMuted,
                        background: "var(--signlearno-glass)",
                        ...signlearnoText,
                      }}
                    >
                      Start typing above to see results.
                    </div>
                  ) : null}

                  {!loading && words.length > 0 ? (
                    <div
                      className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overscroll-contain pr-0.5 sm:gap-2.5"
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
                          const wordLabel = getWordLabel(word);
                          const isActive = selectedWord?._id === word._id;

                          return (
                            <button
                              key={word._id}
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

                <div className="flex min-h-0 min-w-0 flex-col max-lg:min-h-[min(46vh,420px)] lg:flex-1" style={{ background: videoSurfaceBg }}>
                  {selectedWord ? (
                    <>
                      <div className="relative flex min-h-[200px] flex-1 flex-col overflow-hidden bg-black sm:min-h-[240px] lg:min-h-0">
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
                                title={`Sign video ${getWordLabel(selectedWord)}`}
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
                      className="flex min-h-[min(36vh,280px)] flex-1 items-center justify-center px-6 text-center lg:min-h-0"
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
