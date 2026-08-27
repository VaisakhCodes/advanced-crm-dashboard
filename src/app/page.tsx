import { AppShell } from "@/components/layout/app-shell";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";

export default function Home() {
  return (
    <AppShell>
      <div className="space-y-8">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Welcome to your CRM workspace.
          </p>
        </header>

        <DashboardStats />
      </div>
    </AppShell>
  );
}