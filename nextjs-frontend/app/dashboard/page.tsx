"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { signlearnoTheme as theme, signlearnoText } from "@/components/signlearno/theme";
import { Flame, TrendingUp, BookOpen, Target, Trophy } from "lucide-react";
import { getDashboard, getLearningHistory, getProfile } from "@/lib/api";
import type { DashboardData, LearningHistoryItem } from "@/lib/api/backend";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [history, setHistory] = useState<LearningHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [dashboardData, historyData] = await Promise.all([
          getDashboard(),
          getLearningHistory(),
          getProfile(),
        ]);
        setDashboard(dashboardData);
        setHistory(historyData);
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const stats = [
    {
      label: "Total XP",
      value: `${dashboard?.stats?.totalScore ?? 0}`,
      change: "From completed lessons",
      icon: Flame,
      color: theme.colors.orange,
      bgColor: "rgba(255, 150, 0, 0.12)",
    },
    {
      label: "Streak",
      value: `${dashboard?.stats?.streak ?? 0} days`,
      change: "Keep it up!",
      icon: Trophy,
      color: theme.colors.yellow,
      bgColor: "rgba(255, 200, 0, 0.12)",
    },
    {
      label: "Lessons Done",
      value: `${dashboard?.stats?.totalLessonsCompleted ?? 0}`,
      change: "Total completed",
      icon: BookOpen,
      color: theme.colors.blue,
      bgColor: "rgba(28, 176, 246, 0.12)",
    },
    {
      label: "Recent Activity",
      value: `${dashboard?.stats?.recentActivities ?? 0}`,
      change: "Last 3 days",
      icon: Target,
      color: theme.colors.green,
      bgColor: "rgba(88, 204, 2, 0.12)",
    },
  ];

  return (
    <>
      <Header />
      <main style={{ minHeight: "100vh", background: theme.colors.surface, paddingTop: "70px" }}>
        <div
          style={{
            maxWidth: "100%",
            margin: "0",
            padding: "20px 24px",
          }}
        >
          {loading ? (
            <div style={{ ...signlearnoText, color: theme.colors.textMuted, marginBottom: 20 }}>
              Loading dashboard...
            </div>
          ) : null}
          {error ? (
            <div style={{ ...signlearnoText, color: theme.colors.red, marginBottom: 20 }}>{error}</div>
          ) : null}
          {/* Stats Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 20,
              marginBottom: 48,
            }}
          >
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  style={{
                    borderRadius: 20,
                    border: `2px solid ${theme.colors.border}`,
                    background: theme.colors.surface,
                    padding: 24,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
                    transition: "all 200ms ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(0, 0, 0, 0.12)";
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.04)";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: stat.bgColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: stat.color,
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    <span
                      style={{
                        color: theme.colors.textMuted,
                        fontSize: 14,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        ...signlearnoText,
                      }}
                    >
                      {stat.label}
                    </span>
                  </div>

                  <div>
                    <div
                      style={{
                        color: theme.colors.textStrong,
                        fontSize: 28,
                        fontWeight: 800,
                        lineHeight: "34px",
                        ...signlearnoText,
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        marginTop: 8,
                        color: theme.colors.green,
                        fontSize: 13,
                        fontWeight: 600,
                        ...signlearnoText,
                      }}
                    >
                      {stat.change}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 20,
            }}
          >
            {/* Progress Chart */}
            <div
              style={{
                borderRadius: 20,
                border: `2px solid ${theme.colors.border}`,
                background: theme.colors.surface,
                padding: 28,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "rgba(88, 204, 2, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: theme.colors.green,
                  }}
                >
                  <TrendingUp size={20} />
                </div>
                <h2
                  style={{
                    color: theme.colors.textStrong,
                    fontSize: 20,
                    fontWeight: 700,
                    ...signlearnoText,
                  }}
                >
                  Weekly Progress
                </h2>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: 12,
                }}
              >
                {["M", "Tu", "W", "Th", "F", "Sa", "Su"].map((day, idx) => {
                  const height = [65, 55, 75, 85, 70, 95, 100];
                  return (
                    <div key={day} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <div
                        style={{
                          width: "100%",
                          height: `${height[idx]}px`,
                          borderRadius: 12,
                          background: `linear-gradient(180deg, ${theme.colors.green} 0%, ${theme.colors.greenSoft} 100%)`,
                          transition: "all 200ms",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = "0.8";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = "1";
                        }}
                      />
                      <div
                        style={{
                          textAlign: "center",
                          color: theme.colors.textMuted,
                          fontSize: 12,
                          fontWeight: 600,
                          ...signlearnoText,
                        }}
                      >
                        {day}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div
              style={{
                borderRadius: 20,
                border: `2px solid ${theme.colors.border}`,
                background: theme.colors.surface,
                padding: 28,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
              }}
            >
              <h2
                style={{
                  color: theme.colors.textStrong,
                  fontSize: 20,
                  fontWeight: 700,
                  marginBottom: 24,
                  ...signlearnoText,
                }}
              >
                Recent Activity
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {history.slice(0, 5).map((item, idx) => (
                  <div key={item._id} style={{ paddingBottom: idx < history.length - 1 ? 16 : 0, borderBottom: idx < history.length - 1 ? `1px solid ${theme.colors.border}` : "none" }}>
                    <div
                      style={{
                        color: theme.colors.textMuted,
                        fontSize: 12,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        marginBottom: 8,
                        ...signlearnoText,
                      }}
                    >
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                    <div
                      style={{
                        padding: "8px 12px",
                        borderRadius: 10,
                        background: theme.colors.greenSoft,
                        color: theme.colors.green,
                        fontSize: 13,
                        fontWeight: 600,
                        marginBottom: 6,
                        ...signlearnoText,
                      }}
                    >
                      ✓ {typeof item.lessonId === "string" ? item.lessonId : item.lessonId.title}
                    </div>
                    <div
                      style={{
                        marginTop: 10,
                        color: theme.colors.orange,
                        fontSize: 13,
                        fontWeight: 700,
                        ...signlearnoText,
                      }}
                    >
                      Completed
                    </div>
                  </div>
                ))}
                {!loading && history.length === 0 ? (
                  <div style={{ ...signlearnoText, color: theme.colors.textMuted }}>No learning history yet.</div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
