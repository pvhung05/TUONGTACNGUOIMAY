import { signlearnoTheme as theme, signlearnoText, signlearnoUpperLabel } from "@/components/signlearno/theme";
import { PathNodeSymbol, XpChestIllustration } from "@/components/signlearno/icons";
import type { PathNode, Unit } from "../types";
import { MAIN_WIDTH, PATH_BOTTOM_SPACE, RIGHT_RAIL_WIDTH } from "../constants";
import { getNodeFrame, buildConnectorPath } from "../utils";
import { GuidebookButton } from "../ui/shared";

export function PathNodeButton({ node, active, onClick }: { node: PathNode; active: boolean; onClick: () => void }) {
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
            style={{ position: "absolute", right: 14, top: 10, width: 28, height: 42, borderRadius: "18px 18px 18px 4px", background: theme.colors.yellow, transform: "rotate(16deg)", opacity: 0.96 }}
          />
          <div style={{ position: "absolute", left: 13, right: 13, top: 10, height: 20, borderRadius: theme.radius.pill, background: "rgba(255,255,255,0.42)" }} />
          <div style={{ position: "absolute", left: 12, right: 12, top: 12, bottom: 12, borderRadius: 30, background: node.color, boxShadow: "inset 0 -10px 0 rgba(0, 0, 0, 0.12)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", transform: `translateY(${frame.iconShift}px) scale(1.08)` }}>
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
        <div style={{ position: "absolute", left: frame.glossInset, right: frame.glossInset, top: 8, height: 16, borderRadius: theme.radius.pill, background: "rgba(255,255,255,0.5)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", transform: `translateY(${frame.iconShift}px) scale(1.14)` }}>
          <PathNodeSymbol kind={node.kind} size="xl" />
        </div>
      </div>
    </button>
  );
}

export function UnitSection({ unit, activeNodeId, activeGuidebook, onSelectNode, onSelectGuidebook }: { unit: Unit; activeNodeId: string; activeGuidebook: string; onSelectNode: (nodeId: string) => void; onSelectGuidebook: (unitTitle: string) => void }) {
  const pathCanvasStyle = { position: "relative" as const, width: MAIN_WIDTH };
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
                <path d={path} fill="none" stroke="#E5E5E5" strokeWidth="16" strokeLinecap="round" />
                <path d={path} fill="none" stroke="rgba(255,255,255,0.88)" strokeWidth="6" strokeLinecap="round" />
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

export function XpProgressCard({ goalXp, onEditGoal }: { goalXp: number; onEditGoal: () => void }) {
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
      style={{ width: RIGHT_RAIL_WIDTH, maxWidth: "100%", borderRadius: theme.radius.card, border: `2px solid ${theme.colors.border}`, background: theme.colors.surface, padding: 26, boxSizing: "border-box", overflow: "hidden" }}
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
              <div style={{ width: `${dailyGoalPercent}%`, height: 14, borderRadius: 7, background: theme.colors.yellow, boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.08)" }} />
            </div>
            <div style={{ color: theme.colors.textSoft, fontSize: 15, lineHeight: "20px", fontWeight: 500, textAlign: "right", ...signlearnoText }}>
              {goalXp}/20 XP
            </div>
          </div>
        </div>
      </div>

      <svg width="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true" style={{ marginTop: 18, display: "block", height: "auto", maxWidth: "100%" }}>
        {yLevels.map((level) => {
          const y = yFor(level);
          return (
            <g key={level}>
              <line x1={chartLeft + 18} x2={chartWidth - chartRight} y1={y} y2={y} stroke={theme.colors.grid} strokeWidth="2" />
              <text x={chartLeft - 16} y={y + 5} fill={level === 20 ? theme.colors.yellow : "#CCCAC9"} fontSize="17" textAnchor="end" style={signlearnoText}>{level}</text>
            </g>
          );
        })}
        <path d={areaPath} fill={theme.colors.chartFill} />
        <polyline points={linePoints} fill="none" stroke={theme.colors.yellow} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {points.map(({ x, y }, index) => (
          <circle key={weekLabels[index]} cx={x} cy={y} r={index === weekLabels.length - 1 ? 4.5 : 4} fill={theme.colors.surface} stroke={theme.colors.yellow} strokeWidth="2.5" />
        ))}
        {weekLabels.map((label, index) => (
          <text key={label} x={chartLeft + xStep * index} y={chartHeight - 8} fill="#CCCAC9" fontSize="17" textAnchor="middle" style={signlearnoText}>{label}</text>
        ))}
      </svg>
    </section>
  );
}
