import Link from "next/link";
import { Home, LayoutDashboard } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 z-10 w-20 border-r border-slate-200 bg-white p-4">
        <div className="flex flex-col items-center gap-8">
          <Link
            href="/"
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white"
          >
            APP
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900"
            aria-label="Dashboard"
          >
            <LayoutDashboard className="h-5 w-5" />
          </Link>
        </div>
      </aside>
      <main className="ml-20 w-full p-8">
        <header className="mb-6 flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="rounded-full bg-slate-200 px-4 py-2 text-sm text-slate-600">
            Team workspace
          </div>
        </header>
        <section className="grid gap-6">{children}</section>
      </main>
    </div>
  );
}
