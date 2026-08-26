import { AppShell } from "@/components/layout/app-shell";
import { CustomerList } from "@/components/customers/customer-list";

export default function CustomersPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Customers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage and view your customer relationships.
          </p>
        </div>
        <CustomerList />
      </div>
    </AppShell>
  );
}
