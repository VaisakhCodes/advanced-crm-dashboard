import type {
  Customer,
  CreateCustomerInput,
  UpdateCustomerInput,
} from "@/types/customer";
import { getMockCustomers } from "@/data/customers";

// In-memory store seeded from the deterministic mock dataset.
// Replace this module's internals with real API calls later —
// the exported function signatures should not need to change.
let store: Customer[] = getMockCustomers();

const SIMULATED_DELAY_MS = 400;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), SIMULATED_DELAY_MS);
  });
}

function generateId(): string {
  return `cust-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export async function getCustomers(): Promise<Customer[]> {
  return delay([...store]);
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  const found = store.find((customer) => customer.id === id);
  return delay(found ? { ...found } : null);
}

export async function createCustomer(
  input: CreateCustomerInput
): Promise<Customer> {
  const newCustomer: Customer = { ...input, id: generateId() };
  store = [...store, newCustomer];
  return delay(newCustomer);
}

export async function updateCustomer(
  id: string,
  input: UpdateCustomerInput
): Promise<Customer> {
  const index = store.findIndex((customer) => customer.id === id);
  if (index === -1) {
    throw new Error(`Customer with id "${id}" was not found.`);
  }
  const updated: Customer = { ...store[index], ...input, id };
  store = [...store.slice(0, index), updated, ...store.slice(index + 1)];
  return delay(updated);
}

export async function deleteCustomer(id: string): Promise<{ id: string }> {
  const exists = store.some((customer) => customer.id === id);
  if (!exists) {
    throw new Error(`Customer with id "${id}" was not found.`);
  }
  store = store.filter((customer) => customer.id !== id);
  return delay({ id });
}
