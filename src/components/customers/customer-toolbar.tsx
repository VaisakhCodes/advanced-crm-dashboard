"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CustomerFilters } from "@/lib/customer-filters";
import type { CustomerStatus } from "@/types/customer";

interface CustomerToolbarProps {
  filters: CustomerFilters;
  onFiltersChange: (filters: CustomerFilters) => void;
}

export function CustomerToolbar({
  filters,
  onFiltersChange,
}: CustomerToolbarProps) {
  function updateFilters(changes: Partial<CustomerFilters>) {
    onFiltersChange({
      ...filters,
      ...changes,
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <label htmlFor="customer-search" className="sr-only">
            Search customers
          </label>

          <HugeiconsIcon
            icon={Search01Icon}
            className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
          />

          <Input
            id="customer-search"
            type="search"
            placeholder="Search name, company, email, phone..."
            value={filters.search}
            onChange={(event) =>
              updateFilters({
                search: event.target.value,
              })
            }
            className="pl-8"
          />
        </div>

        <div className="sm:w-40">
          <label htmlFor="status-filter" className="sr-only">
            Filter by status
          </label>

          <Select
            value={
              filters.statuses.length > 0
                ? filters.statuses[0]
                : "all"
            }
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
            >
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Link
          href="/customers/new"
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Add Customer
        </Link>
      </div>

      
    </div>
  );
}