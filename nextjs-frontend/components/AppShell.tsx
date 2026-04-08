"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";

const HIDDEN_HEADER_PATHS = ["/login", "/register"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideHeader = HIDDEN_HEADER_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  return (
    <>
      {!hideHeader ? <Header /> : null}
      {children}
    </>
  );
}