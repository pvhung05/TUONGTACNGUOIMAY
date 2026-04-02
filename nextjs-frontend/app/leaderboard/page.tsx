"use client";

import { signlearnoTheme as theme, signlearnoText, signlearnoUpperLabel } from "@/components/signlearno/theme";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Trophy, Medal, Crown } from "lucide-react";

const mockUsers = [
  { rank: 1, name: "Alex M.", xp: 3240, streak: 42, avatar: "🧑‍💻" },
  { rank: 2, name: "Sarah K.", xp: 2980, streak: 31, avatar: "👩‍🎨" },
  { rank: 3, name: "James T.", xp: 2750, streak: 28, avatar: "👨‍🏫" },
  { rank: 4, name: "Lin W.", xp: 2410, streak: 19, avatar: "🧑" },
  { rank: 5, name: "Maria G.", xp: 2200, streak: 15, avatar: "👩" },
  { rank: 6, name: "Tom H.", xp: 1980, streak: 12, avatar: "🧑‍🦱" },
  { rank: 7, name: "Priya S.", xp: 1750, streak: 9, avatar: "👩‍🦰" },
  { rank: 8, name: "David R.", xp: 1530, streak: 7, avatar: "👨‍🦳" },
  { rank: 9, name: "Emma L.", xp: 1320, streak: 5, avatar: "👩‍🦱" },
  { rank: 10, name: "You", xp: 390, streak: 1, avatar: "⭐", isMe: true },
];

const rankColors = [theme.colors.yellow, "#C0C0C0", "#CD7F32"];
const rankIcons = [Crown, Medal, Trophy];

export default function LeaderboardPage() {
  return (
    <>
      <Header />
      <main style={{ minHeight: "100vh", paddingTop: 90, background: theme.colors.canvas, fontFamily: theme.fontFamily }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 80px" }}>
          {/* Hero */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>🏆</div>
            <h1 style={{ ...signlearnoText, fontSize: 32, fontWeight: 900, color: theme.colors.textStrong, margin: 0 }}>
              Leaderboard
            </h1>
            <p style={{ ...signlearnoText, fontSize: 16, color: theme.colors.textMuted, marginTop: 8 }}>
              Top learners this week — keep your streak alive!
            </p>
          </div>

          {/* Top 3 podium */}
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 40, alignItems: "flex-end" }}>
            {[mockUsers[1], mockUsers[0], mockUsers[2]].map((user, i) => {
              const podiumOrder = [1, 0, 2]; // left=2nd, center=1st, right=3rd
              const height = [120, 148, 100][i];
              const color = rankColors[podiumOrder[i]];
              const Icon = rankIcons[podiumOrder[i]];
              return (
                <div key={user.rank} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <div style={{ fontSize: 32 }}>{user.avatar}</div>
                  <div style={{ ...signlearnoText, fontWeight: 700, fontSize: 14, color: theme.colors.textStrong }}>{user.name}</div>
                  <div style={{ ...signlearnoText, fontSize: 13, color: theme.colors.textMuted }}>{user.xp.toLocaleString()} XP</div>
                  <div
                    style={{
                      width: 80,
                      height,
                      borderRadius: "10px 10px 0 0",
                      background: color,
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "center",
                      paddingTop: 12,
                      opacity: 0.9,
                    }}
                  >
                    <Icon size={24} color="#fff" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {mockUsers.map((user) => {
              const isTop3 = user.rank <= 3;
              return (
                <div
                  key={user.rank}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "14px 20px",
                    borderRadius: theme.radius.card,
                    background: (user as any).isMe ? theme.colors.greenSoft : theme.colors.surface,
                    border: `2px solid ${(user as any).isMe ? theme.colors.green : theme.colors.border}`,
                    borderBottom: `4px solid ${(user as any).isMe ? theme.colors.greenDark : theme.colors.border}`,
                  }}
                >
                  {/* Rank */}
                  <div style={{ width: 32, textAlign: "center", ...signlearnoText, fontWeight: 800, fontSize: 18, color: isTop3 ? rankColors[user.rank - 1] : theme.colors.textMuted }}>
                    {user.rank}
                  </div>
                  {/* Avatar */}
                  <div style={{ fontSize: 26 }}>{user.avatar}</div>
                  {/* Name */}
                  <div style={{ flex: 1, ...signlearnoText, fontWeight: 700, fontSize: 16, color: theme.colors.textStrong }}>
                    {user.name}
                    {(user as any).isMe && (
                      <span style={{ marginLeft: 8, ...signlearnoUpperLabel, color: theme.colors.green, background: theme.colors.greenSoft, padding: "2px 8px", borderRadius: 20 }}>YOU</span>
                    )}
                  </div>
                  {/* Streak */}
                  <div style={{ display: "flex", alignItems: "center", gap: 4, ...signlearnoText, fontSize: 14, color: theme.colors.orange, fontWeight: 600 }}>
                    🔥 {user.streak}
                  </div>
                  {/* XP */}
                  <div style={{ ...signlearnoText, fontWeight: 700, fontSize: 15, color: theme.colors.textStrong, minWidth: 80, textAlign: "right" }}>
                    {user.xp.toLocaleString()} XP
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
