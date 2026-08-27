"use client";

import { useMemo } from "react";
import {
  ArrowUpRight,
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

interface StatCardProps {
  icon: typeof Users;
  value: number;
  label: string;
  supportingText: string;
}

function StatCard({
  icon: Icon,
  value,
  label,
  supportingText,
}: StatCardProps) {
  return (
    <article className="group rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
          <Icon className="size-5" aria-hidden="true" />
        </div>

        <ArrowUpRight
          className="size-4 text-muted-foreground/50 transition-colors group-hover:text-muted-foreground"
          aria-hidden="true"
        />
      </div>

      <div className="mt-4 sm:mt-5">
        <p className="text-3xl font-semibold tracking-tight text-foreground">
          {value}
        </p>

        <p className="mt-1 text-sm font-medium text-foreground">
          {label}
        </p>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {supportingText}
        </p>
      </div>
    </article>
  );
}

function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="animate-pulse">
        <div className="size-10 rounded-lg bg-muted" />

        <div className="mt-4 sm:mt-5">
          <div className="h-9 w-16 rounded-md bg-muted" />
          <div className="mt-2 h-4 w-32 rounded bg-muted" />
          <div className="mt-2 h-3 w-40 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function DashboardStats() {
  const {
    data: customers,
    isLoading,
    isError,
  } = useCustomers();

  const stats = useMemo(() => {
    const customerList = customers ?? [];

    const totalCustomers = customerList.length;

    const activeCustomers = customerList.filter(
      (customer) => customer.status === "active"
    ).length;

    const contactedThisWeek = customerList.filter((customer) =>
      isWithinLastSevenDays(customer.lastContactDate)
    ).length;

    return {
      totalCustomers,
      activeCustomers,
      contactedThisWeek,
    };
  }, [customers]);

  if (isLoading) {
    return (
      <section
        className="grid gap-4 md:grid-cols-3"
        aria-label="Loading dashboard statistics"
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </section>
    );
  }

  if (isError) {
    return (
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 sm:p-5 md:col-span-3">
          <p className="text-sm font-medium text-foreground">
            Dashboard statistics are temporarily unavailable.
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Please refresh the page to try again.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="grid gap-4 md:grid-cols-3"
      aria-label="Customer statistics"
    >
      <StatCard
        icon={Users}
        value={stats.totalCustomers}
        label="Total Customers"
        supportingText="Customers in your CRM"
      />

      <StatCard
        icon={UserCheck}
        value={stats.activeCustomers}
        label="Active Customers"
        supportingText="Currently active"
      />

      <StatCard
        icon={PhoneCall}
        value={stats.contactedThisWeek}
        label="Contacted This Week"
        supportingText="Based on last contact date"
      />
    </section>
  );
}