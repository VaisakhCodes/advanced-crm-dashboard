import { AppShell } from "@/components/layout/app-shell";
import { ComingSoon } from "@/components/layout/coming-soon";

export default function DealsPage() {
  return (
    <AppShell>
      <ComingSoon
        title="Deals"
        description="Deal management is not part of this assignment, but this workspace is ready for future expansion."
      />
    </AppShell>
  );
}