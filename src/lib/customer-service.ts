import type {
  Customer,
  CreateCustomerInput,
  UpdateCustomerInput,
} from "@/types/customer";
import { getMockCustomers } from "@/data/customers";

const STORAGE_KEY = "crm-customers";
const SIMULATED_DELAY_MS = 400;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), SIMULATED_DELAY_MS);
  });
}

function getInitialCustomers(): Customer[] {
  return getMockCustomers();
}

function readStore(): Customer[] {
  if (typeof window === "undefined") {
    return getInitialCustomers();
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    const initialCustomers = getInitialCustomers();

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(initialCustomers)
    );

    return initialCustomers;
  }

  try {
    return JSON.parse(stored) as Customer[];
  } catch {
    const initialCustomers = getInitialCustomers();

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(initialCustomers)
    );

    return initialCustomers;
  }
}

function writeStore(customers: Customer[]): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(customers)
    );
  }
}

function generateId(): string {
  return `cust-${Date.now()}-${Math.floor(
    Math.random() * 10000
  )}`;
}

export async function getCustomers(): Promise<Customer[]> {
  const store = readStore();

  return delay([...store]);
}

export async function getCustomerById(
  id: string
): Promise<Customer | null> {
  const store = readStore();

  const found = store.find(
    (customer) => customer.id === id
  );

  return delay(
    found ? { ...found } : null
  );
}

export async function createCustomer(
  input: CreateCustomerInput
): Promise<Customer> {
  const store = readStore();

  const newCustomer: Customer = {
    ...input,
    id: generateId(),
  };

  const nextStore = [
    ...store,
    newCustomer,
  ];

  writeStore(nextStore);

  return delay(newCustomer);
}

export async function updateCustomer(
  id: string,
  input: UpdateCustomerInput
): Promise<Customer> {
  const store = readStore();

  const index = store.findIndex(
    (customer) => customer.id === id
  );

  if (index === -1) {
    throw new Error(
      `Customer with id "${id}" was not found.`
    );
  }

  const updated: Customer = {
    ...store[index],
    ...input,
    id,
  };

  const nextStore = [
    ...store.slice(0, index),
    updated,
    ...store.slice(index + 1),
  ];

  writeStore(nextStore);

  return delay(updated);
}

export async function deleteCustomer(
  id: string
): Promise<{ id: string }> {
  const store = readStore();

  const exists = store.some(
    (customer) => customer.id === id
  );

  if (!exists) {
    throw new Error(
      `Customer with id "${id}" was not found.`
    );
  }

  const nextStore = store.filter(
    (customer) => customer.id !== id
  );

  writeStore(nextStore);

  return delay({ id });
}

export async function reorderCustomers(
  activeId: string,
  overId: string
): Promise<Customer[]> {
  const store = readStore();

  const activeIndex = store.findIndex(
    (customer) => customer.id === activeId
  );

  const overIndex = store.findIndex(
    (customer) => customer.id === overId
  );

  if (activeIndex === -1) {
    throw new Error(
      `Customer with id "${activeId}" was not found.`
    );
  }

  if (overIndex === -1) {
    throw new Error(
      `Customer with id "${overId}" was not found.`
    );
  }

  if (activeIndex === overIndex) {
    return delay([...store]);
  }

  const nextStore = [...store];

  const [movedCustomer] = nextStore.splice(
    activeIndex,
    1
  );

  nextStore.splice(
    overIndex,
    0,
    movedCustomer
  );

  writeStore(nextStore);

  return delay([...nextStore]);
}