import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "@/lib/customer-service";
import type {
  CreateCustomerInput,
  CustomerStatus,
  UpdateCustomerInput,
} from "@/types/customer";

export const customerKeys = {
  all: ["customers"] as const,
  detail: (id: string) => ["customers", id] as const,
};

export function useCustomers() {
  return useQuery({
    queryKey: customerKeys.all,
    queryFn: getCustomers,
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => getCustomerById(id),
    enabled: Boolean(id),
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCustomerInput) => createCustomer(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: customerKeys.all,
      });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: UpdateCustomerInput;
    }) => updateCustomer(id, input),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: customerKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: customerKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCustomer(id),

    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({
        queryKey: customerKeys.all,
      });

      queryClient.removeQueries({
        queryKey: customerKeys.detail(id),
      });
    },
  });
}

/**
 * Updates the status of multiple customers.
 *
 * The underlying service currently exposes one-customer update
 * operations, so the hook coordinates those operations in parallel.
 */
export function useBulkUpdateCustomers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ids,
      status,
    }: {
      ids: string[];
      status: CustomerStatus;
    }) => {
      await Promise.all(
        ids.map((id) =>
          updateCustomer(id, {
            status,
          })
        )
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: customerKeys.all,
      });
    },
  });
}

/**
 * Deletes multiple customers in parallel.
 */
export function useBulkDeleteCustomers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(
        ids.map((id) => deleteCustomer(id))
      );

      return ids;
    },

    onSuccess: (ids) => {
      queryClient.invalidateQueries({
        queryKey: customerKeys.all,
      });

      ids.forEach((id) => {
        queryClient.removeQueries({
          queryKey: customerKeys.detail(id),
        });
      });
    },
  });
}
