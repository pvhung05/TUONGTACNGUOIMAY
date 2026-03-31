import type { ReactNode } from "react";
import { signlearnoTheme as theme, signlearnoText, signlearnoUpperLabel } from "@/components/signlearno/theme";
import { SidebarNavIcon, GuidebookIcon } from "@/components/signlearno/icons";
import type { NavItem } from "../types";
import { SIDEBAR_WIDTH, MAIN_WIDTH, RIGHT_RAIL_WIDTH } from "../constants";

export function HeaderMetric({ icon, value, color }: { icon: ReactNode; value: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ display: "flex", width: 24, justifyContent: "center" }}>{icon}</div>
      <span style={{ color, fontSize: 17, lineHeight: "20px", fontWeight: 700, ...signlearnoText }}>
        {value}
      </span>
    </div>
  );
}

export function SidebarItem({ item, active, onClick }: { item: NavItem; active: boolean; onClick: () => void }) {
  const activeBackground = item.kind === "learn" ? theme.colors.blueSoft : "rgba(88, 204, 2, 0.14)";
  const activeBorder = item.kind === "learn" ? theme.colors.blueBorder : "rgba(88, 204, 2, 0.25)";
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

export function GuidebookButton({ color, active, onClick }: { color: string; active: boolean; onClick: () => void }) {
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

export function PaginationBar({ page, total, onPrev, onNext }: { page: number; total: number; onPrev: () => void; onNext: () => void }) {
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

export function ToolWorkspace({ title, subtitle, accent, leftLabel, leftBody, rightLabel, rightBody }: { title: string; subtitle: string; accent: string; leftLabel: string; leftBody: ReactNode; rightLabel: string; rightBody: ReactNode }) {
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

export function PanelCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ width: RIGHT_RAIL_WIDTH, borderRadius: theme.radius.card, border: `2px solid ${theme.colors.border}`, background: theme.colors.surface, padding: 26, boxSizing: "border-box" }}>
      <div style={{ color: theme.colors.textStrong, fontSize: 21, lineHeight: "26px", fontWeight: 700, ...signlearnoText }}>{title}</div>
      {children}
    </section>
  );
}

export function ToolIconButton({ icon, tone = "light", onClick, disabled = false }: { icon: ReactNode; tone?: "light" | "dark"; onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        border: tone === "light" ? "2px solid rgba(88, 204, 2, 0.18)" : "2px solid rgba(255,255,255,0.12)",
        background: tone === "light" ? "rgba(229, 247, 215, 0.5)" : "rgba(255,255,255,0.06)",
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

export function ToolStatCard({ icon, eyebrow, value, tone = "green" }: { icon: ReactNode; eyebrow: string; value: string; tone?: "green" | "orange" }) {
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
      <div style={{ width: 44, height: 44, borderRadius: "50%", background, display: "flex", alignItems: "center", justifyContent: "center", color: iconColor }}>
        {icon}
      </div>
      <div>
        <div style={{ color: theme.colors.green, ...signlearnoUpperLabel }}>{eyebrow}</div>
        <div style={{ marginTop: 2, color: theme.colors.textStrong, fontSize: 15, lineHeight: "24px", fontWeight: 700, ...signlearnoText }}>
          {value}
        </div>
      </div>
    </div>
  );
}
