"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Users, XCircle } from "lucide-react";

import { useCustomers } from "@/hooks/use-customers";
import { formatDate } from "@/lib/format-date";

function getPercentage(
  value: number,
  total: number
): number {
  if (total === 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

function OverviewSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          key={index}
          className="h-72 animate-pulse rounded-xl border border-border bg-card"
        />
      ))}
    </div>
  );
}

export function CustomerOverview() {
  const {
    data: customers,
    isLoading,
    isError,
  } = useCustomers();

  const stats = useMemo(() => {
    const customerList = customers ?? [];

    const total = customerList.length;

    const active = customerList.filter(
      (customer) => customer.status === "active"
    ).length;

    const inactive = customerList.filter(
      (customer) => customer.status === "inactive"
    ).length;

    const activePercentage = getPercentage(
      active,
      total
    );

    const inactivePercentage = getPercentage(
      inactive,
      total
    );

    const recentCustomers = [...customerList]
      .sort((a, b) =>
        b.lastContactDate.localeCompare(
          a.lastContactDate
        )
      )
      .slice(0, 5);

    return {
      total,
      active,
      inactive,
      activePercentage,
      inactivePercentage,
      recentCustomers,
    };
  }, [customers]);

  if (isLoading) {
    return <OverviewSkeleton />;
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5">
        <p className="text-sm font-medium text-foreground">
          Customer overview is temporarily unavailable.
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          Please refresh the page to try again.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Customer Overview */}
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                <Users
                  className="size-4"
                  aria-hidden="true"
                />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Customer Overview
                </h2>

                <p className="text-xs text-muted-foreground">
                  Current customer distribution
                </p>
              </div>
            </div>
          </div>

          <span className="text-sm font-medium text-muted-foreground">
            {stats.total} total
          </span>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-foreground">
                Active
              </span>

              <span className="text-xs text-muted-foreground">
                {stats.active}
              </span>
            </div>

            <div
              className="h-2 overflow-hidden rounded-full bg-muted"
              aria-label={`${stats.activePercentage}% active customers`}
            >
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-500"
                style={{
                  width: `${stats.activePercentage}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-foreground">
                Inactive
              </span>

              <span className="text-xs text-muted-foreground">
                {stats.inactive}
              </span>
            </div>

            <div
              className="h-2 overflow-hidden rounded-full bg-muted"
              aria-label={`${stats.inactivePercentage}% inactive customers`}
            >
              <div
                className="h-full rounded-full bg-muted-foreground/40 transition-[width] duration-500"
                style={{
                  width: `${stats.inactivePercentage}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">
              Active rate
            </p>

            <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
              {stats.activePercentage}%
            </p>
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">
              Inactive rate
            </p>

            <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
              {stats.inactivePercentage}%
            </p>
          </div>
        </div>
      </section>

      {/* Customer Status */}
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
              <CheckCircle2
                className="size-4"
                aria-hidden="true"
              />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Customer Status
              </h2>

              <p className="text-xs text-muted-foreground">
                Active versus inactive customers
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 divide-y divide-border">
          <div className="flex items-center justify-between py-3 first:pt-0">
            <div className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-muted">
                <CheckCircle2
                  className="size-4"
                  aria-hidden="true"
                />
              </span>

              <div>
                <p className="text-sm font-medium text-foreground">
                  Active
                </p>

                <p className="text-xs text-muted-foreground">
                  Currently active customers
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">
                {stats.active}
              </p>

              <p className="text-xs text-muted-foreground">
                {stats.activePercentage}%
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between py-3 last:pb-0">
            <div className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-muted">
                <XCircle
                  className="size-4"
                  aria-hidden="true"
                />
              </span>

              <div>
                <p className="text-sm font-medium text-foreground">
                  Inactive
                </p>

                <p className="text-xs text-muted-foreground">
                  Currently inactive customers
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">
                {stats.inactive}
              </p>

              <p className="text-xs text-muted-foreground">
                {stats.inactivePercentage}%
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Customers */}
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Recent Customers
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Latest customer activity
            </p>
          </div>

          <Link
            href="/customers"
            className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:underline"
          >
            View all customers
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="mt-4 divide-y divide-border">
          {stats.recentCustomers.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No customers yet.
            </div>
          ) : (
            stats.recentCustomers.map((customer) => (
              <Link
                key={customer.id}
                href={`/customers/${customer.id}`}
                className="flex flex-col gap-2 py-3 transition-colors first:pt-0 last:pb-0 hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {customer.name}
                  </p>

                  <p className="truncate text-xs text-muted-foreground">
                    {customer.company}
                  </p>
                </div>

                <div className="flex items-center gap-3 sm:shrink-0">
                  <span
                    className={
                      customer.status === "active"
                        ? "rounded-full bg-primary/10 px-2 py-1 text-[10px] font-medium capitalize text-primary"
                        : "rounded-full bg-muted px-2 py-1 text-[10px] font-medium capitalize text-muted-foreground"
                    }
                  >
                    {customer.status}
                  </span>

                  <span className="text-xs text-muted-foreground">
                    {formatDate(
                      customer.lastContactDate
                    )}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}