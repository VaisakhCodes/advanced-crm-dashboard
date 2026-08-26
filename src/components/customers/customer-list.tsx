"use client";

import { useMemo, useState } from "react";
import { useCustomers } from "@/hooks/use-customers";
import {
  CustomerToolbar,
  type StatusFilter,
} from "@/components/customers/customer-toolbar";
import { CustomerTable } from "@/components/customers/customer-table";
import { CustomerPagination } from "@/components/customers/customer-pagination";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 10;

export function CustomerList() {
  const { data: customers, isLoading, isError, refetch } = useCustomers();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusChange(value: StatusFilter) {
    setStatus(value);
    setPage(1);
  }

  function handleResetFilters() {
    setSearch("");
    setStatus("all");
    setPage(1);
  }

  const filtered = useMemo(() => {
    if (!customers) return [];
    const query = search.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesStatus = status === "all" || customer.status === status;
      if (!matchesStatus) return false;

      if (!query) return true;

      return (
        customer.name.toLowerCase().includes(query) ||
        customer.company.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query)
      );
    });
  }, [customers, search, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const hasFiltersApplied = search.trim() !== "" || status !== "all";
  const hasAnyCustomers = (customers?.length ?? 0) > 0;

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-md border border-border py-16 text-center">
        <p className="text-sm text-foreground">
          Something went wrong while loading customers.
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
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
            ? `${filtered.length} of ${customers?.length ?? 0} customers`
            : `${customers?.length ?? 0} customers`}
        </p>
      )}

      <CustomerToolbar
        search={search}
        onSearchChange={handleSearchChange}
        status={status}
        onStatusChange={handleStatusChange}
      />

      {!isLoading && hasAnyCustomers && filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-md border border-border py-16 text-center">
          <p className="text-sm text-foreground">
            No customers match your current search or filter.
          </p>
          <Button variant="outline" size="sm" onClick={handleResetFilters}>
            Reset filters
          </Button>
        </div>
      ) : !isLoading && !hasAnyCustomers ? (
        <div className="flex flex-col items-center gap-1 rounded-md border border-border py-16 text-center">
          <p className="text-sm text-foreground">No customers yet.</p>
          <p className="text-xs text-muted-foreground">
            Customers you add will appear here.
          </p>
        </div>
      ) : (
        <>
          <CustomerTable customers={pageItems} isLoading={isLoading} />
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
