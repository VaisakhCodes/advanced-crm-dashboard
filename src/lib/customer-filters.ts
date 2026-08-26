import type { Customer, CustomerStatus } from "@/types/customer";

export type CustomerFilters = {
  search: string;
  statuses: CustomerStatus[];
  companies: string[];
  email: string;
  phone: string;
  lastContactFrom: string;
  lastContactTo: string;
};

export const defaultCustomerFilters: CustomerFilters = {
  search: "",
  statuses: [],
  companies: [],
  email: "",
  phone: "",
  lastContactFrom: "",
  lastContactTo: "",
};

export function filterCustomers(
  customers: Customer[],
  filters: CustomerFilters
): Customer[] {
  const query = filters.search.trim().toLowerCase();
  const emailQuery = filters.email.trim().toLowerCase();
  const phoneQuery = filters.phone.trim().toLowerCase();

  return customers.filter((customer) => {
    const matchesSearch =
      !query ||
      customer.name.toLowerCase().includes(query) ||
      customer.company.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.phone.toLowerCase().includes(query);

    const matchesStatus =
      filters.statuses.length === 0 ||
      filters.statuses.includes(customer.status);

    const matchesCompany =
      filters.companies.length === 0 ||
      filters.companies.includes(customer.company);

    const matchesEmail =
      !emailQuery ||
      customer.email.toLowerCase().includes(emailQuery);

    const matchesPhone =
      !phoneQuery ||
      customer.phone.toLowerCase().includes(phoneQuery);

    const matchesFrom =
      !filters.lastContactFrom ||
      customer.lastContactDate >= filters.lastContactFrom;

    const matchesTo =
      !filters.lastContactTo ||
      customer.lastContactDate <= filters.lastContactTo;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesCompany &&
      matchesEmail &&
      matchesPhone &&
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
    filters.statuses.length > 0 ||
    filters.companies.length > 0 ||
    filters.email.trim() !== "" ||
    filters.phone.trim() !== "" ||
    filters.lastContactFrom !== "" ||
    filters.lastContactTo !== ""
  );
}