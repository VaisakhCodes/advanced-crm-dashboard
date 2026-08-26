"use client";

import { useMemo, useState } from "react";
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
import type { CustomerFilters } from "@/lib/customer-filters";

interface AdvancedCustomerFiltersProps {
  customers: Customer[];
  filters: CustomerFilters;
  onFiltersChange: (filters: CustomerFilters) => void;
}

interface SavedCustomerFilter {
  id: string;
  name: string;
  filters: Pick<
    CustomerFilters,
    | "statuses"
    | "companies"
    | "email"
    | "phone"
    | "lastContactFrom"
    | "lastContactTo"
  >;
}

const SAVED_FILTERS_KEY = "crm-saved-customer-filters";

type SavedFilterValues = SavedCustomerFilter["filters"];

const emptyFilters: SavedFilterValues = {
  statuses: [],
  companies: [],
  email: "",
  phone: "",
  lastContactFrom: "",
  lastContactTo: "",
};

function getSavedFilterValues(
  filters: CustomerFilters
): SavedFilterValues {
  return {
    statuses: [...filters.statuses],
    companies: [...filters.companies],
    email: filters.email,
    phone: filters.phone,
    lastContactFrom: filters.lastContactFrom,
    lastContactTo: filters.lastContactTo,
  };
}

function countActiveFilters(filters: CustomerFilters): number {
  return (
    filters.statuses.length +
    filters.companies.length +
    (filters.email.trim() ? 1 : 0) +
    (filters.phone.trim() ? 1 : 0) +
    (filters.lastContactFrom ? 1 : 0) +
    (filters.lastContactTo ? 1 : 0)
  );
}

export function AdvancedCustomerFilters({
  customers,
  filters,
  onFiltersChange,
}: AdvancedCustomerFiltersProps) {
  const [open, setOpen] = useState(false);

  const [draftFilters, setDraftFilters] =
    useState<CustomerFilters>(filters);

  const [savedFilters, setSavedFilters] = useState<
    SavedCustomerFilter[]
  >([]);

  const [saveMode, setSaveMode] = useState(false);
  const [saveName, setSaveName] = useState("");

  const companies = useMemo(
    () =>
      Array.from(
        new Set(
          customers
            .map((customer) => customer.company.trim())
            .filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b)),
    [customers]
  );

  const appliedFilterCount = countActiveFilters(filters);
  const draftFilterCount = countActiveFilters(draftFilters);

  function loadSavedFilters() {
    try {
      const stored = window.localStorage.getItem(
        SAVED_FILTERS_KEY
      );

      if (!stored) {
        setSavedFilters([]);
        return;
      }

      const parsed: unknown = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        setSavedFilters(parsed as SavedCustomerFilter[]);
      } else {
        setSavedFilters([]);
      }
    } catch {
      setSavedFilters([]);
    }
  }

  function persistSavedFilters(
    nextFilters: SavedCustomerFilter[]
  ) {
    setSavedFilters(nextFilters);

    try {
      window.localStorage.setItem(
        SAVED_FILTERS_KEY,
        JSON.stringify(nextFilters)
      );
    } catch {
      // Ignore storage failures.
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setDraftFilters({
        ...filters,
        statuses: [...filters.statuses],
        companies: [...filters.companies],
      });

      setSaveMode(false);
      setSaveName("");
      loadSavedFilters();
    }

    setOpen(nextOpen);
  }

  function updateDraftFilters(
    changes: Partial<CustomerFilters>
  ) {
    setDraftFilters((current) => ({
      ...current,
      ...changes,
    }));
  }

  function toggleStatus(
    status: CustomerFilters["statuses"][number]
  ) {
    setDraftFilters((current) => {
      const exists = current.statuses.includes(status);

      return {
        ...current,
        statuses: exists
          ? current.statuses.filter(
              (item) => item !== status
            )
          : [...current.statuses, status],
      };
    });
  }

  function toggleCompany(company: string) {
    setDraftFilters((current) => {
      const exists = current.companies.includes(company);

      return {
        ...current,
        companies: exists
          ? current.companies.filter(
              (item) => item !== company
            )
          : [...current.companies, company],
      };
    });
  }

  function clearAllFilters() {
    setDraftFilters((current) => ({
      ...current,
      ...emptyFilters,
    }));
  }

  function handleCancel() {
    setDraftFilters({
      ...filters,
      statuses: [...filters.statuses],
      companies: [...filters.companies],
    });

    setSaveMode(false);
    setSaveName("");
    setOpen(false);
  }

  function handleApply() {
    onFiltersChange({
      ...draftFilters,
      statuses: [...draftFilters.statuses],
      companies: [...draftFilters.companies],
    });

    setOpen(false);
  }

  function saveCurrentFilter() {
    const trimmedName = saveName.trim();

    if (!trimmedName || draftFilterCount === 0) {
      return;
    }

    const savedFilter: SavedCustomerFilter = {
      id: crypto.randomUUID(),
      name: trimmedName,
      filters: getSavedFilterValues(draftFilters),
    };

    persistSavedFilters([
      savedFilter,
      ...savedFilters,
    ]);

    setSaveName("");
    setSaveMode(false);
  }

  function applySavedFilter(
    savedFilter: SavedCustomerFilter
  ) {
    updateDraftFilters({
      ...savedFilter.filters,
      statuses: [...savedFilter.filters.statuses],
      companies: [...savedFilter.filters.companies],
    });
  }

  function deleteSavedFilter(id: string) {
    persistSavedFilters(
      savedFilters.filter(
        (savedFilter) => savedFilter.id !== id
      )
    );
  }

  function applyTemplate(
    template: "active" | "recent" | "inactive"
  ) {
    if (template === "active") {
      updateDraftFilters({
        statuses: ["active"],
        companies: [],
        email: "",
        phone: "",
        lastContactFrom: "",
        lastContactTo: "",
      });

      return;
    }

    if (template === "inactive") {
      updateDraftFilters({
        statuses: ["inactive"],
        companies: [],
        email: "",
        phone: "",
        lastContactFrom: "",
        lastContactTo: "",
      });

      return;
    }

    const dates = customers
      .map((customer) => customer.lastContactDate)
      .filter(Boolean)
      .sort();

    const latestDate = dates.at(-1);

    if (!latestDate) {
      clearAllFilters();
      return;
    }

    const latest = new Date(`${latestDate}T00:00:00`);

    if (Number.isNaN(latest.getTime())) {
      clearAllFilters();
      return;
    }

    const recentFrom = new Date(latest);
    recentFrom.setDate(recentFrom.getDate() - 30);

    updateDraftFilters({
      statuses: [],
      companies: [],
      email: "",
      phone: "",
      lastContactFrom: recentFrom
        .toISOString()
        .slice(0, 10),
      lastContactTo: latestDate,
    });
  }

  return (
    <Sheet
      open={open}
      onOpenChange={handleOpenChange}
    >
      <SheetTrigger>
        Filters

        {appliedFilterCount > 0 && (
          <span className="ml-1.5 rounded-full bg-foreground px-1.5 py-0.5 text-[10px] leading-none text-background">
            {appliedFilterCount}
          </span>
        )}
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex h-full w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-md"
        >
          {/* Header */}
          <SheetHeader className="shrink-0 border-b px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <SheetTitle className="text-base">
                  Filters
                </SheetTitle>

                <SheetDescription className="text-xs">
                  Refine the customer list.
                </SheetDescription>
              </div>

              <div className="flex items-center gap-1">
                {draftFilterCount > 0 && (
                    <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-7 px-2 text-xs"
                    >
                    Clear all
                    </Button>
                )}
                </div>
            </div>
          </SheetHeader>

          {/* Scrollable body */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="flex flex-col gap-3 px-4 py-3">
              {/* Save current filter */}
              <section className="space-y-2">
                {!saveMode ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 w-full text-xs"
                    disabled={draftFilterCount === 0}
                    onClick={() => setSaveMode(true)}
                  >
                    Save current filter
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <label
                      htmlFor="saved-filter-name"
                      className="text-xs font-medium"
                    >
                      Filter name
                    </label>

                    <div className="flex gap-2">
                      <Input
                        id="saved-filter-name"
                        value={saveName}
                        onChange={(event) =>
                          setSaveName(event.target.value)
                        }
                        placeholder="e.g. Active customers"
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            saveCurrentFilter();
                          }

                          if (event.key === "Escape") {
                            setSaveMode(false);
                            setSaveName("");
                          }
                        }}
                        autoFocus
                        className="h-8"
                      />

                      <Button
                        type="button"
                        size="sm"
                        className="h-8"
                        disabled={!saveName.trim()}
                        onClick={saveCurrentFilter}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                )}
              </section>

              {/* Status */}
              <section className="space-y-2">
                <div>
                  <h3 className="text-xs font-medium">
                    Status
                  </h3>

                  <p className="text-[11px] text-muted-foreground">
                    Select one or more statuses.
                  </p>
                </div>

                <div className="flex gap-5">
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={draftFilters.statuses.includes(
                        "active"
                      )}
                      onChange={() =>
                        toggleStatus("active")
                      }
                      className="size-3.5"
                    />
                    <span>Active</span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={draftFilters.statuses.includes(
                        "inactive"
                      )}
                      onChange={() =>
                        toggleStatus("inactive")
                      }
                      className="size-3.5"
                    />
                    <span>Inactive</span>
                  </label>
                </div>
              </section>

              {/* Company */}
              <section className="space-y-2">
                <div>
                  <h3 className="text-xs font-medium">
                    Company
                  </h3>

                  <p className="text-[11px] text-muted-foreground">
                    Select one or more companies.
                  </p>
                </div>

                <div className="rounded-md border border-border">
                  <div className="min-h-8 border-b px-2.5 py-1.5">
                    {draftFilters.companies.length === 0 ? (
                      <p className="text-xs text-muted-foreground">
                        All companies
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {draftFilters.companies.map(
                          (company) => (
                            <span
                              key={company}
                              className="rounded-full bg-muted px-2 py-0.5 text-[10px]"
                            >
                              {company}
                            </span>
                          )
                        )}
                      </div>
                    )}
                  </div>

                  <div className="max-h-24 overflow-y-auto p-1.5">
                    {companies.length === 0 ? (
                      <p className="px-2 py-2 text-xs text-muted-foreground">
                        No companies available.
                      </p>
                    ) : (
                      <div className="space-y-0.5">
                        {companies.map((company) => (
                          <label
                            key={company}
                            className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs hover:bg-muted"
                          >
                            <input
                              type="checkbox"
                              checked={draftFilters.companies.includes(
                                company
                              )}
                              onChange={() =>
                                toggleCompany(company)
                              }
                              className="size-3.5"
                            />

                            <span className="truncate">
                              {company}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Last contact */}
              <section className="space-y-2">
                <div>
                  <h3 className="text-xs font-medium">
                    Last contact
                  </h3>

                  <p className="text-[11px] text-muted-foreground">
                    Filter by last contact date.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label
                      htmlFor="advanced-last-contact-from"
                      className="text-[11px] text-muted-foreground"
                    >
                      From
                    </label>

                    <Input
                      id="advanced-last-contact-from"
                      type="date"
                      value={draftFilters.lastContactFrom}
                      onChange={(event) =>
                        updateDraftFilters({
                          lastContactFrom:
                            event.target.value,
                        })
                      }
                      className="h-8"
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="advanced-last-contact-to"
                      className="text-[11px] text-muted-foreground"
                    >
                      To
                    </label>

                    <Input
                      id="advanced-last-contact-to"
                      type="date"
                      value={draftFilters.lastContactTo}
                      onChange={(event) =>
                        updateDraftFilters({
                          lastContactTo:
                            event.target.value,
                        })
                      }
                      className="h-8"
                    />
                  </div>
                </div>
              </section>

              {/* Phone */}
              <section className="space-y-2">
                <div>
                  <h3 className="text-xs font-medium">
                    Phone number
                  </h3>

                  <p className="text-[11px] text-muted-foreground">
                    Search by partial phone number.
                  </p>
                </div>

                <Input
                  type="search"
                  placeholder="Search phone number..."
                  value={draftFilters.phone}
                  onChange={(event) =>
                    updateDraftFilters({
                      phone: event.target.value,
                    })
                  }
                  className="h-8"
                />
              </section>

              {/* Email */}
              <section className="space-y-2">
                <div>
                  <h3 className="text-xs font-medium">
                    Email
                  </h3>

                  <p className="text-[11px] text-muted-foreground">
                    Search by partial email address.
                  </p>
                </div>

                <Input
                  type="search"
                  placeholder="Search email..."
                  value={draftFilters.email}
                  onChange={(event) =>
                    updateDraftFilters({
                      email: event.target.value,
                    })
                  }
                  className="h-8"
                />
              </section>

              {/* Filter templates */}
              <section className="space-y-2">
                <div>
                  <h3 className="text-xs font-medium">
                    Filter templates
                  </h3>

                  <p className="text-[11px] text-muted-foreground">
                    Quickly apply a common customer filter.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 px-2 text-[11px]"
                    onClick={() =>
                      applyTemplate("active")
                    }
                  >
                    Active
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 px-2 text-[11px]"
                    onClick={() =>
                      applyTemplate("recent")
                    }
                  >
                    Recent
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 px-2 text-[11px]"
                    onClick={() =>
                      applyTemplate("inactive")
                    }
                  >
                    Inactive
                  </Button>
                </div>
              </section>

              {/* Saved filters */}
              <section className="space-y-2 pb-2">
                <div>
                  <h3 className="text-xs font-medium">
                    Saved Filters
                  </h3>

                  <p className="text-[11px] text-muted-foreground">
                    Reuse filter combinations you&apos;ve saved.
                  </p>
                </div>

                {savedFilters.length === 0 ? (
                  <div className="rounded-md border border-dashed border-border px-3 py-3 text-center">
                    <p className="text-xs text-muted-foreground">
                      No saved filters yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {savedFilters.map((savedFilter) => (
                      <div
                        key={savedFilter.id}
                        className="flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5"
                      >
                        <button
                          type="button"
                          className="min-w-0 flex-1 truncate text-left text-xs font-medium hover:underline"
                          onClick={() =>
                            applySavedFilter(
                              savedFilter
                            )
                          }
                        >
                          {savedFilter.name}
                        </button>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-[11px]"
                          onClick={() =>
                            deleteSavedFilter(
                              savedFilter.id
                            )
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>

          {/* Fixed footer */}
          <div className="shrink-0 border-t bg-background px-4 py-3">
            <div className="mb-2 text-[11px] text-muted-foreground">
              {draftFilterCount === 0
                ? "No filters selected."
                : `${draftFilterCount} ${
                    draftFilterCount === 1
                      ? "filter"
                      : "filters"
                  } selected.`}
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 flex-1"
                onClick={handleCancel}
              >
                Cancel
              </Button>

              <Button
                type="button"
                size="sm"
                className="h-8 flex-1"
                onClick={handleApply}
              >
                Apply Filters

                {draftFilterCount > 0 && (
                  <span className="ml-1.5 rounded-full bg-background/20 px-1.5 py-0.5 text-[10px]">
                    {draftFilterCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        
      </SheetContent>
    </Sheet>
  );
}