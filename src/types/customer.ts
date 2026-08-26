export type CustomerStatus = "active" | "inactive";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: CustomerStatus;
  lastContactDate: string;
  notes: string;
}

export type CreateCustomerInput = Omit<Customer, "id">;

export type UpdateCustomerInput = Partial<Omit<Customer, "id">>;
