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
              <Skeleton className="h-4 w-full max-w-32" />
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

export function CustomerTable({ customers, isLoading }: CustomerTableProps) {
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last contact</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <CustomerTableSkeleton />
          ) : (
            customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <Link
                      href={`/customers/${customer.id}`}
                      className="font-medium text-foreground hover:underline"
                    >
                      {customer.name}
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      {customer.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {customer.company}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {customer.email}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {customer.phone}
                </TableCell>
                <TableCell>
                  <StatusBadge status={customer.status} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(customer.lastContactDate)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
