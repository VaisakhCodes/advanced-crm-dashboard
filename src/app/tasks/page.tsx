import { AppShell } from "@/components/layout/app-shell";
import { ComingSoon } from "@/components/layout/coming-soon";

export default function TasksPage() {
  return (
    <AppShell>
      <ComingSoon
        title="Tasks"
        description="Task management is reserved for a future CRM module."
      />
    </AppShell>
  );
}