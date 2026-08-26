"use client";

import { useMemo, useState } from "react";
import { useCustomers } from "@/hooks/use-customers";
import { CustomerToolbar } from "@/components/customers/customer-toolbar";
import { CustomerTable } from "@/components/customers/customer-table";
import { CustomerPagination } from "@/components/customers/customer-pagination";
import { Button } from "@/components/ui/button";
import { AdvancedCustomerFilters } from "@/components/customers/advanced-customer-filters";
import {
  defaultCustomerFilters,
  filterCustomers,
  hasActiveCustomerFilters,
  type CustomerFilters,
} from "@/lib/customer-filters";

const PAGE_SIZE = 10;

export function CustomerList() {
  const {
    data: customers,
    isLoading,
    isError,
    refetch,
  } = useCustomers();

  const [filters, setFilters] =
    useState<CustomerFilters>(defaultCustomerFilters);

  const [page, setPage] = useState(1);

  function handleFiltersChange(nextFilters: CustomerFilters) {
    setFilters(nextFilters);
    setPage(1);
  }

  function handleResetFilters() {
    setFilters(defaultCustomerFilters);
    setPage(1);
  }

  const filtered = useMemo(() => {
    if (!customers) {
      return [];
    }

    return filterCustomers(customers, filters);
  }, [customers, filters]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const hasFiltersApplied = hasActiveCustomerFilters(filters);
  const hasAnyCustomers = (customers?.length ?? 0) > 0;

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-md border border-border py-16 text-center">
        <p className="text-sm text-foreground">
          Something went wrong while loading customers.
        </p>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {!isLoading && (
        <p className="text-xs text-muted-foreground">
          {hasFiltersApplied
            ? `${filtered.length} of ${
                customers?.length ?? 0
              } customers`
            : `${customers?.length ?? 0} customers`}
        </p>
      )}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <CustomerToolbar
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />

        {customers && (
          <AdvancedCustomerFilters
            customers={customers}
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        )}
      </div>

      {!isLoading &&
      hasAnyCustomers &&
      filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-md border border-border py-16 text-center">
          <p className="text-sm text-foreground">
            No customers match your current search or filter.
          </p>

          <Button
            variant="outline"
            size="sm"
            onClick={handleResetFilters}
          >
            Reset filters
          </Button>
        </div>
      ) : !isLoading && !hasAnyCustomers ? (
        <div className="flex flex-col items-center gap-1 rounded-md border border-border py-16 text-center">
          <p className="text-sm text-foreground">
            No customers yet.
          </p>

          <p className="text-xs text-muted-foreground">
            Customers you add will appear here.
          </p>
        </div>
      ) : (
        <>
          <CustomerTable
            customers={pageItems}
            isLoading={isLoading}
          />

          {!isLoading && filtered.length > 0 && (
            <CustomerPagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}