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
import type { CreateCustomerInput, UpdateCustomerInput } from "@/types/customer";

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
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCustomerInput }) =>
      updateCustomer(id, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
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
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
      queryClient.removeQueries({ queryKey: customerKeys.detail(id) });
    },
  });
}
