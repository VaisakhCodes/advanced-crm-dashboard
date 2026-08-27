"use client";

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import { Skeleton } from "@/components/ui/skeleton";

import type { Customer } from "@/types/customer";

import type {
  CustomerSortField,
  SortDirection,
} from "@/lib/customer-filters";

import { SortableCustomerRow } from "@/components/customers/sortable-customer-row";

const COLUMN_COUNT = 8;

interface CustomerTableProps {
  customers: Customer[];
  isLoading: boolean;
  selectedIds: Set<string>;
  onToggleCustomer: (id: string) => void;
  onToggleAll: () => void;
  onReorder: (activeId: string, overId: string) => void;
  sortField: CustomerSortField | null;
  sortDirection: SortDirection;
  onSort: (field: CustomerSortField) => void;
}

function SortableHeader({
  field,
  label,
  sortField,
  sortDirection,
  onSort,
}: {
  field: CustomerSortField;
  label: string;
  sortField: CustomerSortField | null;
  sortDirection: SortDirection;
  onSort: (field: CustomerSortField) => void;
}) {
  const isActive = sortField === field;

  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      className="inline-flex items-center gap-1 rounded-sm font-medium hover:text-foreground"
      aria-label={`Sort by ${label}`}
    >
      <span>{label}</span>

      {isActive ? (
        sortDirection === "asc" ? (
          <ArrowUp className="size-3.5" />
        ) : (
          <ArrowDown className="size-3.5" />
        )
      ) : (
        <ChevronsUpDown className="size-3.5 text-muted-foreground" />
      )}
    </button>
  );
}

function CustomerTableSkeleton() {
  return (
    <>
      {Array.from({ length: 10 }).map(
        (_, rowIndex) => (
          <TableRow key={rowIndex}>
            {Array.from({
              length: COLUMN_COUNT,
            }).map((__, cellIndex) => (
              <TableCell key={cellIndex}>
                <Skeleton className="h-4 w-full max-w-40" />
              </TableCell>
            ))}
          </TableRow>
        )
      )}
    </>
  );
}

export function CustomerTable({
  customers,
  isLoading,
  selectedIds,
  onToggleCustomer,
  onToggleAll,
  onReorder,
  sortField,
  sortDirection,
  onSort,
}: CustomerTableProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 180,
        tolerance: 5,
      },
    })
  );

  const selectedCount = customers.filter(
    (customer) =>
      selectedIds.has(customer.id)
  ).length;

  const allSelected =
    customers.length > 0 &&
    selectedCount === customers.length;

  const someSelected =
    selectedCount > 0 &&
    selectedCount < customers.length;

  function handleDragEnd(
    event: DragEndEvent
  ) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    onReorder(
      String(active.id),
      String(over.id)
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div className="overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="w-10 px-2"
                  aria-label="Reorder"
                />

                <TableHead className="w-10 px-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(element) => {
                      if (element) {
                        element.indeterminate =
                          someSelected;
                      }
                    }}
                    onChange={onToggleAll}
                    aria-label={
                      allSelected
                        ? "Deselect all customers on this page"
                        : "Select all customers on this page"
                    }
                    className="size-4 cursor-pointer accent-primary"
                  />
                </TableHead>

                <TableHead className="min-w-[180px]">
                  <SortableHeader
                    field="name"
                    label="Customer"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={onSort}
                  />
                </TableHead>

                <TableHead className="min-w-[160px]">
                  Company
                </TableHead>

                <TableHead className="min-w-[220px]">
                  <SortableHeader
                    field="email"
                    label="Email"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={onSort}
                  />
                </TableHead>

                <TableHead className="min-w-[140px]">
                  Phone
                </TableHead>

                <TableHead className="min-w-[100px]">
                  Status
                </TableHead>

                <TableHead className="min-w-[140px]">
                  <SortableHeader
                    field="lastContactDate"
                    label="Last contact"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={onSort}
                  />
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <CustomerTableSkeleton />
              ) : customers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={COLUMN_COUNT}
                    className="h-24 text-center text-sm text-muted-foreground"
                  >
                    No customers found.
                  </TableCell>
                </TableRow>
              ) : (
                <SortableContext
                  items={customers.map(
                    (customer) =>
                      customer.id
                  )}
                  strategy={
                    verticalListSortingStrategy
                  }
                >
                  {customers.map((customer) => (
                    <SortableCustomerRow
                      key={customer.id}
                      customer={customer}
                      isSelected={selectedIds.has(
                        customer.id
                      )}
                      onToggleCustomer={
                        onToggleCustomer
                      }
                    />
                  ))}
                </SortableContext>
              )}
            </TableBody>
          </Table>
        </DndContext>
      </div>
    </div>
  );
}