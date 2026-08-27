"use client";

import Link from "next/link";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Edit02Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";

import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { formatDate } from "@/lib/format-date";
import type { Customer } from "@/types/customer";

interface SortableCustomerRowProps {
  customer: Customer;
  isSelected: boolean;
  onToggleCustomer: (id: string) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export function SortableCustomerRow({
  customer,
  isSelected,
  onToggleCustomer,
  onEdit,
  onDelete,
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
      {/* Reorder */}
      <TableCell className="w-10 px-2">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="touch-none flex size-8 cursor-grab items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 active:cursor-grabbing"
          aria-label={`Reorder ${customer.name}`}
          title={`Drag to reorder ${customer.name}`}
        >
          <GripVertical
            className="size-4"
            aria-hidden="true"
          />
        </button>
      </TableCell>

      {/* Selection */}
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

      {/* Customer */}
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

      {/* Company */}
      <TableCell className="min-w-[160px] text-muted-foreground">
        {customer.company}
      </TableCell>

      {/* Email */}
      <TableCell className="min-w-[220px] text-muted-foreground">
        {customer.email}
      </TableCell>

      {/* Phone */}
      <TableCell className="min-w-[140px] text-muted-foreground">
        {customer.phone}
      </TableCell>

      {/* Status */}
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

      {/* Last contact */}
      <TableCell className="min-w-[140px] text-muted-foreground">
        {formatDate(customer.lastContactDate)}
      </TableCell>

      {/* Actions */}
      <TableCell className="w-[100px]">
        <div className="flex items-center justify-end gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label={`Edit ${customer.name}`}
            title="Edit customer"
            onClick={() => onEdit(customer)}
          >
            <HugeiconsIcon
              icon={Edit02Icon}
              className="size-4"
              aria-hidden="true"
            />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-destructive"
            aria-label={`Delete ${customer.name}`}
            title="Delete customer"
            onClick={() => onDelete(customer)}
          >
            <HugeiconsIcon
              icon={Delete02Icon}
              className="size-4"
              aria-hidden="true"
            />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}