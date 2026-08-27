import { AppShell } from "@/components/layout/app-shell";

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">
            Settings
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your CRM workspace preferences.
          </p>
        </header>

        <section className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">
            Workspace
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Additional workspace configuration can be added
            here as the CRM grows.
          </p>
        </section>

        <section className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">
            Appearance
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Use the theme control in the top bar to switch
            between light and dark mode.
          </p>
        </section>
      </div>
    </AppShell>
  );
}