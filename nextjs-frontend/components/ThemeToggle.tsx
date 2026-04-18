"use client";

import { useEffect, useState } from "react";
import { signlearnoTheme as theme } from "@/components/signlearno/theme";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  // On mount, read from localStorage or system preference
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 38,
        height: 38,
        borderRadius: 10,
        border: "none",
        background: theme.colors.surface,
        cursor: "pointer",
        color: theme.colors.textMuted,
        transition: "background 140ms",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        const icon = e.currentTarget.querySelector<HTMLElement>("[data-theme-icon]");
        if (icon) icon.style.transform = "translateY(-2px)";
        e.currentTarget.style.color = theme.colors.green;
      }}
      onMouseLeave={(e) => {
        const icon = e.currentTarget.querySelector<HTMLElement>("[data-theme-icon]");
        if (icon) icon.style.transform = "none";
        e.currentTarget.style.color = theme.colors.textMuted;
      }}
    >
      <span
        data-theme-icon
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 180ms ease",
        }}
      >
        {dark ? <Sun size={27} /> : <Moon size={27} />}
      </span>
    </button>
  );
}
