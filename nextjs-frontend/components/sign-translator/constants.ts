import { signlearnoTheme as theme } from "@/components/signlearno/theme";
import type { NavItem, Unit, NodeFrame } from "./types";

export const navItems: NavItem[] = [
  { label: "Learn", kind: "learn" },
];

export const units: Unit[] = [
  {
    title: "Unit 1",
    subtitle: "Form basic sentences, greet people",
    color: theme.colors.green,
    levelsHeight: 860,
    nodes: [
      { left: 242, top: 52, kind: "start", color: theme.colors.green, bubbleText: "START" },
      { left: 220, top: 220, kind: "story" },
      { left: 184, top: 386, kind: "practice" },
      { left: 210, top: 554, kind: "check" },
      { left: 260, top: 718, kind: "lesson" },
      { left: 260, top: 866, kind: "review" },
    ],
  },
  {
    title: "Unit 2",
    subtitle: "Get around in a city",
    color: theme.colors.purple,
    levelsHeight: 1350,
    nodes: [
      { left: 242, top: 52, kind: "start", color: theme.colors.purple, bubbleText: "JUMP HERE?" },
      { left: 300, top: 220, kind: "story" },
      { left: 334, top: 384, kind: "lesson" },
      { left: 296, top: 548, kind: "practice" },
      { left: 240, top: 718, kind: "check" },
      { left: 182, top: 886, kind: "story" },
      { left: 210, top: 1054, kind: "lesson" },
      { left: 266, top: 1222, kind: "check" },
      { left: 300, top: 1388, kind: "review" },
    ],
  },
  {
    title: "Unit 3",
    subtitle: "Order food and drink",
    color: "#00CD9C",
    levelsHeight: 1190,
    nodes: [
      { left: 242, top: 52, kind: "start", color: "#00CD9C", bubbleText: "JUMP HERE?" },
      { left: 214, top: 220, kind: "story" },
      { left: 182, top: 384, kind: "lesson" },
      { left: 210, top: 548, kind: "practice" },
      { left: 260, top: 718, kind: "check" },
      { left: 314, top: 886, kind: "story" },
      { left: 286, top: 1054, kind: "lesson" },
      { left: 256, top: 1222, kind: "review" },
    ],
  },
];

export const SIDEBAR_WIDTH = 208;
export const MAIN_WIDTH = 620;
export const RIGHT_RAIL_WIDTH = 380;
export const LAYOUT_GAP = 36;
export const PATH_BOTTOM_SPACE = 116;
export const TOOL_WIDTH = MAIN_WIDTH + RIGHT_RAIL_WIDTH + LAYOUT_GAP;
export const pathCanvasStyle = { position: "relative" as const, width: MAIN_WIDTH };

export const DETECTED_LABEL_COPY: Record<string, string> = {
  hello: "Hello",
  thanks: "Thanks",
  iloveyou: "I love you",
};

export const TEXT_TO_SIGN_PLACEHOLDER = "Type what you want to say in ASL...";

export const START_FRAME: NodeFrame = {
  width: 118,
  height: 108,
  radius: 36,
  lift: 16,
  glossInset: 13,
  iconShift: 6,
};
