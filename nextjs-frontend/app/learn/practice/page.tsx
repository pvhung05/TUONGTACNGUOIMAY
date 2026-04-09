"use client";

import { useEffect, useState } from "react";
import { signlearnoTheme as theme, signlearnoText } from "@/components/signlearno/theme";
import { completeLesson, getLearningHistory, getLessonById, getLessons } from "@/lib/api";
import type { Lesson } from "@/lib/api/backend";
import { UnitsGrid } from "@/components/sign-translator/learn";
import type { Unit } from "@/components/sign-translator/types";

export default function PracticePage() {
  const [practices, setPractices] = useState<Lesson[]>([]);
  const [selectedPractice, setSelectedPractice] = useState<Lesson | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<"A" | "B" | "C" | "D" | null>(null);
  const [answers, setAnswers] = useState<Record<number, "A" | "B" | "C" | "D">>({});
  const [completedPracticeIds, setCompletedPracticeIds] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getLessons("practice");
        setPractices(data);
        try {
          const histories = await getLearningHistory();
          const completedMap: Record<string, boolean> = {};
          histories.forEach((item) => {
            const lessonId = typeof item.lessonId === "string" ? item.lessonId : item.lessonId._id;
            if (lessonId) completedMap[lessonId] = true;
          });
          setCompletedPracticeIds(completedMap);
        } catch {
          // guest mode
        }
      } catch (nextError) {
        setStatusMessage(nextError instanceof Error ? nextError.message : "Failed to load practices.");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const units: Unit[] = practices.map((practice) => ({
    id: practice._id,
    title: practice.title,
    subtitle: practice.content || "Practice quiz",
    label: "PRACTICE",
    completed: !!completedPracticeIds[practice._id],
    color: theme.colors.green,
    levelsHeight: 1,
    nodes: [],
  }));

  const openPractice = async (practiceId: string) => {
    try {
      const detail = await getLessonById(practiceId);
      setSelectedPractice(detail);
      setQuestionIndex(0);
      setSelectedOption(null);
      setAnswers({});
      setStatusMessage(null);
    } catch (nextError) {
      setStatusMessage(nextError instanceof Error ? nextError.message : "Failed to load practice detail.");
    }
  };

  const questions = selectedPractice?.practiceQuestions ?? [];
  const currentQuestion = questions[questionIndex];
  const isLast = questions.length > 0 && questionIndex === questions.length - 1;

  const goPrev = () => {
    if (questionIndex === 0) return;
    const nextIndex = questionIndex - 1;
    setQuestionIndex(nextIndex);
    setSelectedOption(answers[nextIndex] || null);
  };

  const goNextOrDone = async () => {
    if (!selectedPractice || !selectedOption) return;

    const updatedAnswers = { ...answers, [questionIndex]: selectedOption };
    setAnswers(updatedAnswers);

    if (!isLast) {
      const nextIndex = questionIndex + 1;
      setQuestionIndex(nextIndex);
      setSelectedOption(updatedAnswers[nextIndex] || null);
      return;
    }

    if (completedPracticeIds[selectedPractice._id]) {
      setStatusMessage("Practice already completed.");
      return;
    }

    setCompleting(true);
    try {
      await completeLesson(selectedPractice._id);
      const correctCount = questions.reduce((acc, question, idx) => {
        return updatedAnswers[idx] === question.correct ? acc + 1 : acc;
      }, 0);
      setCompletedPracticeIds((current) => ({ ...current, [selectedPractice._id]: true }));
      setStatusMessage(`Done! ${correctCount}/${questions.length} correct, +${selectedPractice.scoreReward} XP`);
      setSelectedPractice(null);
    } catch (nextError) {
      setStatusMessage(nextError instanceof Error ? nextError.message : "Failed to submit practice.");
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "30px 24px 80px" }}>
      <h1 style={{ ...signlearnoText, fontSize: 34, fontWeight: 800, color: theme.colors.textStrong }}>Practice</h1>
      {loading ? <p style={{ ...signlearnoText, color: theme.colors.textMuted }}>Loading practices...</p> : null}
      {statusMessage ? (
        <p style={{ ...signlearnoText, color: statusMessage.startsWith("Done!") ? theme.colors.green : theme.colors.red }}>
          {statusMessage}
        </p>
      ) : null}

      {selectedPractice ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={() => setSelectedPractice(null)}
              style={{ padding: "8px 18px", background: "transparent", border: `2px solid ${theme.colors.border}`, borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 14, color: theme.colors.textStrong, ...signlearnoText }}
            >
              ← Back
            </button>
            <div style={{ ...signlearnoText, fontWeight: 700, fontSize: 18, color: theme.colors.textStrong }}>{selectedPractice.title}</div>
            <div style={{ marginLeft: "auto", color: theme.colors.textMuted, ...signlearnoText }}>
              {questions.length ? questionIndex + 1 : 0} / {questions.length}
            </div>
          </div>

          <div style={{ width: "100%", height: 8, borderRadius: 4, background: theme.colors.border, overflow: "hidden" }}>
            <div style={{ width: `${questions.length ? ((questionIndex + 1) / questions.length) * 100 : 0}%`, height: 8, borderRadius: 4, background: theme.colors.green, transition: "width 300ms ease" }} />
          </div>

          {currentQuestion ? (
            <div style={{ display: "flex", gap: 24, alignItems: "stretch", minHeight: 360 }}>
              <div style={{ flex: 1, borderRadius: theme.radius.card, border: `2px solid ${theme.colors.border}`, borderBottom: `6px solid ${theme.colors.border}`, background: theme.colors.surface, display: "flex", flexDirection: "column", justifyContent: "center", padding: 28 }}>
                <div style={{ ...signlearnoText, fontSize: 20, fontWeight: 800, color: theme.colors.textStrong, marginBottom: 16 }}>
                  Choose the correct answer
                </div>
                {(["A", "B", "C", "D"] as const).map((optionKey) => {
                  const optionValue = currentQuestion[optionKey];
                  const isActive = selectedOption === optionKey;
                  return (
                    <button
                      key={optionKey}
                      onClick={() => setSelectedOption(optionKey)}
                      style={{
                        textAlign: "left",
                        marginBottom: 10,
                        padding: "12px 14px",
                        borderRadius: 10,
                        border: `2px solid ${isActive ? theme.colors.green : theme.colors.border}`,
                        background: isActive ? theme.colors.greenSoft : theme.colors.surface,
                        cursor: "pointer",
                        ...signlearnoText,
                        fontWeight: 700,
                      }}
                    >
                      {optionKey}. {optionValue}
                    </button>
                  );
                })}
              </div>

              <div style={{ flex: 1, borderRadius: theme.radius.card, overflow: "hidden", background: "#000", minHeight: 280, border: `2px solid ${theme.colors.border}` }}>
                <iframe
                  key={currentQuestion.url}
                  src={`${currentQuestion.url}${currentQuestion.url.includes("?") ? "&" : "?"}autoplay=1&mute=1&rel=0&modestbranding=1`}
                  title={`Practice question ${questionIndex + 1}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ width: "100%", height: "100%", border: "none", display: "block", minHeight: 340 }}
                />
              </div>
            </div>
          ) : (
            <div style={{ ...signlearnoText, color: theme.colors.textMuted }}>Practice này chưa có câu hỏi.</div>
          )}

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button
              onClick={goPrev}
              disabled={questionIndex === 0}
              style={{ padding: "12px 28px", borderRadius: 10, border: `2px solid ${theme.colors.border}`, background: theme.colors.surface, cursor: questionIndex === 0 ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 15, color: questionIndex === 0 ? theme.colors.textMuted : theme.colors.textStrong, ...signlearnoText, opacity: questionIndex === 0 ? 0.5 : 1 }}
            >
              ← Prev
            </button>
            <button
              onClick={() => void goNextOrDone()}
              disabled={!selectedOption || completing}
              style={{ padding: "12px 28px", borderRadius: 10, border: "none", borderBottom: `4px solid ${theme.colors.greenDark}`, background: theme.colors.green, cursor: !selectedOption || completing ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 15, color: "#fff", ...signlearnoText, opacity: !selectedOption || completing ? 0.7 : 1 }}
            >
              {isLast ? (completing ? "Saving..." : "✓ Done") : "Next →"}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 24 }}>
          <UnitsGrid
            units={units}
            onSelect={(unit) => {
              if (!unit.id) return;
              void openPractice(unit.id);
            }}
          />
        </div>
      )}
    </div>
  );
}
