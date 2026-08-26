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

const COLUMN_COUNT = 6;

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
}

export function CustomerTable({
  customers,
  isLoading,
}: CustomerTableProps) {
  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
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
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.id}>
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}