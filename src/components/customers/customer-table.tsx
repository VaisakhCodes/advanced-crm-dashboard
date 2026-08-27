import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format-date";
import type { Customer } from "@/types/customer";

const COLUMN_COUNT = 7;

function StatusBadge({ status }: { status: Customer["status"] }) {
  return (
    <Badge
      variant={status === "active" ? "default" : "secondary"}
      className="capitalize"
    >
      {status}
    </Badge>
  );
}

function CustomerTableSkeleton() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: COLUMN_COUNT }).map((__, cellIndex) => (
            <TableCell key={cellIndex}>
              <Skeleton className="h-4 w-full max-w-40" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

interface CustomerTableProps {
  customers: Customer[];
  isLoading: boolean;
  selectedIds: Set<string>;
  onToggleCustomer: (id: string) => void;
  onToggleAll: () => void;
}

export function CustomerTable({
  customers,
  isLoading,
  selectedIds,
  onToggleCustomer,
  onToggleAll,
}: CustomerTableProps) {
  const selectedCount = customers.filter((customer) =>
    selectedIds.has(customer.id)
  ).length;

  const allSelected =
    customers.length > 0 && selectedCount === customers.length;

  const someSelected =
    selectedCount > 0 && selectedCount < customers.length;

  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10 px-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(element) => {
                    if (element) {
                      element.indeterminate = someSelected;
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
                Customer
              </TableHead>

              <TableHead className="min-w-[160px]">
                Company
              </TableHead>

              <TableHead className="min-w-[220px]">
                Email
              </TableHead>

              <TableHead className="min-w-[140px]">
                Phone
              </TableHead>

              <TableHead className="min-w-[100px]">
                Status
              </TableHead>

              <TableHead className="min-w-[140px]">
                Last contact
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
              customers.map((customer) => {
                const isSelected = selectedIds.has(customer.id);

                return (
                  <TableRow
                    key={customer.id}
                    data-state={isSelected ? "selected" : undefined}
                    className={
                      isSelected
                        ? "bg-muted/50"
                        : undefined
                    }
                  >
                    <TableCell className="w-10 px-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() =>
                          onToggleCustomer(customer.id)
                        }
                        aria-label={`Select ${customer.name}`}
                        className="size-4 cursor-pointer accent-primary"
                      />
                    </TableCell>

                    <TableCell className="min-w-[180px]">
                      <div className="flex min-w-0 flex-col">
                        <Link
                          href={`/customers/${customer.id}`}
                          className="truncate font-medium text-foreground hover:underline"
                        >
                          {customer.name}
                        </Link>

                        <span className="truncate text-xs text-muted-foreground">
                          {customer.email}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="min-w-[160px] text-muted-foreground">
                      {customer.company}
                    </TableCell>

                    <TableCell className="min-w-[220px] text-muted-foreground">
                      {customer.email}
                    </TableCell>

                    <TableCell className="min-w-[140px] text-muted-foreground">
                      {customer.phone}
                    </TableCell>

                    <TableCell className="min-w-[100px]">
                      <StatusBadge status={customer.status} />
                    </TableCell>

                    <TableCell className="min-w-[140px] text-muted-foreground">
                      {formatDate(customer.lastContactDate)}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}