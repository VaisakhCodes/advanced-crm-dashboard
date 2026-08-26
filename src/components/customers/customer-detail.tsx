"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomerForm } from "@/components/customers/customer-form";
import { DeleteCustomerDialog } from "@/components/customers/delete-customer-dialog";
import { formatDate } from "@/lib/format-date";
import {
  useCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
} from "@/hooks/use-customers";
import type { CustomerFormValues } from "@/lib/customer-form-schema";

interface CustomerDetailProps {
  id: string;
}

function DetailField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">
        {label}
      </span>

      <span className="text-sm text-foreground">
        {value || "—"}
      </span>
    </div>
  );
}

export function CustomerDetail({ id }: CustomerDetailProps) {
  const router = useRouter();

  const {
    data: customer,
    isLoading,
    isError,
    refetch,
  } = useCustomer(id);

  const updateCustomer = useUpdateCustomer();
  const deleteCustomer = useDeleteCustomer();

  const [isEditing, setIsEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-48" />

        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-10 w-full"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-md border border-border py-16 text-center">
        <p className="text-sm text-foreground">
          Something went wrong while loading this customer.
        </p>

        <div className="flex flex-wrap justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
          >
            Retry
          </Button>

          <Link
            href="/customers"
            className={cn(
              buttonVariants({
                variant: "ghost",
                size: "sm",
              })
            )}
          >
            Back to Customers
          </Link>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-md border border-border py-16 text-center">
        <p className="text-sm text-foreground">
          Customer not found.
        </p>

        <Link
          href="/customers"
          className={cn(
            buttonVariants({
              variant: "outline",
              size: "sm",
            })
          )}
        >
          Back to Customers
        </Link>
      </div>
    );
  }

  function handleUpdate(values: CustomerFormValues) {
    updateCustomer.mutate(
      {
        id,
        input: values,
      },
      {
        onSuccess: () => setIsEditing(false),
      }
    );
  }

  function handleDelete() {
    deleteCustomer.mutate(id, {
      onSuccess: () => router.push("/customers"),
    });
  }

  if (isEditing) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-semibold text-foreground">
          Edit {customer.name}
        </h1>

        <CustomerForm
          mode="edit"
          defaultValues={customer}
          onSubmit={handleUpdate}
          isSubmitting={updateCustomer.isPending}
          submitError={
            updateCustomer.isError
              ? "Could not save changes. Try again."
              : undefined
          }
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold text-foreground">
            {customer.name}
          </h1>

          <p className="truncate text-sm text-muted-foreground">
            {customer.company}
          </p>
        </div>

        <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:shrink-0">
          <Link
            href="/customers"
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "sm",
              })
            )}
          >
            Back to Customers
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteOpen(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-4 rounded-md border border-border p-4 sm:grid-cols-2 sm:p-5">
        <DetailField
          label="Email"
          value={customer.email}
        />

        <DetailField
          label="Phone"
          value={customer.phone}
        />

        <DetailField
          label="Company"
          value={customer.company}
        />

        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">
            Status
          </span>

          <Badge
            variant={
              customer.status === "active"
                ? "default"
                : "secondary"
            }
            className="w-fit capitalize"
          >
            {customer.status}
          </Badge>
        </div>

        <DetailField
          label="Last contact"
          value={formatDate(customer.lastContactDate)}
        />

        <div className="sm:col-span-2">
          <DetailField
            label="Notes"
            value={customer.notes}
          />
        </div>
      </div>

      <DeleteCustomerDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        customerName={customer.name}
        onConfirm={handleDelete}
        isDeleting={deleteCustomer.isPending}
      />
    </div>
  );
}