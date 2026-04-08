"use client";

import { useEffect, useMemo, useState } from "react";
import { signlearnoTheme as theme, signlearnoText, signlearnoUpperLabel } from "@/components/signlearno/theme";
import { Footer } from "@/components/Footer";
import { Trophy, Medal, Crown } from "lucide-react";
import { getLeaderboardTop10, getMyRank } from "@/lib/api";
import type { LeaderboardUser } from "@/lib/api/backend";

const rankColors = [theme.colors.yellow, "#C0C0C0", "#CD7F32"];
const rankIcons = [Crown, Medal, Trophy];

export default function LeaderboardPage() {
  type RankedUser = {
    rank: number;
    name: string;
    xp: number;
    streak: number;
    isMe: boolean;
  };
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const top10 = await getLeaderboardTop10();
        setUsers(top10);
        try {
          const rank = await getMyRank();
          setMyRank(rank.rank);
        } catch {
          setMyRank(null);
        }
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : "Failed to load leaderboard.");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const rankedUsers = useMemo<RankedUser[]>(
    () =>
      users.map((user, index) => ({
        rank: index + 1,
        name: user.username,
        xp: user.score,
        streak: user.streak,
        isMe: myRank !== null && myRank === index + 1,
      })),
    [myRank, users],
  );

  const podium: RankedUser[] = [
    rankedUsers[1],
    rankedUsers[0],
    rankedUsers[2],
  ].filter((item): item is RankedUser => Boolean(item));

  return (
    <>
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
          {loading ? <p style={{ ...signlearnoText, color: theme.colors.textMuted }}>Loading leaderboard...</p> : null}
          {error ? <p style={{ ...signlearnoText, color: theme.colors.red }}>{error}</p> : null}

          {/* Top 3 podium */}
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 40, alignItems: "flex-end" }}>
            {podium.map((user, i) => {
              const podiumOrder = [1, 0, 2]; // left=2nd, center=1st, right=3rd
              const height = [120, 148, 100][i];
              const color = rankColors[podiumOrder[i]];
              const Icon = rankIcons[podiumOrder[i]];
              return (
                <div key={user.rank} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <div style={{ fontSize: 32 }}>👤</div>
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
            {rankedUsers.map((user) => {
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
                    background: user.isMe ? theme.colors.greenSoft : theme.colors.surface,
                    border: `2px solid ${user.isMe ? theme.colors.green : theme.colors.border}`,
                    borderBottom: `4px solid ${user.isMe ? theme.colors.greenDark : theme.colors.border}`,
                  }}
                >
                  {/* Rank */}
                  <div style={{ width: 32, textAlign: "center", ...signlearnoText, fontWeight: 800, fontSize: 18, color: isTop3 ? rankColors[user.rank - 1] : theme.colors.textMuted }}>
                    {user.rank}
                  </div>
                  {/* Avatar */}
                  <div style={{ fontSize: 26 }}>👤</div>
                  {/* Name */}
                  <div style={{ flex: 1, ...signlearnoText, fontWeight: 700, fontSize: 16, color: theme.colors.textStrong }}>
                    {user.name}
                    {user.isMe && (
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
            {!loading && rankedUsers.length === 0 ? (
              <div style={{ ...signlearnoText, color: theme.colors.textMuted }}>No leaderboard data available.</div>
            ) : null}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
