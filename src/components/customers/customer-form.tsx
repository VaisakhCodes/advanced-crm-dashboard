"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  customerFormSchema,
  type CustomerFormValues,
} from "@/lib/customer-form-schema";
import type { Customer } from "@/types/customer";

interface CustomerFormProps {
  mode: "create" | "edit";
  defaultValues?: Customer;
  onSubmit: (values: CustomerFormValues) => void;
  isSubmitting: boolean;
  submitError?: string;
  onCancel: () => void;
}

const emptyDefaults: CustomerFormValues = {
  name: "",
  email: "",
  phone: "",
  company: "",
  status: "active",
  lastContactDate: new Date().toISOString().slice(0, 10),
  notes: "",
};

export function CustomerForm({
  mode,
  defaultValues,
  onSubmit,
  isSubmitting,
  submitError,
  onCancel,
}: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: defaultValues
      ? {
          name: defaultValues.name,
          email: defaultValues.email,
          phone: defaultValues.phone,
          company: defaultValues.company,
          status: defaultValues.status,
          lastContactDate: defaultValues.lastContactDate,
          notes: defaultValues.notes,
        }
      : emptyDefaults,
  });

  const status = watch("status");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} aria-invalid={Boolean(errors.name)} />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            {...register("company")}
            aria-invalid={Boolean(errors.company)}
          />
          {errors.company && (
            <p className="text-xs text-destructive">{errors.company.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...register("phone")} aria-invalid={Boolean(errors.phone)} />
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="status">Status</Label>
          <Select
            value={status}
            onValueChange={(value) =>
              setValue("status", value as CustomerFormValues["status"], {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger id="status" aria-label="Status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lastContactDate">Last contact date</Label>
          <Input
            id="lastContactDate"
            type="date"
            {...register("lastContactDate")}
            aria-invalid={Boolean(errors.lastContactDate)}
          />
          {errors.lastContactDate && (
            <p className="text-xs text-destructive">
              {errors.lastContactDate.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" rows={4} {...register("notes")} />
      </div>

      {submitError && (
        <p role="alert" className="text-sm text-destructive">
          {submitError}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : mode === "create"
              ? "Add customer"
              : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
