"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { signlearnoTheme as theme } from "@/components/signlearno/theme";

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main style={{ minHeight: "100vh", paddingTop: "70px", background: theme.colors.surface }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
