"use client";

import Link from "next/link";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format-date";
import type { Customer } from "@/types/customer";

interface SortableCustomerRowProps {
  customer: Customer;
  isSelected: boolean;
  onToggleCustomer: (id: string) => void;
}

export function SortableCustomerRow({
  customer,
  isSelected,
  onToggleCustomer,
}: SortableCustomerRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: customer.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      data-state={isSelected ? "selected" : undefined}
      className={
        isDragging
          ? "relative z-10 bg-muted shadow-sm"
          : isSelected
            ? "bg-muted/50"
            : undefined
      }
    >
      <TableCell className="w-10 px-2">
        <button
          type="button"
          className="flex size-8 cursor-grab items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground active:cursor-grabbing"
          {...attributes}
          {...listeners}
          aria-label={`Reorder ${customer.name}`}
        >
          <GripVertical className="size-4" />
        </button>
      </TableCell>

      <TableCell className="w-10 px-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleCustomer(customer.id)}
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
        <Badge
          variant={
            customer.status === "active"
              ? "default"
              : "secondary"
          }
          className="capitalize"
        >
          {customer.status}
        </Badge>
      </TableCell>

      <TableCell className="min-w-[140px] text-muted-foreground">
        {formatDate(customer.lastContactDate)}
      </TableCell>
    </TableRow>
  );
}