"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Customer } from "@/types/customer";
import type {
  CustomerFilters,
} from "@/lib/customer-filters";

interface AdvancedCustomerFiltersProps {
  customers: Customer[];
  filters: CustomerFilters;
  onFiltersChange: (filters: CustomerFilters) => void;
}

export function AdvancedCustomerFilters({
  customers,
  filters,
  onFiltersChange,
}: AdvancedCustomerFiltersProps) {
  const companies = useMemo(
    () =>
      Array.from(
        new Set(
          customers
            .map((customer) => customer.company.trim())
            .filter(Boolean)
        )
      ).sort(),
    [customers]
  );

  const activeFilterCount =
    filters.statuses.length +
    filters.companies.length +
    (filters.email.trim() ? 1 : 0) +
    (filters.phone.trim() ? 1 : 0) +
    (filters.lastContactFrom ? 1 : 0) +
    (filters.lastContactTo ? 1 : 0);

  function updateFilters(
    changes: Partial<CustomerFilters>
  ) {
    onFiltersChange({
      ...filters,
      ...changes,
    });
  }

  function toggleStatus(
    status: CustomerFilters["statuses"][number]
  ) {
    const exists = filters.statuses.includes(status);

    updateFilters({
      statuses: exists
        ? filters.statuses.filter((item) => item !== status)
        : [...filters.statuses, status],
    });
  }

  

  function clearAllFilters() {
    updateFilters({
      statuses: [],
      companies: [],
      email: "",
      phone: "",
      lastContactFrom: "",
      lastContactTo: "",
    });
  }

  return (
    <Sheet>
      <SheetTrigger>
        Filters
        {activeFilterCount > 0 && (
            <span className="ml-1.5 rounded-full bg-foreground px-1.5 py-0.5 text-[10px] leading-none text-background">
            {activeFilterCount}
            </span>
        )}
        </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full overflow-y-auto sm:max-w-md"
      >
        <SheetHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <SheetTitle>Advanced Filters</SheetTitle>
              <SheetDescription>
                Refine the customer list using multiple filters.
              </SheetDescription>
            </div>

            {activeFilterCount > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
              >
                Clear all
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-6">
          <section className="space-y-3">
            <div>
              <h3 className="text-sm font-medium">
                Status
              </h3>
              <p className="text-xs text-muted-foreground">
                Select one or more statuses.
              </p>
            </div>

            <div className="space-y-2">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.statuses.includes("active")}
                  onChange={() => toggleStatus("active")}
                  className="size-4"
                />
                Active
              </label>

              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.statuses.includes("inactive")}
                  onChange={() => toggleStatus("inactive")}
                  className="size-4"
                />
                Inactive
              </label>
            </div>
          </section>

          <section className="space-y-3">
            <div>
              <h3 className="text-sm font-medium">
                Company
              </h3>
              <p className="text-xs text-muted-foreground">
                Select one or more companies.
              </p>
            </div>

            <select
              multiple
              value={filters.companies}
              onChange={(event) => {
                const selectedCompanies = Array.from(
                  event.target.selectedOptions,
                  (option) => option.value
                );

                updateFilters({
                  companies: selectedCompanies,
                });
              }}
              className="min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              aria-label="Filter by company"
            >
              {companies.map((company) => (
                <option
                  key={company}
                  value={company}
                >
                  {company}
                </option>
              ))}
            </select>
          </section>

          <section className="space-y-3">
            <div>
              <h3 className="text-sm font-medium">
                Last contact
              </h3>
              <p className="text-xs text-muted-foreground">
                Filter by last contact date.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label
                  htmlFor="advanced-last-contact-from"
                  className="text-xs text-muted-foreground"
                >
                  From
                </label>

                <Input
                  id="advanced-last-contact-from"
                  type="date"
                  value={filters.lastContactFrom}
                  onChange={(event) =>
                    updateFilters({
                      lastContactFrom: event.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="advanced-last-contact-to"
                  className="text-xs text-muted-foreground"
                >
                  To
                </label>

                <Input
                  id="advanced-last-contact-to"
                  type="date"
                  value={filters.lastContactTo}
                  onChange={(event) =>
                    updateFilters({
                      lastContactTo: event.target.value,
                    })
                  }
                />
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <div>
              <h3 className="text-sm font-medium">
                Phone number
              </h3>
              <p className="text-xs text-muted-foreground">
                Search by partial phone number.
              </p>
            </div>

            <Input
              type="search"
              placeholder="Search phone number..."
              value={filters.phone}
              onChange={(event) =>
                updateFilters({
                  phone: event.target.value,
                })
              }
            />
          </section>

          <section className="space-y-3">
            <div>
              <h3 className="text-sm font-medium">
                Email
              </h3>
              <p className="text-xs text-muted-foreground">
                Search by partial email address.
              </p>
            </div>

            <Input
              type="search"
              placeholder="Search email..."
              value={filters.email}
              onChange={(event) =>
                updateFilters({
                  email: event.target.value,
                })
              }
            />
          </section>

          <div className="border-t pt-4">
            <p className="text-xs text-muted-foreground">
              {activeFilterCount === 0
                ? "No advanced filters applied."
                : `${activeFilterCount} advanced ${
                    activeFilterCount === 1
                      ? "filter"
                      : "filters"
                  } applied.`}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}