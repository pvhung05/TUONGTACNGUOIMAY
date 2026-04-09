"use client";

import { useEffect, useState } from "react";
import { signlearnoTheme as theme, signlearnoText } from "@/components/signlearno/theme";
import { completeLesson, getLearningHistory, getLessonById, getLessons } from "@/lib/api";
import type { Lesson } from "@/lib/api/backend";
import { FlashcardView, UnitsGrid } from "@/components/sign-translator/learn";
import type { Unit } from "@/components/sign-translator/types";

export default function LessonPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);
  const [completedLessonIds, setCompletedLessonIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getLessons("lesson");
        setLessons(data);
        try {
          const histories = await getLearningHistory();
          const completedMap: Record<string, boolean> = {};
          histories.forEach((item) => {
            const lessonId = typeof item.lessonId === "string" ? item.lessonId : item.lessonId._id;
            if (lessonId) completedMap[lessonId] = true;
          });
          setCompletedLessonIds(completedMap);
        } catch {
          // ignore history in guest mode
        }
      } catch (nextError) {
        setStatusMessage(nextError instanceof Error ? nextError.message : "Failed to load lessons.");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const mapLessonToUnit = (lesson: Lesson): Unit => {
    const flashcards =
      lesson.resources?.map((resource) => ({
        word: resource.title,
        videoUrl: resource.url,
      })) ?? [];

    return {
      id: lesson._id,
      title: lesson.title,
      subtitle: lesson.content || "Sign language lesson",
      label: "LESSON",
      completed: !!completedLessonIds[lesson._id],
      color: theme.colors.green,
      levelsHeight: 1,
      nodes: [],
      flashcards,
    };
  };

  const openLesson = async (lessonId: string) => {
    try {
      const detail = await getLessonById(lessonId);
      setSelectedLessonId(lessonId);
      setSelectedUnit(mapLessonToUnit(detail));
      setStatusMessage(null);
    } catch (nextError) {
      setStatusMessage(nextError instanceof Error ? nextError.message : "Failed to load lesson detail.");
    }
  };

  const handleDone = async () => {
    if (!selectedLessonId) return;
    if (completedLessonIds[selectedLessonId]) {
      setStatusMessage("Lesson already completed.");
      return;
    }

    const selectedLesson = lessons.find((item) => item._id === selectedLessonId);
    if (!selectedLesson) return;

    setCompleting(true);
    try {
      await completeLesson(selectedLessonId);
      setStatusMessage(`Completed! +${selectedLesson.scoreReward} XP`);
      setCompletedLessonIds((current) => ({ ...current, [selectedLessonId]: true }));
      setSelectedUnit(null);
      setSelectedLessonId(null);
    } catch (nextError) {
      setStatusMessage(nextError instanceof Error ? nextError.message : "Complete failed.");
    } finally {
      setCompleting(false);
    }
  };

  const units: Unit[] = lessons.map(mapLessonToUnit);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "30px 24px 80px" }}>
      <h1 style={{ ...signlearnoText, fontSize: 34, fontWeight: 800, color: theme.colors.textStrong }}>Lessons</h1>
      {loading ? <p style={{ ...signlearnoText, color: theme.colors.textMuted }}>Loading lessons...</p> : null}
      {statusMessage ? (
        <p style={{ ...signlearnoText, color: statusMessage.startsWith("Completed") ? theme.colors.green : theme.colors.red }}>
          {statusMessage}
        </p>
      ) : null}
      {selectedUnit ? (
        <div style={{ marginTop: 24 }}>
          <FlashcardView
            unit={selectedUnit}
            onBack={() => {
              setSelectedUnit(null);
              setSelectedLessonId(null);
            }}
            onDone={() => {
              if (completing) return;
              void handleDone();
            }}
          />
        </div>
      ) : (
        <UnitsGrid
          units={units}
          onSelect={(unit) => {
            if (!unit.id) return;
            void openLesson(unit.id);
          }}
        />
      )}
    </div>
  );
}
