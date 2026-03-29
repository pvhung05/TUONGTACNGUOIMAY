import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Empty workspace
            </h1>
            <p className="mt-4 max-w-2xl text-slate-600">
              This dashboard is intentionally neutral. No sample scenes,
              onboarding journey, mascot, or subscription-style flow remains in
              the starter.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-5 py-4 text-sm text-slate-600">
            <div className="font-medium text-slate-900">State</div>
            <div className="mt-1">Ready for your first module</div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Add routes</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Create new pages in `app/` for the real product flows your team
            wants to ship.
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Add components</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Build reusable UI in `components/` instead of starting from the
            deleted demo scenes.
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Ship domain logic</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Keep the infrastructure and replace the UI with product-specific
            modules.
          </p>
        </article>
      </section>

      <section className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8">
        <h2 className="text-xl font-semibold text-slate-900">
          Useful starter links
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer">
            <Button>Inspect API docs</Button>
          </a>
          <a href="http://localhost:8000/health" target="_blank" rel="noreferrer">
            <Button variant="outline">Check backend health</Button>
          </a>
        </div>
      </section>
    </div>
  );
}
