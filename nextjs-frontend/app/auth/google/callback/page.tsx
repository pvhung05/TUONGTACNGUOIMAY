"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setStoredToken } from "@/lib/api";
import { signlearnoTheme as theme, signlearnoText } from "@/components/signlearno/theme";

function readTokenFromHash(): string {
  if (typeof window === "undefined") return "";

  const hash = window.location.hash.replace(/^#/, "");
  const params = new URLSearchParams(hash);
  return params.get("token") || "";
}

export default function GoogleAuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Completing Google sign in...");

  useEffect(() => {
    const token = readTokenFromHash();

    if (!token) {
      setMessage("Missing Google login token.");
      return;
    }

    setStoredToken(token);
    window.history.replaceState(null, "", "/auth/google/callback");
    router.replace("/dashboard");
  }, [router]);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "transparent",
        fontFamily: theme.fontFamily,
      }}
    >
      <div
        style={{
          padding: "24px 28px",
          borderRadius: 24,
          border: `2px solid ${theme.colors.border}`,
          background: theme.colors.surface,
          boxShadow: "0 18px 40px rgba(17, 24, 39, 0.08)",
          color: theme.colors.textStrong,
          ...signlearnoText,
        }}
      >
        {message}
      </div>
    </main>
  );
}