"use client";

import { useRouter } from "next/navigation";
import { CustomerForm } from "@/components/customers/customer-form";
import { useCreateCustomer } from "@/hooks/use-customers";
import type { CustomerFormValues } from "@/lib/customer-form-schema";

export function NewCustomerForm() {
  const router = useRouter();
  const createCustomer = useCreateCustomer();

  function handleSubmit(values: CustomerFormValues) {
    createCustomer.mutate(values, {
      onSuccess: (customer) => {
        router.push(`/customers/${customer.id}`);
      },
    });
  }

  return (
    <CustomerForm
      mode="create"
      onSubmit={handleSubmit}
      isSubmitting={createCustomer.isPending}
      submitError={
        createCustomer.isError ? "Could not create customer. Try again." : undefined
      }
      onCancel={() => router.push("/customers")}
    />
  );
}
