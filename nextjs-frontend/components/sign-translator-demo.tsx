"use client";

import { useState } from "react";
import type { SignLearnoNavKind } from "@/components/signlearno/icons";
import { signlearnoTheme as theme } from "@/components/signlearno/theme";
import { navItems, units, LAYOUT_GAP, SIDEBAR_WIDTH, MAIN_WIDTH, RIGHT_RAIL_WIDTH, PATH_BOTTOM_SPACE, TOOL_WIDTH } from "./sign-translator/constants";
import { SidebarItem, PaginationBar } from "./sign-translator/ui/shared";
import { UnitSection, XpProgressCard } from "./sign-translator/learn";
import { TextToSignExperience } from "./sign-translator/text-to-sign";
import { SignToTextExperience } from "./sign-translator/sign-to-text";

export function SignTranslatorDemo({ translatorMode }: { translatorMode?: "textToSign" | "signToText" } = {}) {
  const [activeNav, setActiveNav] = useState<SignLearnoNavKind>(translatorMode || "learn");
  const [unitPage, setUnitPage] = useState(0);
  const [activeGuidebook, setActiveGuidebook] = useState(units[0].title);
  const [activeNodeId, setActiveNodeId] = useState(`${units[0].title}-0`);
  const [goalXp, setGoalXp] = useState(13);
  
  const currentUnit = units[unitPage];
  const pageHeight =
    activeNav === "learn"
      ? currentUnit.levelsHeight + PATH_BOTTOM_SPACE + 460
      : 1420;

  const selectUnit = (nextPage: number) => {
    const nextUnit = units[nextPage];
    setUnitPage(nextPage);
    setActiveGuidebook(nextUnit.title);
    setActiveNodeId(`${nextUnit.title}-0`);
  };

  return translatorMode ? (
    // Translator mode - simplified layout without sidebar
    <div style={{ width: "100%" }}>
      {translatorMode === "textToSign" ? <TextToSignExperience /> : <SignToTextExperience />}
    </div>
  ) : (
    // Learn mode - full interface with sidebar
    <main style={{ minHeight: "100vh", overflowX: "auto", background: theme.colors.canvas, fontFamily: theme.fontFamily }}>
      <div style={{ width: 1440, minHeight: pageHeight, margin: "0 auto" }}>
        <div style={{ width: 1304, margin: "24px auto 64px", display: "flex", gap: LAYOUT_GAP, paddingLeft: 0, boxSizing: "border-box" }}>
          <aside style={{ width: SIDEBAR_WIDTH, display: "flex", flexDirection: "column", gap: 10 }}>
            {navItems.map((item) => (
              <SidebarItem key={item.kind} item={item} active={activeNav === item.kind} onClick={() => setActiveNav(item.kind)} />
            ))}
          </aside>

          {activeNav === "learn" ? (
            <>
              <section style={{ width: MAIN_WIDTH }}>
                <UnitSection unit={currentUnit} activeNodeId={activeNodeId} activeGuidebook={activeGuidebook} onSelectNode={setActiveNodeId} onSelectGuidebook={setActiveGuidebook} />
                <PaginationBar page={unitPage} total={units.length} onPrev={() => selectUnit(Math.max(0, unitPage - 1))} onNext={() => selectUnit(Math.min(units.length - 1, unitPage + 1))} />
              </section>

              <aside style={{ width: RIGHT_RAIL_WIDTH, display: "flex", flexDirection: "column", gap: 24 }}>
                <XpProgressCard goalXp={goalXp} onEditGoal={() => setGoalXp((current) => (current === 13 ? 20 : 13))} />
              </aside>
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
