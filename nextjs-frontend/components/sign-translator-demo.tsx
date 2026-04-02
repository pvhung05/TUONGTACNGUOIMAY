"use client";

import { useState } from "react";
import type { SignLearnoNavKind } from "@/components/signlearno/icons";
import { signlearnoTheme as theme } from "@/components/signlearno/theme";
import { navItems, units, LAYOUT_GAP, MAIN_WIDTH, RIGHT_RAIL_WIDTH, TOOL_WIDTH } from "./sign-translator/constants";
import { UnitsGrid, FlashcardView, XpProgressCard } from "./sign-translator/learn";
import { TextToSignExperience } from "./sign-translator/text-to-sign";
import { SignToTextExperience } from "./sign-translator/sign-to-text";
import type { Unit } from "./sign-translator/types";

export function SignTranslatorDemo({ translatorMode }: { translatorMode?: "textToSign" | "signToText" } = {}) {
  const [activeNav, setActiveNav] = useState<SignLearnoNavKind>(translatorMode || "learn");
  const [goalXp, setGoalXp] = useState(13);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  const pageHeight = activeNav === "learn" ? 800 : 1420;

  return translatorMode ? (
    // Translator mode - simplified layout without sidebar
    <div style={{ width: "100%" }}>
      {translatorMode === "textToSign" ? <TextToSignExperience /> : <SignToTextExperience />}
    </div>
  ) : (
    // Learn mode - full interface with sidebar
    <main style={{ minHeight: "100vh", background: theme.colors.canvas, fontFamily: theme.fontFamily }}>
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        <div style={{ margin: "24px 24px 64px", display: "flex", gap: LAYOUT_GAP, alignItems: "flex-start", boxSizing: "border-box" }}>
          {activeNav === "learn" ? (
            <>
              <section style={{ flex: 1, minWidth: 0 }}>
                {selectedUnit ? (
                  <FlashcardView
                    unit={selectedUnit}
                    onBack={() => setSelectedUnit(null)}
                    onDone={() => {
                      setGoalXp((xp) => xp + 5);
                      setSelectedUnit(null);
                    }}
                  />
                ) : (
                  <UnitsGrid units={units} onSelect={(unit) => setSelectedUnit(unit)} />
                )}
              </section>

              {!selectedUnit && (
                <aside style={{ width: RIGHT_RAIL_WIDTH, flexShrink: 0, position: "sticky", top: 100, alignSelf: "flex-start" }}>
                  <XpProgressCard goalXp={goalXp} onEditGoal={() => setGoalXp((current) => (current === 13 ? 20 : 13))} />
                </aside>
              )}
            </>
          ) : (
            <section style={{ width: TOOL_WIDTH }}>
              {activeNav === "textToSign" ? <TextToSignExperience /> : <SignToTextExperience />}
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
