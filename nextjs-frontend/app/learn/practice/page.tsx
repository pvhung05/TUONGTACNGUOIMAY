"use client";

import { signlearnoTheme as theme, signlearnoText, signlearnoUpperLabel } from "@/components/signlearno/theme";

export default function PracticePage() {
  return (
    <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "40px 20px 80px" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: 48, fontWeight: 800, color: theme.colors.textStrong, marginBottom: 16, ...signlearnoText }}>
          Sign Language Practice
        </h1>
        <p style={{ fontSize: 18, color: theme.colors.textMuted, marginBottom: 48, ...signlearnoText }}>
          Master sign language through interactive exercises and practice sessions.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 24,
        marginTop: 48,
      }}>
        {/* Practice Cards */}
        {[
          { title: "Vocabulary Practice", description: "Learn and practice common sign language words" },
          { title: "Sentence Building", description: "Construct proper sentences in sign language" },
          { title: "Speed Challenge", description: "Test your speed and accuracy" },
          { title: "Conversation", description: "Practice real-world conversations" },
        ].map((item) => (
          <div
            key={item.title}
            style={{
              padding: 28,
              borderRadius: 24,
              border: `2px solid ${theme.colors.border}`,
              background: theme.colors.surface,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
              cursor: "pointer",
              transition: "all 200ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.12)";
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.04)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <h3 style={{ fontSize: 20, fontWeight: 700, color: theme.colors.green, marginBottom: 12, ...signlearnoText }}>
              {item.title}
            </h3>
            <p style={{ fontSize: 15, color: theme.colors.textMuted, lineHeight: "24px", ...signlearnoText }}>
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
