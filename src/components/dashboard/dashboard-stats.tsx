"use client";

import { useMemo } from "react";
import {
  PhoneCall,
  UserCheck,
  Users,
} from "lucide-react";

import { useCustomers } from "@/hooks/use-customers";

function isWithinLastSevenDays(dateString: string): boolean {
  const contactDate = new Date(dateString);

  if (Number.isNaN(contactDate.getTime())) {
    return false;
  }

  const now = new Date();
  const sevenDaysAgo = new Date(now);

  sevenDaysAgo.setDate(now.getDate() - 7);

  return contactDate >= sevenDaysAgo && contactDate <= now;
}

function StatCard({
  icon: Icon,
  value,
  label,
  supportingText,
}: {
  icon: typeof Users;
  value: string;
  label: string;
  supportingText: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="size-5" />
        </div>

        <div className="min-w-0">
          <p className="text-3xl font-semibold tracking-tight text-foreground">
            {value}
          </p>

          <p className="mt-1 text-sm font-medium text-foreground">
            {label}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {supportingText}
          </p>
        </div>
      </div>
    </div>
  );
}

export function DashboardStats() {
  const {
    data: customers,
    isLoading,
  } = useCustomers();

  const stats = useMemo(() => {
    const customerList = customers ?? [];

    const totalCustomers = customerList.length;

    const activeCustomers = customerList.filter(
      (customer) => customer.status === "active"
    ).length;

    const contactedThisWeek = customerList.filter(
      (customer) =>
        isWithinLastSevenDays(
          customer.lastContactDate
        )
    ).length;

    return {
      totalCustomers,
      activeCustomers,
      contactedThisWeek,
    };
  }, [customers]);

  if (isLoading) {
    return (
      <section className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-xl border border-border bg-card"
          />
        ))}
      </section>
    );
  }

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <StatCard
        icon={Users}
        value={String(stats.totalCustomers)}
        label="Total Customers"
        supportingText="Customers in your CRM"
      />

      <StatCard
        icon={UserCheck}
        value={String(stats.activeCustomers)}
        label="Active Customers"
        supportingText="Currently active"
      />

      <StatCard
        icon={PhoneCall}
        value={String(stats.contactedThisWeek)}
        label="Contacted This Week"
        supportingText="Based on last contact date"
      />
    </section>
  );
}