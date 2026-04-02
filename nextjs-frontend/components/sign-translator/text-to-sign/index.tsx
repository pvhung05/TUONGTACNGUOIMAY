"use client";

import { useState } from "react";
import { Clock3, SendHorizontal } from "lucide-react";
import { signlearnoTheme as theme, signlearnoText, signlearnoUpperLabel } from "@/components/signlearno/theme";
import { TOOL_WIDTH, TEXT_TO_SIGN_PLACEHOLDER } from "../constants";
import { translateTextToSign } from "@/lib/api/sign-translation";
import type { TextToSignResult } from "@/lib/types";

export function TextToSignExperience() {
  const [inputText, setInputText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [translation, setTranslation] = useState<TextToSignResult | null>(null);
  const [videoPlaybackError, setVideoPlaybackError] = useState<string | null>(null);
  const [recentPhrases, setRecentPhrases] = useState([
    "How are you today?",
    "Nice to meet you",
    "I love you",
    "Where is the exit?",
  ]);

  const runTranslation = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      setTranslation(null);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setVideoPlaybackError(null);

    try {
      const response = await translateTextToSign(trimmed, {
        spokenLanguage: "en",
        signedLanguage: "ase",
      });
      setTranslation(response.result);
      setRecentPhrases((current) => {
        const next = [trimmed, ...current.filter((item) => item !== trimmed)];
        return next.slice(0, 6);
      });
    } catch (nextError) {
      const message =
        nextError instanceof Error ? nextError.message : "Unable to reach the translation API.";
      setError(message);
      setTranslation(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section style={{ width: TOOL_WIDTH, margin: "0 auto" }}>
      <div
        style={{
          borderRadius: 30,
          overflow: "hidden",
          border: `2px solid ${theme.colors.border}`,
          background: theme.colors.surface,
          boxShadow: "0 24px 48px rgba(15, 23, 42, 0.08)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        <section style={{ padding: 36 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: theme.colors.green, ...signlearnoUpperLabel }}>Type Message</span>
            <span style={{ color: theme.colors.textMuted, fontSize: 14, lineHeight: "18px", fontWeight: 700, ...signlearnoText }}>
              Input
            </span>
          </div>

          <textarea
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
            placeholder={TEXT_TO_SIGN_PLACEHOLDER}
            style={{
              marginTop: 26,
              width: "100%",
              minHeight: 420,
              borderRadius: 24,
              border: "none",
              background: "linear-gradient(180deg, rgba(229, 247, 215, 0.38) 0%, rgba(221, 244, 255, 0.22) 100%)",
              padding: 24,
              color: theme.colors.textStrong,
              fontSize: 22,
              lineHeight: "32px",
              fontWeight: 500,
              resize: "none",
              outline: "none",
              boxSizing: "border-box",
              ...signlearnoText,
            }}
          />

          <div style={{ marginTop: 24, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18 }}>
            <span style={{ color: theme.colors.textMuted, fontSize: 15, lineHeight: "20px", fontWeight: 700, ...signlearnoText }}>
              {inputText.trim().length} / 500
            </span>

            <button
              type="button"
              disabled={isSubmitting || !inputText.trim()}
              onClick={() => { void runTranslation(inputText); }}
              style={{
                height: 72,
                padding: "0 30px",
                borderRadius: 24,
                border: "none",
                background: theme.colors.green,
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                gap: 14,
                cursor: isSubmitting || !inputText.trim() ? "not-allowed" : "pointer",
                opacity: isSubmitting || !inputText.trim() ? 0.7 : 1,
                boxShadow: "inset 0 -5px 0 rgba(0,0,0,0.18)",
                fontSize: 20,
                lineHeight: "24px",
                fontWeight: 800,
                ...signlearnoText,
              }}
            >
              {isSubmitting ? "Translating..." : "Translate"}
              <SendHorizontal size={22} />
            </button>
          </div>
        </section>

        <section style={{ padding: 0, background: "linear-gradient(180deg, rgba(229, 247, 215, 0.88) 0%, rgba(255,255,255,0.98) 100%)", color: theme.colors.textStrong, display: "flex", overflow: "hidden" }}>
          <div style={{ position: "relative", flex: 1, background: "linear-gradient(180deg, rgba(229, 247, 215, 0.94) 0%, rgba(255,255,255,0.98) 100%)", boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.08)", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 22, borderRadius: 22, background: "#FFFFFF", border: "2px solid rgba(88, 204, 2, 0.18)", boxShadow: "inset 0 0 0 1px rgba(88, 204, 2, 0.05)", padding: 26, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 18, justifyContent: translation ? "flex-start" : "center" }}>
              {translation ? (
                <>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                    <div>
                      <div style={{ color: theme.colors.green, ...signlearnoUpperLabel }}>Generated Sign Video</div>
                      <div style={{ marginTop: 10, color: theme.colors.textStrong, fontSize: 18, lineHeight: "28px", fontWeight: 700, ...signlearnoText }}>
                        {translation.normalized_text || "No text submitted"}
                      </div>
                    </div>
                    <div style={{ flexShrink: 0, borderRadius: 999, padding: "10px 14px", border: "2px solid rgba(88, 204, 2, 0.14)", background: "linear-gradient(180deg, rgba(229, 247, 215, 0.62) 0%, rgba(255,255,255,0.95) 100%)", color: theme.colors.green, fontSize: 13, lineHeight: "18px", fontWeight: 800, ...signlearnoUpperLabel }}>
                      Ready To Play
                    </div>
                  </div>

                  <div style={{ flex: 1, minHeight: 0, borderRadius: 20, border: "2px solid rgba(88, 204, 2, 0.18)", background: "linear-gradient(180deg, rgba(221, 244, 255, 0.24) 0%, rgba(255,255,255,1) 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, boxSizing: "border-box" }}>
                    <div style={{ width: "100%", aspectRatio: "4 / 5", borderRadius: 18, overflow: "hidden", background: "#F7FAFC", boxShadow: "0 18px 36px rgba(17, 24, 39, 0.08)" }}>
                      <video
                        key={translation.video_url}
                        src={translation.video_url}
                        controls autoPlay loop muted playsInline
                        onError={() => setVideoPlaybackError("The generated sign video could not be played in this browser.")}
                        style={{ width: "100%", height: "100%", display: "block", objectFit: "contain", background: "#F7FAFC" }}
                      />
                    </div>
                  </div>

                  {videoPlaybackError ? (
                    <div style={{ color: theme.colors.red, fontSize: 14, lineHeight: "22px", fontWeight: 700, ...signlearnoText }}>
                      {videoPlaybackError}
                    </div>
                  ) : null}
                </>
              ) : (
                <div style={{ textAlign: "center", color: error ? theme.colors.red : theme.colors.textMuted, fontSize: 20, lineHeight: "30px", fontWeight: 700, padding: "0 24px", ...signlearnoText }}>
                  {error || "Your translated sign video will appear here."}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <section style={{ marginTop: 24, padding: 28, borderRadius: 30, background: theme.colors.surface, border: `2px solid ${theme.colors.border}`, boxShadow: "0 24px 48px rgba(15, 23, 42, 0.08)", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Clock3 size={20} color={theme.colors.green} />
            <span style={{ color: theme.colors.green, ...signlearnoUpperLabel }}>Recently Translated</span>
          </div>
          <button type="button" onClick={() => setRecentPhrases([])} style={{ border: "none", background: "transparent", color: theme.colors.green, cursor: "pointer", fontSize: 16, lineHeight: "22px", fontWeight: 700, ...signlearnoText }}>
            Clear
          </button>
        </div>

        <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 12 }}>
          {recentPhrases.map((phrase) => (
            <button
              key={phrase}
              type="button"
              onClick={() => { setInputText(phrase); void runTranslation(phrase); }}
              style={{ padding: "15px 18px", borderRadius: 999, border: `2px solid ${theme.colors.border}`, background: "linear-gradient(180deg, rgba(229, 247, 215, 0.28) 0%, rgba(255,255,255,0.92) 100%)", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", color: theme.colors.textStrong, fontSize: 16, lineHeight: "22px", fontWeight: 500, ...signlearnoText, textAlign: "left" }}
            >
              <span>&ldquo;{phrase}&rdquo;</span>
            </button>
          ))}
        </div>
      </section>
    </section>
  );
}
