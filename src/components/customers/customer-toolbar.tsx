"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  Add01Icon,
  Download01Icon,
  FilterIcon,
  KeyboardIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import type { CustomerFilters } from "@/lib/customer-filters";
import type { CustomerStatus } from "@/types/customer";

const SEARCH_DEBOUNCE_MS = 300;

interface CustomerToolbarProps {
  filters: CustomerFilters;
  onFiltersChange: (filters: CustomerFilters) => void;
  onExport: () => void;
}

export function CustomerToolbar({
  filters,
  onFiltersChange,
  onExport,
}: CustomerToolbarProps) {
  const searchTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current !== null) {
        window.clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  function updateFilters(
    changes: Partial<CustomerFilters>
  ) {
    onFiltersChange({
      ...filters,
      ...changes,
    });
  }

  function handleSearchChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const nextSearch = event.target.value;

    if (searchTimeoutRef.current !== null) {
      window.clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = window.setTimeout(() => {
      onFiltersChange({
        ...filters,
        search: nextSearch,
      });

      searchTimeoutRef.current = null;
    }, SEARCH_DEBOUNCE_MS);
  }

  const selectedStatus =
    filters.statuses.length > 0
      ? filters.statuses[0]
      : null;

  const statusLabel =
    selectedStatus === "active"
      ? "Active"
      : selectedStatus === "inactive"
        ? "Inactive"
        : "All";

  return (
    <div className="w-full">
      <div className="flex w-full flex-col gap-3 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative min-w-0 flex-1 md:min-w-0 md:max-w-[580px]">
          <label
            htmlFor="customer-search"
            className="sr-only"
          >
            Search customers
          </label>

          <HugeiconsIcon
            icon={Search01Icon}
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />

          <Input
            key={filters.search}
            id="customer-search"
            type="search"
            placeholder="Search name, company, email or phone..."
            defaultValue={filters.search}
            onChange={handleSearchChange}
            className="h-10 w-full bg-background pl-9 pr-12 shadow-none"
          />

          <span
            className="pointer-events-none absolute right-2.5 top-1/2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-md border border-border bg-muted/40 text-muted-foreground"
            aria-label="Keyboard shortcut available"
            title="Keyboard shortcut"
          >
            <HugeiconsIcon
              icon={KeyboardIcon}
              className="size-3.5"
              aria-hidden="true"
            />
          </span>
        </div>

        {/* Status */}
        <div className="w-full md:w-[190px] md:shrink-0">
          <label
            htmlFor="status-filter"
            className="sr-only"
          >
            Filter by status
          </label>

          <Select
            value={selectedStatus ?? "all"}
            onValueChange={(value) =>
              updateFilters({
                statuses:
                  value === "all"
                    ? []
                    : [value as CustomerStatus],
              })
            }
          >
            <SelectTrigger
              id="status-filter"
              aria-label="Filter by status"
              className="!h-10 min-h-10 w-full justify-between bg-background px-3.5 shadow-none"
            >
              <span className="flex min-w-0 items-center gap-2">
                <HugeiconsIcon
                  icon={FilterIcon}
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />

                <span className="truncate text-sm font-medium">
                  Status: {statusLabel}
                </span>
              </span>
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">
                All statuses
              </SelectItem>

              <SelectItem value="active">
                Active
              </SelectItem>

              <SelectItem value="inactive">
                Inactive
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Export */}
        <button
          type="button"
          onClick={onExport}
          className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 md:w-40"
        >
          <HugeiconsIcon
            icon={Download01Icon}
            className="size-4"
            aria-hidden="true"
          />

          <span>Export CSV</span>
        </button>

        {/* Primary action */}
        <Link
          href="/customers/new"
          className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 md:w-[190px]"
        >
          <HugeiconsIcon
            icon={Add01Icon}
            className="size-4"
            aria-hidden="true"
          />

          <span>Add Customer</span>
        </Link>
      </div>
    </div>
  );
}