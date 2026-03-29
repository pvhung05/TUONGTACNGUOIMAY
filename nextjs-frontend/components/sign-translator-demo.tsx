"use client";

import {
  ArrowUpRight,
  Camera,
  Clock3,
  Copy,
  Flame,
  Gem,
  Languages,
  SendHorizontal,
  Sparkles,
  Video,
  Volume2,
} from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import {
  GuidebookIcon,
  PathNodeSymbol,
  SidebarNavIcon,
  XpChestIllustration,
  type SignLearnoNavKind,
  type SignLearnoPathKind,
} from "@/components/signlearno/icons";
import {
  signlearnoText,
  signlearnoTheme as theme,
  signlearnoUpperLabel,
} from "@/components/signlearno/theme";
import {
  extractHolisticKeypoints,
  SIGN_FEATURE_SIZE,
  SIGN_SEQUENCE_LENGTH,
} from "@/lib/holistic-keypoints";
import {
  drawDetectedLabel,
  drawHolisticLandmarks,
  drawProbabilityBars,
  type HolisticDrawResults,
} from "@/lib/mediapipe-drawing";
import {
  predictSignToText,
  translateTextToSign,
  type TextToSignResult,
} from "@/lib/sign-translation-api";

type NavItem = { label: string; kind: SignLearnoNavKind };
type PathNode = {
  left: number;
  top: number;
  kind: SignLearnoPathKind;
  color?: string;
  bubbleText?: string;
};
type Unit = {
  title: string;
  subtitle: string;
  color: string;
  levelsHeight: number;
  nodes: PathNode[];
};

const navItems: NavItem[] = [
  { label: "Learn", kind: "learn" },
  { label: "Text To Sign", kind: "textToSign" },
  { label: "Sign To Text", kind: "signToText" },
];

const units: Unit[] = [
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

const SIDEBAR_WIDTH = 208;
const MAIN_WIDTH = 620;
const RIGHT_RAIL_WIDTH = 380;
const LAYOUT_GAP = 36;
const PATH_BOTTOM_SPACE = 116;
const TOOL_WIDTH = MAIN_WIDTH + RIGHT_RAIL_WIDTH + LAYOUT_GAP;
const pathCanvasStyle: CSSProperties = { position: "relative", width: MAIN_WIDTH };

const DETECTED_LABEL_COPY: Record<string, string> = {
  hello: "Hello",
  thanks: "Thanks",
  iloveyou: "I love you",
};

const TEXT_TO_SIGN_PLACEHOLDER = "Type what you want to say in ASL...";

function humanizeDetectedLabel(label: string) {
  return DETECTED_LABEL_COPY[label] || label.replace(/([a-z])([A-Z])/g, "$1 $2");
}

function formatSession(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}:${remaining.toString().padStart(2, "0")}`;
}

function describeCameraError(error: unknown): string {
  if (typeof DOMException !== "undefined" && error instanceof DOMException) {
    switch (error.name) {
      case "NotAllowedError":
      case "PermissionDeniedError":
        return "Camera permission denied. Allow camera access for this site in your browser settings, then try again.";
      case "NotFoundError":
      case "DevicesNotFoundError":
        return "No camera found. Connect a webcam or enable it in Windows Settings → Privacy → Camera.";
      case "NotReadableError":
      case "TrackStartError":
        return "Camera is busy or in use by another app. Close other apps using the camera and try again.";
      case "OverconstrainedError":
        return "This camera does not support the requested video mode. Try another camera or update drivers.";
      case "SecurityError":
        return "Camera requires a secure context. Use http://localhost or https://, not an IP address over plain HTTP.";
      default:
        return error.message || error.name || "Camera error";
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Unable to start the camera.";
}

async function getCameraStream(): Promise<MediaStream> {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("Camera access is not supported in this browser.");
  }

  const attempts: MediaStreamConstraints[] = [
    {
      video: {
        facingMode: "user",
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    },
    {
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    },
    {
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
      },
      audio: false,
    },
    { video: true, audio: false },
  ];

  let lastError: unknown;
  for (const constraints of attempts) {
    try {
      return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

type HolisticLike = {
  close: () => Promise<void>;
  onResults: (listener: (results: unknown) => void) => void;
  send: (inputs: { image: HTMLVideoElement }) => Promise<void>;
  setOptions: (options: Record<string, unknown>) => void;
};

type HolisticConstructor = new (config?: {
  locateFile?: (path: string, prefix?: string) => string;
}) => HolisticLike;

/**
 * @mediapipe/holistic registers `Holistic` on globalThis as a side effect; the
 * bundled file does not always expose a named ESM export, so Next/Webpack can
 * yield an empty module object. Prefer globalThis.Holistic after import().
 */
function resolveHolisticConstructor(imported: unknown): HolisticConstructor {
  const g = globalThis as unknown as { Holistic?: HolisticConstructor };
  const mod = imported as {
    Holistic?: HolisticConstructor;
    default?: HolisticConstructor | { Holistic?: HolisticConstructor };
  };
  const fromDefault =
    mod.default && typeof mod.default === "function"
      ? (mod.default as HolisticConstructor)
      : mod.default && typeof mod.default === "object" && "Holistic" in mod.default
        ? (mod.default as { Holistic: HolisticConstructor }).Holistic
        : undefined;

  const ctor = g.Holistic ?? mod.Holistic ?? fromDefault;
  if (!ctor) {
    throw new Error("MediaPipe Holistic failed to load.");
  }
  return ctor;
}

type NodeFrame = {
  width: number;
  height: number;
  radius: number;
  lift: number;
  glossInset: number;
  iconShift: number;
};

const START_FRAME: NodeFrame = {
  width: 118,
  height: 108,
  radius: 36,
  lift: 16,
  glossInset: 13,
  iconShift: 6,
};

function getNodeFrame(node: PathNode): NodeFrame {
  if (node.kind === "start") {
    return START_FRAME;
  }

  if (node.kind === "check") {
    return { width: 96, height: 84, radius: 22, lift: 16, glossInset: 14, iconShift: 6 };
  }

  if (node.kind === "practice") {
    return { width: 88, height: 80, radius: 24, lift: 14, glossInset: 14, iconShift: 4 };
  }

  return { width: 84, height: 78, radius: 26, lift: 13, glossInset: 13, iconShift: 3 };
}

function getConnectorPoints(node: PathNode) {
  const frame = getNodeFrame(node);
  const centerX = node.left + frame.width / 2;
  const topY = node.top + 10;
  const bottomY = node.top + frame.height - 8;

  return { centerX, topY, bottomY, frame };
}

function buildConnectorPath(from: PathNode, to: PathNode) {
  const start = getConnectorPoints(from);
  const end = getConnectorPoints(to);
  const middleY = (start.bottomY + end.topY) / 2;

  return [
    `M ${start.centerX} ${start.bottomY}`,
    `C ${start.centerX} ${middleY}, ${end.centerX} ${middleY}, ${end.centerX} ${end.topY}`,
  ].join(" ");
}

function HeaderMetric({
  icon,
  value,
  color,
}: {
  icon: ReactNode;
  value: string;
  color: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ display: "flex", width: 24, justifyContent: "center" }}>{icon}</div>
      <span style={{ color, fontSize: 17, lineHeight: "20px", fontWeight: 700, ...signlearnoText }}>
        {value}
      </span>
    </div>
  );
}

function SidebarItem({
  item,
  active,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  onClick: () => void;
}) {
  const activeBackground =
    item.kind === "learn" ? theme.colors.blueSoft : "rgba(88, 204, 2, 0.14)";
  const activeBorder =
    item.kind === "learn" ? theme.colors.blueBorder : "rgba(88, 204, 2, 0.25)";
  const activeText = item.kind === "learn" ? theme.colors.blue : theme.colors.green;

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: SIDEBAR_WIDTH,
        minHeight: active ? 78 : 68,
        borderRadius: 18,
        border: active ? `3px solid ${activeBorder}` : "3px solid transparent",
        background: active ? activeBackground : theme.colors.surface,
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        boxSizing: "border-box",
        cursor: "pointer",
        transition: "transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease",
        transform: active ? "translateX(-6px)" : "translateX(0)",
        boxShadow: active ? "0 8px 18px rgba(28, 176, 246, 0.12)" : "none",
      }}
    >
      <SidebarNavIcon kind={item.kind} active={active} />
      <span
        style={{
          color: active ? activeText : theme.colors.textMuted,
          fontSize: 13,
          lineHeight: "18px",
          fontWeight: 700,
          letterSpacing: 0.8,
          textTransform: "uppercase",
          ...signlearnoText,
        }}
      >
        {item.label}
      </span>
    </button>
  );
}

function GuidebookButton({
  color,
  active,
  onClick,
}: {
  color: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        position: "absolute",
        right: 16,
        top: 28,
        width: 157,
        height: 52,
        borderRadius: 16,
        border: "2px solid rgba(0, 0, 0, 0.2)",
        background: color,
        boxShadow: theme.shadow.button,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 22px 14px 14px",
        color: theme.colors.surface,
        cursor: "pointer",
        outline: active ? "3px solid rgba(255, 255, 255, 0.22)" : "none",
        ...signlearnoUpperLabel,
      }}
    >
      <GuidebookIcon />
      Guidebook
    </button>
  );
}

function PathNodeButton({
  node,
  active,
  onClick,
}: {
  node: PathNode;
  active: boolean;
  onClick: () => void;
}) {
  if (node.kind === "start" && node.color && node.bubbleText) {
    const frame = getNodeFrame(node);
    const bubbleWidth = node.bubbleText === "START" ? 82 : 130;
    return (
      <button
        type="button"
        onClick={onClick}
        style={{
          position: "absolute",
          left: node.left,
          top: node.top,
          width: frame.width,
          height: frame.height,
          border: "none",
          background: "transparent",
          padding: 0,
          cursor: "pointer",
          transition: "transform 140ms ease",
          transform: active ? "translateY(-6px) scale(1.03)" : "translateY(0)",
          overflow: "visible",
          zIndex: 2,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: node.bubbleText === "START" ? 18 : -6,
            top: -44,
            width: bubbleWidth,
            height: 44,
            borderRadius: theme.radius.bubble,
            background: theme.colors.surface,
            border: `2px solid ${theme.colors.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: node.color,
            boxSizing: "border-box",
            ...signlearnoUpperLabel,
          }}
        >
          {node.bubbleText}
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: frame.radius,
            background: theme.colors.surface,
            overflow: "visible",
            boxShadow: active
              ? `0 ${frame.lift + 3}px 0 ${theme.colors.nodeShadow}, 0 0 0 5px ${theme.colors.focus}, 0 ${frame.lift + 6}px 24px rgba(0,0,0,0.14)`
              : `0 ${frame.lift}px 0 ${theme.colors.nodeShadow}, 0 ${frame.lift + 4}px 18px rgba(0,0,0,0.08)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              right: 14,
              top: 10,
              width: 28,
              height: 42,
              borderRadius: "18px 18px 18px 4px",
              background: theme.colors.yellow,
              transform: "rotate(16deg)",
              opacity: 0.96,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 13,
              right: 13,
              top: 10,
              height: 20,
              borderRadius: theme.radius.pill,
              background: "rgba(255,255,255,0.42)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
              borderRadius: 30,
              background: node.color,
              boxShadow: "inset 0 -10px 0 rgba(0, 0, 0, 0.12)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `translateY(${frame.iconShift}px) scale(1.08)`,
            }}
          >
            <PathNodeSymbol kind="start" size="xl" />
          </div>
        </div>
      </button>
    );
  }

  const frame = getNodeFrame(node);

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        position: "absolute",
        left: node.left,
        top: node.top,
        width: frame.width,
        height: frame.height,
        border: "none",
        background: "transparent",
        padding: 0,
        cursor: "pointer",
        transition: "transform 140ms ease, filter 140ms ease",
        transform: active ? "translateY(-6px) scale(1.04)" : "translateY(0)",
        filter: active ? "saturate(1.02)" : "none",
        overflow: "visible",
        zIndex: 2,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: frame.radius,
          background: "linear-gradient(180deg, #F8F8F8 0%, #ECECEC 100%)",
          overflow: "visible",
          boxShadow: active
            ? `0 ${frame.lift + 3}px 0 ${theme.colors.nodeShadow}, 0 0 0 5px ${theme.colors.focus}, 0 ${frame.lift + 6}px 20px rgba(0,0,0,0.14)`
            : `0 ${frame.lift}px 0 ${theme.colors.nodeShadow}, 0 ${frame.lift + 4}px 18px rgba(0,0,0,0.08)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: frame.glossInset,
            right: frame.glossInset,
            top: 8,
            height: 16,
            borderRadius: theme.radius.pill,
            background: "rgba(255,255,255,0.5)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `translateY(${frame.iconShift}px) scale(1.14)`,
          }}
        >
          <PathNodeSymbol kind={node.kind} size="xl" />
        </div>
      </div>
    </button>
  );
}

function UnitSection({
  unit,
  activeNodeId,
  activeGuidebook,
  onSelectNode,
  onSelectGuidebook,
}: {
  unit: Unit;
  activeNodeId: string;
  activeGuidebook: string;
  onSelectNode: (nodeId: string) => void;
  onSelectGuidebook: (unitTitle: string) => void;
}) {
  return (
    <section style={{ width: MAIN_WIDTH }}>
      <div style={{ position: "relative", width: MAIN_WIDTH, height: 110.59, borderRadius: theme.radius.unit, background: unit.color }}>
        <div style={{ position: "absolute", left: 16, top: 21.5, fontSize: 22, lineHeight: "34px", fontWeight: 700, color: theme.colors.surface, ...signlearnoText }}>{unit.title}</div>
        <div style={{ position: "absolute", left: 16, top: 61, fontSize: 17, lineHeight: "27px", fontWeight: 500, color: theme.colors.surface, ...signlearnoText }}>{unit.subtitle}</div>
        <GuidebookButton color={unit.color} active={activeGuidebook === unit.title} onClick={() => onSelectGuidebook(unit.title)} />
      </div>
      <div style={{ ...pathCanvasStyle, height: unit.levelsHeight + PATH_BOTTOM_SPACE }}>
        <svg
          width={MAIN_WIDTH}
          height={unit.levelsHeight + PATH_BOTTOM_SPACE}
          viewBox={`0 0 ${MAIN_WIDTH} ${unit.levelsHeight + PATH_BOTTOM_SPACE}`}
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible", zIndex: 0 }}
        >
          {unit.nodes.slice(0, -1).map((node, index) => {
            const nextNode = unit.nodes[index + 1];
            const path = buildConnectorPath(node, nextNode);

            return (
              <g key={`${unit.title}-connector-${index}`}>
                <path
                  d={path}
                  fill="none"
                  stroke="#E5E5E5"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                <path
                  d={path}
                  fill="none"
                  stroke="rgba(255,255,255,0.88)"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </g>
            );
          })}
        </svg>
        {unit.nodes.map((node, index) => {
          const nodeId = `${unit.title}-${index}`;
          return <PathNodeButton key={nodeId} node={node} active={activeNodeId === nodeId} onClick={() => onSelectNode(nodeId)} />;
        })}
      </div>
    </section>
  );
}

function PaginationBar({
  page,
  total,
  onPrev,
  onNext,
}: {
  page: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div style={{ width: MAIN_WIDTH, marginTop: 56, padding: 18, borderRadius: 18, border: `2px solid ${theme.colors.border}`, background: theme.colors.surface, display: "flex", alignItems: "center", justifyContent: "space-between", boxSizing: "border-box" }}>
      <button type="button" onClick={onPrev} disabled={page === 0} style={{ minWidth: 118, height: 44, borderRadius: 14, border: `2px solid ${theme.colors.border}`, background: page === 0 ? "#F5F5F5" : theme.colors.surface, color: page === 0 ? theme.colors.textSoft : theme.colors.textStrong, cursor: page === 0 ? "not-allowed" : "pointer", ...signlearnoUpperLabel }}>
        Previous
      </button>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ color: theme.colors.textMuted, fontSize: 14, lineHeight: "18px", fontWeight: 700, ...signlearnoText }}>
          Unit {page + 1} of {total}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {Array.from({ length: total }).map((_, index) => (
            <div key={index} style={{ width: index === page ? 22 : 10, height: 10, borderRadius: theme.radius.pill, background: index === page ? theme.colors.blue : "#DCEAF5" }} />
          ))}
        </div>
      </div>
      <button type="button" onClick={onNext} disabled={page === total - 1} style={{ minWidth: 118, height: 44, borderRadius: 14, border: `2px solid ${theme.colors.blue}`, background: page === total - 1 ? theme.colors.blueSoft : theme.colors.blue, color: page === total - 1 ? "#79CDF4" : theme.colors.surface, cursor: page === total - 1 ? "not-allowed" : "pointer", ...signlearnoUpperLabel }}>
        Next
      </button>
    </div>
  );
}

function ToolWorkspace({
  title,
  subtitle,
  accent,
  leftLabel,
  leftBody,
  rightLabel,
  rightBody,
}: {
  title: string;
  subtitle: string;
  accent: string;
  leftLabel: string;
  leftBody: ReactNode;
  rightLabel: string;
  rightBody: ReactNode;
}) {
  return (
    <section style={{ width: MAIN_WIDTH, minHeight: 760, borderRadius: 20, border: `2px solid ${theme.colors.border}`, background: theme.colors.surface, overflow: "hidden" }}>
      <div style={{ padding: "28px 28px 20px", background: accent }}>
        <div style={{ fontSize: 28, lineHeight: "34px", fontWeight: 800, color: theme.colors.surface, ...signlearnoText }}>{title}</div>
        <div style={{ marginTop: 10, fontSize: 16, lineHeight: "24px", fontWeight: 500, color: "rgba(255,255,255,0.92)", ...signlearnoText }}>{subtitle}</div>
      </div>
      <div style={{ padding: 28, display: "grid", gap: 20 }}>
        <div style={{ borderRadius: 18, border: `2px solid ${theme.colors.border}`, padding: 22, minHeight: 210, background: "#FAFCFF" }}>
          <div style={{ color: theme.colors.blue, ...signlearnoUpperLabel }}>{leftLabel}</div>
          <div style={{ marginTop: 16 }}>{leftBody}</div>
        </div>
        <div style={{ borderRadius: 18, border: `2px solid ${theme.colors.border}`, padding: 22, minHeight: 210, background: theme.colors.surface }}>
          <div style={{ color: theme.colors.blue, ...signlearnoUpperLabel }}>{rightLabel}</div>
          <div style={{ marginTop: 16 }}>{rightBody}</div>
        </div>
      </div>
    </section>
  );
}

function PanelCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ width: RIGHT_RAIL_WIDTH, borderRadius: theme.radius.card, border: `2px solid ${theme.colors.border}`, background: theme.colors.surface, padding: 26, boxSizing: "border-box" }}>
      <div style={{ color: theme.colors.textStrong, fontSize: 21, lineHeight: "26px", fontWeight: 700, ...signlearnoText }}>{title}</div>
      {children}
    </section>
  );
}

function XpProgressCard({
  goalXp,
  onEditGoal,
}: {
  goalXp: number;
  onEditGoal: () => void;
}) {
  const weekLabels = ["M", "Tu", "W", "Th", "F", "Sa", "Su"];
  const weekValues = [0, 0, 0, 0, 0, 0, goalXp];
  const chartWidth = 320;
  const chartHeight = 220;
  const chartLeft = 40;
  const chartRight = 18;
  const chartTop = 18;
  const chartBottom = 34;
  const innerWidth = chartWidth - chartLeft - chartRight;
  const innerHeight = chartHeight - chartTop - chartBottom;
  const xStep = innerWidth / (weekLabels.length - 1);
  const yLevels = [20, 15, 10, 5, 0];
  const dailyGoalPercent = Math.min(100, (goalXp / 20) * 100);
  const yFor = (value: number) => chartTop + innerHeight - (value / 20) * innerHeight;
  const points = weekValues.map((value, index) => ({ x: chartLeft + xStep * index, y: yFor(value) }));
  const linePoints = points.map(({ x, y }) => `${x},${y}`).join(" ");
  const areaPath = [`M ${points[0]?.x ?? 0} ${chartTop + innerHeight}`, ...points.map(({ x, y }) => `L ${x} ${y}`), `L ${points[points.length - 1]?.x ?? 0} ${chartTop + innerHeight}`, "Z"].join(" ");

  return (
    <section
      style={{
        width: RIGHT_RAIL_WIDTH,
        maxWidth: "100%",
        borderRadius: theme.radius.card,
        border: `2px solid ${theme.colors.border}`,
        background: theme.colors.surface,
        padding: 26,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
        <div style={{ color: theme.colors.textStrong, fontSize: 22, lineHeight: "26px", fontWeight: 700, ...signlearnoText }}>XP Progress</div>
        <button type="button" onClick={onEditGoal} style={{ border: "none", background: "transparent", color: theme.colors.blue, cursor: "pointer", padding: 0, ...signlearnoUpperLabel }}>
          Edit Goal
        </button>
      </div>

      <div style={{ marginTop: 24, display: "flex", alignItems: "flex-start", gap: 16 }}>
        <div style={{ flex: "0 0 auto" }}>
          <XpChestIllustration />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: theme.colors.textMuted, fontSize: 15, lineHeight: "25px", fontWeight: 500, ...signlearnoText }}>Daily Goal</div>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ width: "100%", height: 14, borderRadius: 7, background: theme.colors.border, overflow: "hidden" }}>
              <div
                style={{
                  width: `${dailyGoalPercent}%`,
                  height: 14,
                  borderRadius: 7,
                  background: theme.colors.yellow,
                  boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.08)",
                }}
              />
            </div>
            <div style={{ color: theme.colors.textSoft, fontSize: 15, lineHeight: "20px", fontWeight: 500, textAlign: "right", ...signlearnoText }}>
              {goalXp}/20 XP
            </div>
          </div>
        </div>
      </div>

      <svg
        width="100%"
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        style={{ marginTop: 18, display: "block", height: "auto", maxWidth: "100%" }}
      >
        {yLevels.map((level) => {
          const y = yFor(level);
          return (
            <g key={level}>
              <line x1={chartLeft + 18} x2={chartWidth - chartRight} y1={y} y2={y} stroke={theme.colors.grid} strokeWidth="2" />
              <text x={chartLeft - 16} y={y + 5} fill={level === 20 ? theme.colors.yellow : "#CCCAC9"} fontSize="17" textAnchor="end" style={signlearnoText}>
                {level}
              </text>
            </g>
          );
        })}
        <path d={areaPath} fill={theme.colors.chartFill} />
        <polyline points={linePoints} fill="none" stroke={theme.colors.yellow} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {points.map(({ x, y }, index) => (
          <circle key={weekLabels[index]} cx={x} cy={y} r={index === weekLabels.length - 1 ? 4.5 : 4} fill={theme.colors.surface} stroke={theme.colors.yellow} strokeWidth="2.5" />
        ))}
        {weekLabels.map((label, index) => (
          <text key={label} x={chartLeft + xStep * index} y={chartHeight - 8} fill="#CCCAC9" fontSize="17" textAnchor="middle" style={signlearnoText}>
            {label}
          </text>
        ))}
      </svg>
    </section>
  );
}

function ToolIconButton({
  icon,
  tone = "light",
  onClick,
  disabled = false,
}: {
  icon: ReactNode;
  tone?: "light" | "dark";
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        border:
          tone === "light"
            ? "2px solid rgba(88, 204, 2, 0.18)"
            : "2px solid rgba(255,255,255,0.12)",
        background:
          tone === "light" ? "rgba(229, 247, 215, 0.5)" : "rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
      }}
    >
      {icon}
    </button>
  );
}

function ToolStatCard({
  icon,
  eyebrow,
  value,
  tone = "green",
}: {
  icon: ReactNode;
  eyebrow: string;
  value: string;
  tone?: "green" | "orange";
}) {
  const background = tone === "green" ? "rgba(88, 204, 2, 0.12)" : "rgba(255, 150, 0, 0.12)";
  const iconColor = tone === "green" ? theme.colors.green : theme.colors.orange;

  return (
    <div
      style={{
        width: 236,
        borderRadius: 20,
        border: `2px solid ${theme.colors.border}`,
        background: theme.colors.surface,
        padding: 14,
        display: "flex",
        alignItems: "center",
        gap: 14,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: iconColor,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ color: theme.colors.green, ...signlearnoUpperLabel }}>{eyebrow}</div>
        <div
          style={{
            marginTop: 2,
            color: theme.colors.textStrong,
            fontSize: 15,
            lineHeight: "24px",
            fontWeight: 700,
            ...signlearnoText,
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

function SignToTextExperience() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const captureIntervalRef = useRef<number | null>(null);
  const sessionIntervalRef = useRef<number | null>(null);
  const sequenceRef = useRef<number[][]>([]);
  const framePendingRef = useRef(false);
  const predictionPendingRef = useRef(false);
  const lastPredictionAtRef = useRef(0);
  const latestScoresRef = useRef<Record<string, number> | null>(null);
  const latestLabelRef = useRef<string>("");
  const holisticRef = useRef<{
    close: () => Promise<void>;
    onResults: (listener: (results: unknown) => void) => void;
    send: (inputs: { image: HTMLVideoElement }) => Promise<void>;
    setOptions: (options: Record<string, unknown>) => void;
  } | null>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [translationText, setTranslationText] = useState("Start the camera to begin translating.");
  const [translationStatus, setTranslationStatus] = useState("Camera Off");
  const [confidence, setConfidence] = useState<number | null>(null);

  const stopCamera = async () => {
    if (captureIntervalRef.current) {
      window.clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }

    if (sessionIntervalRef.current) {
      window.clearInterval(sessionIntervalRef.current);
      sessionIntervalRef.current = null;
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    if (holisticRef.current) {
      try {
        await holisticRef.current.close();
      } catch {
        // ignore MediaPipe teardown errors
      }
      holisticRef.current = null;
    }

    sequenceRef.current = [];
    framePendingRef.current = false;
    predictionPendingRef.current = false;
    latestScoresRef.current = null;
    latestLabelRef.current = "";

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }

    setCameraActive(false);
    setCameraReady(false);
    setIsPredicting(false);
    setSessionSeconds(0);
    setTranslationStatus("Camera Off");
  };

  useEffect(() => {
    return () => {
      void stopCamera();
    };
  }, []);

  const runPrediction = async (sequence: number[][]) => {
    predictionPendingRef.current = true;
    setIsPredicting(true);
    setTranslationStatus("Translating...");
    setCameraError(null);

    try {
      const response = await predictSignToText(sequence);
      const label = humanizeDetectedLabel(response.result.label);
      setTranslationText(label);
      setConfidence(response.result.confidence);
      setTranslationStatus("Live prediction ready");
      latestScoresRef.current = response.result.scores;
      latestLabelRef.current = label;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to reach the translation API.";
      setCameraError(message);
      setTranslationStatus("Prediction failed");
      setConfidence(null);
    } finally {
      setIsPredicting(false);
      predictionPendingRef.current = false;
    }
  };

  const startCamera = async () => {
    if (cameraActive) {
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera access is not supported in this browser.");
      setTranslationStatus("Camera unavailable");
      return;
    }

    setCameraError(null);
    setConfidence(null);
    setTranslationText("Move into frame and start signing.");
    setTranslationStatus("Requesting camera access...");
    setSessionSeconds(0);
    sequenceRef.current = [];
    lastPredictionAtRef.current = 0;

    let stream: MediaStream | null = null;

    try {
      stream = await getCameraStream();

      const videoElement = videoRef.current;
      if (!videoElement) {
        throw new Error("Video element is not ready.");
      }

      videoElement.srcObject = stream;
      // Must show the <video> before play(): many browsers refuse playback while display:none
      // (e.g. Chrome/Edge on Windows while MediaPipe loads).
      setCameraActive(true);
      setTranslationStatus("Starting video…");

      try {
        await videoElement.play();
      } catch (playError) {
        throw playError instanceof Error ? playError : new Error(String(playError));
      }

      const overlayCanvas = canvasRef.current;
      if (overlayCanvas) {
        overlayCanvas.width = videoElement.videoWidth || 640;
        overlayCanvas.height = videoElement.videoHeight || 480;
      }

      const mediaPipeModule = await import("@mediapipe/holistic");
      const HolisticConstructor = resolveHolisticConstructor(mediaPipeModule);

      const holistic = new HolisticConstructor({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
      });

      holistic.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        refineFaceLandmarks: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      holistic.onResults((results) => {
        const holisticResults = results as HolisticDrawResults & {
          poseLandmarks?: { x: number; y: number; z: number; visibility?: number }[];
          faceLandmarks?: { x: number; y: number; z: number }[];
          leftHandLandmarks?: { x: number; y: number; z: number }[];
          rightHandLandmarks?: { x: number; y: number; z: number }[];
        };

        const cvs = canvasRef.current;
        if (cvs) {
          const ctx = cvs.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, cvs.width, cvs.height);
            drawHolisticLandmarks(ctx, holisticResults, cvs.width, cvs.height);
            if (latestScoresRef.current) {
              drawProbabilityBars(ctx, latestScoresRef.current, cvs.width);
            }
            if (latestLabelRef.current) {
              drawDetectedLabel(ctx, latestLabelRef.current, cvs.width, cvs.height);
            }
          }
        }

        const keypoints = extractHolisticKeypoints(holisticResults);

        if (keypoints.length !== SIGN_FEATURE_SIZE) {
          return;
        }

        setCameraReady(true);
        sequenceRef.current = [...sequenceRef.current.slice(-(SIGN_SEQUENCE_LENGTH - 1)), keypoints];

        if (
          sequenceRef.current.length >= SIGN_SEQUENCE_LENGTH &&
          !predictionPendingRef.current &&
          Date.now() - lastPredictionAtRef.current > 1800
        ) {
          lastPredictionAtRef.current = Date.now();
          void runPrediction(sequenceRef.current.slice(-SIGN_SEQUENCE_LENGTH));
        }
      });

      streamRef.current = stream;
      holisticRef.current = holistic;
      setTranslationStatus("Collecting frames...");

      captureIntervalRef.current = window.setInterval(async () => {
        const currentVideo = videoRef.current;
        if (
          !currentVideo ||
          currentVideo.readyState < 2 ||
          !holisticRef.current ||
          framePendingRef.current
        ) {
          return;
        }

        framePendingRef.current = true;
        try {
          await holisticRef.current.send({ image: currentVideo });
        } finally {
          framePendingRef.current = false;
        }
      }, 140);

      sessionIntervalRef.current = window.setInterval(() => {
        setSessionSeconds((current) => current + 1);
      }, 1000);
    } catch (error) {
      stream?.getTracks().forEach((track) => track.stop());
      setCameraError(describeCameraError(error));
      await stopCamera();
      setTranslationStatus("Camera start failed");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(translationText);
    } catch {
      setCameraError("Copy failed in this browser.");
    }
  };

  const handleSpeak = () => {
    if (!("speechSynthesis" in window) || !translationText.trim()) {
      return;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(translationText));
  };

  const statusValue = cameraError
    ? cameraError
    : cameraActive
      ? isPredicting
        ? "Listening..."
        : cameraReady
          ? "Camera Active"
          : "Starting..."
      : "Camera Off";
  const accuracyValue =
    confidence !== null ? `${Math.round(confidence * 100)}% Confidence` : "Awaiting gesture";

  return (
    <section style={{ width: TOOL_WIDTH }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.18fr) minmax(0, 0.82fr)",
          columnGap: 22,
          rowGap: 14,
          alignItems: "start",
        }}
      >
        <section
          style={{ gridColumn: 1, gridRow: 1 }}
        >
          <div
            style={{
              position: "relative",
              minHeight: 660,
              borderRadius: 26,
              border: `2px solid ${theme.colors.border}`,
              background:
                "linear-gradient(145deg, rgba(229, 247, 215, 0.9) 0%, rgba(255, 255, 255, 0.96) 100%)",
              overflow: "hidden",
              boxShadow: "0 22px 50px rgba(17, 24, 39, 0.08)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 28,
                borderRadius: 22,
                background: "#FFFFFF",
                border: "2px solid rgba(88, 204, 2, 0.18)",
                boxShadow: "inset 0 0 0 1px rgba(88, 204, 2, 0.05)",
                overflow: "hidden",
              }}
            >
              <video
                ref={videoRef}
                muted
                playsInline
                autoPlay
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: cameraActive ? "block" : "none",
                }}
              />
              <canvas
                ref={canvasRef}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  pointerEvents: "none",
                  display: cameraActive ? "block" : "none",
                }}
              />
              {!cameraActive ? (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 14,
                    color: theme.colors.textMuted,
                    background:
                      "linear-gradient(180deg, rgba(229, 247, 215, 0.35) 0%, rgba(255,255,255,0.96) 100%)",
                    textAlign: "center",
                    padding: 24,
                    boxSizing: "border-box",
                    ...signlearnoText,
                  }}
                >
                  <Camera size={34} color={theme.colors.green} />
                  <div style={{ fontSize: 20, lineHeight: "28px", fontWeight: 700 }}>
                    Camera preview will appear here
                  </div>
                  <div style={{ fontSize: 15, lineHeight: "24px", maxWidth: 320 }}>
                    Start the camera to stream landmarks to the backend model in real time.
                  </div>
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => {
                void (cameraActive ? stopCamera() : startCamera());
              }}
              style={{
                position: "absolute",
                left: "50%",
                bottom: 24,
                transform: "translateX(-50%)",
                height: 56,
                padding: "0 28px",
                borderRadius: 20,
                border: "none",
                background: "#FFFFFF",
                color: theme.colors.green,
                display: "flex",
                alignItems: "center",
                gap: 12,
                cursor: "pointer",
                boxShadow: "0 12px 32px rgba(17,24,39,0.12)",
                fontSize: 16,
                lineHeight: "22px",
                fontWeight: 700,
                ...signlearnoText,
              }}
            >
              <Camera size={20} />
              {cameraActive ? "Stop Camera" : "Start Camera"}
            </button>
          </div>
        </section>

        <div
          style={{
            gridColumn: 1,
            gridRow: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: theme.colors.green,
            fontSize: 15,
            lineHeight: "24px",
            fontWeight: 700,
            ...signlearnoText,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Clock3 size={18} color={theme.colors.green} />
            Session: {formatSession(sessionSeconds)}
          </span>
          <span style={{ color: "rgba(88, 204, 2, 0.72)", ...signlearnoUpperLabel }}>
            {translationStatus}
          </span>
        </div>

        <section
          style={{
            gridColumn: 2,
            gridRow: 1,
            minHeight: 660,
            borderRadius: 26,
            border: `2px solid ${theme.colors.border}`,
            background: theme.colors.surface,
            padding: 20,
            boxSizing: "border-box",
            boxShadow: "0 22px 50px rgba(17, 24, 39, 0.06)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Languages size={22} color={theme.colors.green} />
              <span style={{ color: theme.colors.green, ...signlearnoUpperLabel }}>
                Real-time Translation
              </span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <ToolIconButton
                icon={<Volume2 size={22} color={theme.colors.green} />}
                onClick={handleSpeak}
                disabled={confidence === null}
              />
              <ToolIconButton
                icon={<Copy size={22} color={theme.colors.green} />}
                onClick={() => {
                  void handleCopy();
                }}
                disabled={confidence === null}
              />
            </div>
          </div>

          <div
            style={{
              marginTop: 28,
              color: theme.colors.textStrong,
              fontSize: 50,
              lineHeight: "52px",
              fontWeight: 800,
              letterSpacing: -1.8,
              ...signlearnoText,
            }}
          >
            {translationText}
          </div>

          <div
            style={{
              marginTop: "auto",
              paddingTop: 22,
              borderTop: "2px solid rgba(88, 204, 2, 0.2)",
              display: "grid",
              gap: 14,
            }}
          >
            <ToolStatCard
              icon={<Video size={22} color={theme.colors.green} />}
              eyebrow="Status"
              value={statusValue}
              tone="green"
            />
            <ToolStatCard
              icon={<Sparkles size={22} color={theme.colors.orange} />}
              eyebrow="Accuracy"
              value={accuracyValue}
              tone="orange"
            />
          </div>
        </section>
      </div>

      <div
        style={{
          marginTop: 26,
          borderRadius: 20,
          border: "2px solid rgba(88, 204, 2, 0.22)",
          background:
            "linear-gradient(135deg, rgba(229, 247, 215, 0.9) 0%, rgba(255, 255, 255, 0.96) 100%)",
          padding: "18px 20px",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 18px rgba(88, 204, 2, 0.12)",
          }}
        >
          <Sparkles size={20} color={theme.colors.green} />
        </div>
        <div
          style={{
            color: theme.colors.green,
            fontSize: 16,
            lineHeight: "24px",
            fontWeight: 700,
            ...signlearnoText,
          }}
        >
          Keep both hands in frame for at least {SIGN_SEQUENCE_LENGTH} sampled frames so the
          backend can classify the sign.
        </div>
      </div>
    </section>
  );
}

function TextToSignExperience() {
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
    <section style={{ width: TOOL_WIDTH }}>
      <div
        style={{
          borderRadius: 30,
          overflow: "hidden",
          border: `2px solid ${theme.colors.border}`,
          background: theme.colors.surface,
          boxShadow: "0 24px 48px rgba(15, 23, 42, 0.08)",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 0.98fr)",
        }}
      >
        <section style={{ padding: 34 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: theme.colors.green, ...signlearnoUpperLabel }}>Type Message</span>
            <span
              style={{
                color: theme.colors.textMuted,
                fontSize: 14,
                lineHeight: "18px",
                fontWeight: 700,
                ...signlearnoText,
              }}
            >
              Video Translation
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
              background:
                "linear-gradient(180deg, rgba(229, 247, 215, 0.38) 0%, rgba(221, 244, 255, 0.22) 100%)",
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

          <div
            style={{
              marginTop: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 18,
            }}
          >
            <span
              style={{
                color: theme.colors.textMuted,
                fontSize: 15,
                lineHeight: "20px",
                fontWeight: 700,
                ...signlearnoText,
              }}
            >
              {inputText.trim().length} / 500
            </span>

            <button
              type="button"
              disabled={isSubmitting || !inputText.trim()}
              onClick={() => {
                void runTranslation(inputText);
              }}
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

        <section
          style={{
            padding: 0,
            background:
              "linear-gradient(180deg, rgba(229, 247, 215, 0.88) 0%, rgba(255,255,255,0.98) 100%)",
            color: theme.colors.textStrong,
            display: "flex",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "relative",
              flex: 1,
              background:
                "linear-gradient(180deg, rgba(229, 247, 215, 0.94) 0%, rgba(255,255,255,0.98) 100%)",
              boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.08)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 22,
                borderRadius: 22,
                background: "#FFFFFF",
                border: "2px solid rgba(88, 204, 2, 0.18)",
                boxShadow: "inset 0 0 0 1px rgba(88, 204, 2, 0.05)",
                padding: 26,
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: 18,
                justifyContent: translation ? "flex-start" : "center",
              }}
            >
              {translation ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 16,
                    }}
                  >
                    <div>
                      <div style={{ color: theme.colors.green, ...signlearnoUpperLabel }}>
                        Generated Sign Video
                      </div>
                      <div
                        style={{
                          marginTop: 10,
                          color: theme.colors.textStrong,
                          fontSize: 18,
                          lineHeight: "28px",
                          fontWeight: 700,
                          ...signlearnoText,
                        }}
                      >
                        {translation.normalized_text || "No text submitted"}
                      </div>
                    </div>

                    <div
                      style={{
                        flexShrink: 0,
                        borderRadius: 999,
                        padding: "10px 14px",
                        border: "2px solid rgba(88, 204, 2, 0.14)",
                        background:
                          "linear-gradient(180deg, rgba(229, 247, 215, 0.62) 0%, rgba(255,255,255,0.95) 100%)",
                        color: theme.colors.green,
                        fontSize: 13,
                        lineHeight: "18px",
                        fontWeight: 800,
                        ...signlearnoUpperLabel,
                      }}
                    >
                      Ready To Play
                    </div>
                  </div>

                  <div
                    style={{
                      flex: 1,
                      minHeight: 0,
                      borderRadius: 20,
                      border: "2px solid rgba(88, 204, 2, 0.18)",
                      background:
                        "linear-gradient(180deg, rgba(221, 244, 255, 0.24) 0%, rgba(255,255,255,1) 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 20,
                      boxSizing: "border-box",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        maxWidth: 440,
                        aspectRatio: "4 / 5",
                        borderRadius: 18,
                        overflow: "hidden",
                        background: "#F7FAFC",
                        boxShadow: "0 18px 36px rgba(17, 24, 39, 0.08)",
                      }}
                    >
                      <video
                        key={translation.video_url}
                        src={translation.video_url}
                        controls
                        autoPlay
                        loop
                        muted
                        playsInline
                        onError={() =>
                          setVideoPlaybackError(
                            "The generated sign video could not be played in this browser.",
                          )
                        }
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "block",
                          objectFit: "contain",
                          background: "#F7FAFC",
                        }}
                      />
                    </div>
                  </div>

                  {videoPlaybackError ? (
                    <div
                      style={{
                        color: theme.colors.red,
                        fontSize: 14,
                        lineHeight: "22px",
                        fontWeight: 700,
                        ...signlearnoText,
                      }}
                    >
                      {videoPlaybackError}
                    </div>
                  ) : null}
                </>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    color: error ? theme.colors.red : theme.colors.textMuted,
                    fontSize: 20,
                    lineHeight: "30px",
                    fontWeight: 700,
                    padding: "0 24px",
                    ...signlearnoText,
                  }}
                >
                  {error || "Your translated sign video will appear here."}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <section
        style={{
          marginTop: 22,
          width: TOOL_WIDTH,
          borderRadius: 28,
          border: `2px solid ${theme.colors.border}`,
          background: theme.colors.surface,
          padding: 24,
          boxSizing: "border-box",
          boxShadow: "0 22px 44px rgba(15, 23, 42, 0.05)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Clock3 size={20} color={theme.colors.green} />
            <span style={{ color: theme.colors.green, ...signlearnoUpperLabel }}>
              Recently Translated
            </span>
          </div>
          <button
            type="button"
            onClick={() => setRecentPhrases([])}
            style={{
              border: "none",
              background: "transparent",
              color: theme.colors.green,
              cursor: "pointer",
              fontSize: 16,
              lineHeight: "22px",
              fontWeight: 700,
              ...signlearnoText,
            }}
          >
            Clear History
          </button>
        </div>

        <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 12 }}>
          {recentPhrases.map((phrase) => (
            <button
              key={phrase}
              type="button"
              onClick={() => {
                setInputText(phrase);
                void runTranslation(phrase);
              }}
              style={{
                padding: "15px 18px",
                borderRadius: 999,
                border: `2px solid ${theme.colors.border}`,
                background:
                  "linear-gradient(180deg, rgba(229, 247, 215, 0.28) 0%, rgba(255,255,255,0.92) 100%)",
                display: "flex",
                alignItems: "center",
                gap: 14,
                cursor: "pointer",
                color: theme.colors.textStrong,
                fontSize: 16,
                lineHeight: "22px",
                fontWeight: 500,
                ...signlearnoText,
              }}
            >
              <span>&ldquo;{phrase}&rdquo;</span>
              <ArrowUpRight size={18} color={theme.colors.green} />
            </button>
          ))}
        </div>
      </section>
    </section>
  );
}

export function SignTranslatorDemo() {
  const [activeNav, setActiveNav] = useState<SignLearnoNavKind>("learn");
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

  return (
    <main style={{ minHeight: "100vh", overflowX: "auto", background: theme.colors.canvas, fontFamily: theme.fontFamily }}>
      <div style={{ width: 1440, minHeight: pageHeight, margin: "0 auto" }}>
        <header style={{ width: 1440, height: 70, borderBottom: `2px solid ${theme.colors.border}`, background: theme.colors.surface }}>
          <div style={{ width: 1328, height: 68, margin: "0 auto", padding: "0 40px", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ color: theme.colors.green, fontSize: 34, lineHeight: "34px", fontWeight: 800, letterSpacing: -1.2, textTransform: "lowercase", ...signlearnoText }}>
              {theme.brandName}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 34 }}>
              <HeaderMetric icon={<Flame size={25} color={theme.colors.orange} fill={theme.colors.orange} />} value="1" color={theme.colors.orange} />
              <HeaderMetric icon={<Gem size={24} color={theme.colors.border} fill={theme.colors.border} />} value="0" color={theme.colors.border} />
            </div>
          </div>
        </header>

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
