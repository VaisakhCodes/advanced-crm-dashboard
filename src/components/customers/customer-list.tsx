"use client";

import { useMemo, useState } from "react";
import {
  useCustomers,
  useBulkDeleteCustomers,
  useBulkUpdateCustomers,
  useReorderCustomers,
} from "@/hooks/use-customers";

import { CustomerToolbar } from "@/components/customers/customer-toolbar";
import { CustomerTable } from "@/components/customers/customer-table";
import { CustomerPagination } from "@/components/customers/customer-pagination";
import { AdvancedCustomerFilters } from "@/components/customers/advanced-customer-filters";
import { DeleteCustomerDialog } from "@/components/customers/delete-customer-dialog";
import { Button } from "@/components/ui/button";

import {
  defaultCustomerFilters,
  filterCustomers,
  hasActiveCustomerFilters,
  type CustomerFilters,
} from "@/lib/customer-filters";

import type { CustomerStatus } from "@/types/customer";

const PAGE_SIZE = 10;

export function CustomerList() {
  const {
    data: customers,
    isLoading,
    isError,
    refetch,
  } = useCustomers();

  const bulkUpdateCustomers =
    useBulkUpdateCustomers();

  const bulkDeleteCustomers =
    useBulkDeleteCustomers();

  const reorderCustomers =
    useReorderCustomers();

  const [filters, setFilters] =
    useState<CustomerFilters>(
      defaultCustomerFilters
    );

  const [page, setPage] = useState(1);

  const [selectedIds, setSelectedIds] =
    useState<Set<string>>(new Set());

  const [bulkDeleteOpen, setBulkDeleteOpen] =
    useState(false);

  function handleFiltersChange(
    nextFilters: CustomerFilters
  ) {
    setFilters(nextFilters);
    setPage(1);
    setSelectedIds(new Set());
  }

  function handleResetFilters() {
    setFilters(defaultCustomerFilters);
    setPage(1);
    setSelectedIds(new Set());
  }

  const filtered = useMemo(() => {
    return filterCustomers(
      customers ?? [],
      filters
    );
  }, [customers, filters]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const currentPage = Math.min(
    page,
    totalPages
  );

  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const hasFiltersApplied =
    hasActiveCustomerFilters(filters);

  const hasAnyCustomers =
    (customers?.length ?? 0) > 0;

  const selectedCount = selectedIds.size;

  function handleToggleCustomer(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }

  function handleToggleAll() {
    setSelectedIds((current) => {
      const next = new Set(current);

      const allSelected =
        pageItems.length > 0 &&
        pageItems.every((customer) =>
          next.has(customer.id)
        );

      if (allSelected) {
        pageItems.forEach((customer) =>
          next.delete(customer.id)
        );
      } else {
        pageItems.forEach((customer) =>
          next.add(customer.id)
        );
      }

      return next;
    });
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  async function handleBulkStatusUpdate(
    status: CustomerStatus
  ) {
    const ids = Array.from(selectedIds);

    if (ids.length === 0) {
      return;
    }

    try {
      await bulkUpdateCustomers.mutateAsync({
        ids,
        status,
      });

      clearSelection();
    } catch {
      // Keep the selection so the user can retry.
    }
  }

  async function handleBulkDelete() {
    const ids = Array.from(selectedIds);

    if (ids.length === 0) {
      return;
    }

    try {
      await bulkDeleteCustomers.mutateAsync(ids);

      clearSelection();
      setBulkDeleteOpen(false);
    } catch {
      // Keep the dialog open so the user can retry.
    }
  }

  async function handleReorder(
    activeId: string,
    overId: string
  ) {
    if (activeId === overId) {
      return;
    }

    try {
      await reorderCustomers.mutateAsync({
        activeId,
        overId,
      });
    } catch {
      // Keep the current UI state and allow the user
      // to retry the reorder operation.
    }
  }

  function handlePageChange(nextPage: number) {
    setPage(nextPage);
    clearSelection();
  }

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

      {selectedCount > 0 && (
        <div className="flex flex-col gap-3 rounded-md border border-border bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-medium">
            {selectedCount}{" "}
            {selectedCount === 1
              ? "customer"
              : "customers"}{" "}
            selected
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={
                bulkUpdateCustomers.isPending ||
                bulkDeleteCustomers.isPending ||
                reorderCustomers.isPending
              }
              onClick={() =>
                handleBulkStatusUpdate("active")
              }
            >
              Set Active
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={
                bulkUpdateCustomers.isPending ||
                bulkDeleteCustomers.isPending ||
                reorderCustomers.isPending
              }
              onClick={() =>
                handleBulkStatusUpdate("inactive")
              }
            >
              Set Inactive
            </Button>

            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={
                bulkUpdateCustomers.isPending ||
                bulkDeleteCustomers.isPending ||
                reorderCustomers.isPending
              }
              onClick={() =>
                setBulkDeleteOpen(true)
              }
            >
              Delete
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={
                bulkUpdateCustomers.isPending ||
                bulkDeleteCustomers.isPending ||
                reorderCustomers.isPending
              }
              onClick={clearSelection}
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {!isLoading &&
      hasAnyCustomers &&
      filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-md border border-border py-16 text-center">
          <p className="text-sm text-foreground">
            No customers match your current search or
            filter.
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
            selectedIds={selectedIds}
            onToggleCustomer={handleToggleCustomer}
            onToggleAll={handleToggleAll}
            onReorder={handleReorder}
          />

          {!isLoading && filtered.length > 0 && (
            <CustomerPagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      <DeleteCustomerDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        customerName={`${selectedCount} ${
          selectedCount === 1
            ? "customer"
            : "customers"
        }`}
        count={selectedCount}
        onConfirm={handleBulkDelete}
        isDeleting={bulkDeleteCustomers.isPending}
      />
    </div>
  );
}