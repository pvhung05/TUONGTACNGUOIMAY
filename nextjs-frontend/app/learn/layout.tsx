"use client";

import { Footer } from "@/components/Footer";
import { signlearnoTheme as theme } from "@/components/signlearno/theme";

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main style={{ minHeight: "100vh", paddingTop: "70px", background: theme.colors.surface }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
