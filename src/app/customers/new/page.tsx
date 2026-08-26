import { AppShell } from "@/components/layout/app-shell";
import { NewCustomerForm } from "@/components/customers/new-customer-form";

export default function NewCustomerPage() {
  return (
    <AppShell>
      <NewCustomerForm />
    </AppShell>
  );
}