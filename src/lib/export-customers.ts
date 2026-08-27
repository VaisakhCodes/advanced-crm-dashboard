import type { Customer } from "@/types/customer";

const CSV_HEADERS = [
  "Name",
  "Company",
  "Email",
  "Phone",
  "Status",
  "Last Contact",
] as const;

function escapeCsvValue(value: string): string {
  const escaped = value.replace(/"/g, '""');

  return `"${escaped}"`;
}

export function customersToCsv(
  customers: Customer[]
): string {
  const rows = customers.map((customer) =>
    [
      customer.name,
      customer.company,
      customer.email,
      customer.phone,
      customer.status,
      customer.lastContactDate,
    ]
      .map((value) =>
        escapeCsvValue(String(value ?? ""))
      )
      .join(",")
  );

  return [
    CSV_HEADERS.join(","),
    ...rows,
  ].join("\r\n");
}

export function downloadCustomersCsv(
  customers: Customer[]
): void {
  const csv = customersToCsv(customers);

  const blob = new Blob(
    [csv],
    { type: "text/csv;charset=utf-8;" }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `customers-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}