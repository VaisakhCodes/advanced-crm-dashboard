import type { Customer, CustomerStatus } from "@/types/customer";

export type CustomerFilters = {
  search: string;
  status: CustomerStatus | "all";
  lastContactFrom: string;
  lastContactTo: string;
};

export const defaultCustomerFilters: CustomerFilters = {
  search: "",
  status: "all",
  lastContactFrom: "",
  lastContactTo: "",
};

export function filterCustomers(
  customers: Customer[],
  filters: CustomerFilters
): Customer[] {
  const query = filters.search.trim().toLowerCase();

  return customers.filter((customer) => {
    const matchesSearch =
      !query ||
      customer.name.toLowerCase().includes(query) ||
      customer.company.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.phone.toLowerCase().includes(query);

    const matchesStatus =
      filters.status === "all" || customer.status === filters.status;

    const matchesFrom =
      !filters.lastContactFrom ||
      customer.lastContactDate >= filters.lastContactFrom;

    const matchesTo =
      !filters.lastContactTo ||
      customer.lastContactDate <= filters.lastContactTo;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesFrom &&
      matchesTo
    );
  });
}

export function hasActiveCustomerFilters(
  filters: CustomerFilters
): boolean {
  return (
    filters.search.trim() !== "" ||
    filters.status !== "all" ||
    filters.lastContactFrom !== "" ||
    filters.lastContactTo !== ""
  );
}