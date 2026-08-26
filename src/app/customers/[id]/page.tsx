import { AppShell } from "@/components/layout/app-shell";
import { CustomerDetail } from "@/components/customers/customer-detail";

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({
  params,
}: CustomerDetailPageProps) {
  const { id } = await params;

  return (
    <AppShell>
      <CustomerDetail id={id} />
    </AppShell>
  );
}