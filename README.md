# Advanced CRM Dashboard

A polished customer relationship management dashboard built with Next.js, React, TypeScript, Tailwind CSS, and reusable UI components. The project focuses on a professional customer-management workflow with client-side filtering, sorting, selection, CRUD interactions, CSV export, pagination, and drag-and-drop reordering.

## Overview

The dashboard provides a focused interface for managing customer records from a single workspace. Customer data is exposed through a service layer backed by a deterministic in-memory mock store, while TanStack Query handles asynchronous queries, mutations, caching, and query invalidation.

The implementation is intentionally structured so the presentation layer does not depend directly on the mock data source. The service module can therefore be replaced by a real API integration without requiring the customer UI to be rewritten.

## Features

### Customer management

- View a paginated customer list.
- Open an individual customer from the customer name.
- Create new customer records.
- Edit existing customer records.
- Delete individual customers with confirmation.
- Display customer name, email, company, phone, status, and last-contact date.
- Manage customer status as `active` or `inactive`.

### Search, filtering, and sorting

- Search customer records from the main toolbar.
- Filter by status.
- Filter by company.
- Filter by partial email address.
- Filter by partial phone number.
- Filter by last-contact date range.
- Apply predefined filter templates:
  - Active
  - Recent
  - Inactive
- Save reusable filter combinations.
- Reapply saved filters.
- Delete saved filters.
- Reorder saved filters with drag-and-drop.
- Clear active filters.
- Reset pagination and selection when filtering changes.
- Sort supported customer fields from the table headers.

### Bulk operations

- Select individual customers.
- Select or deselect all customers on the current page.
- View the current selection count.
- Set selected customers to Active.
- Set selected customers to Inactive.
- Delete multiple selected customers with confirmation.
- Clear the current selection.

### Table interactions

- Drag customers to reorder the list.
- Use a dedicated drag handle rather than making the entire row draggable.
- Keep the table layout stable during drag interactions by rendering the dragged item through a drag overlay.
- Edit and delete actions are available directly from the Actions column.
- Loading skeletons are displayed while customer data is loading.
- Empty and filtered-empty states are handled explicitly.

### Export

- Export the currently filtered customer collection as CSV.

### Application UI

- Responsive dashboard shell with sidebar navigation.
- Customer-focused workspace with a clean table-based interface.
- Light/dark theme toggle.
- Notification popover.
- Profile avatar in the application header.
- Responsive mobile navigation using a sheet.
- Accessible labels and focus states for interactive controls.
- Filter drawer with dedicated close and action controls.

## Technology Stack

| Technology | Purpose |
| --- | --- |
| Next.js 16 | React framework and application structure |
| React 19 | UI rendering |
| TypeScript | Static typing |
| Tailwind CSS 4 | Utility-first styling |
| shadcn/ui | UI component foundation and component conventions |
| Base UI | Primitive interactive UI components |
| TanStack Query | Server-state/query and mutation management |
| React Hook Form | Form state management |
| Zod | Schema validation |
| dnd-kit | Customer and saved-filter drag-and-drop interactions |
| Hugeicons | Application icons |
| Lucide React | Table and interaction icons |
| class-variance-authority | Component variants |
| clsx / tailwind-merge | Conditional and merged class handling |

The exact dependency versions are defined in `package.json`.

## Architecture

The project separates UI components, application hooks, data access, domain types, and utility logic.

### Data flow

```text
UI components
    ↓
Customer hooks
    ↓
Customer service
    ↓
In-memory mock store
```

TanStack Query sits between the UI and service layer. Customer queries use stable query keys, while successful mutations invalidate the relevant list/detail queries so the interface stays synchronized with the service state.

### Service layer

`src/lib/customer-service.ts` contains the customer data operations:

- `getCustomers`
- `getCustomerById`
- `createCustomer`
- `updateCustomer`
- `deleteCustomer`

The current implementation uses an in-memory store seeded from deterministic customer data and simulates asynchronous latency. It is a mock data layer rather than a network API.

Bulk status updates and bulk deletes coordinate the existing single-customer service operations in the customer hooks.

### Filtering and presentation

Filtering and sorting logic is kept outside the table presentation component. `CustomerList` coordinates:

- query state
- filter state
- sorting state
- pagination
- selection
- mutations
- CSV export

`CustomerTable` is responsible for presenting the resulting page of customers and coordinating table-level interactions.

### Drag-and-drop

dnd-kit is used for customer reordering and saved-filter reordering.

Customer dragging uses a dedicated drag handle and a drag overlay. This keeps the table rows visually stable while an item is being dragged and avoids layout movement caused by applying transforms directly to the table row.

## Project Structure

```text
advanced-crm-dashboard/
├── public/
├── src/
│   ├── app/
│   │   ├── customers/
│   │   ├── deals/
│   │   ├── settings/
│   │   ├── tasks/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── providers.tsx
│   │
│   ├── components/
│   │   ├── customers/
│   │   │   ├── advanced-customer-filters.tsx
│   │   │   ├── customer-detail.tsx
│   │   │   ├── customer-form.tsx
│   │   │   ├── customer-list.tsx
│   │   │   ├── customer-pagination.tsx
│   │   │   ├── customer-table.tsx
│   │   │   ├── customer-toolbar.tsx
│   │   │   ├── delete-customer-dialog.tsx
│   │   │   ├── new-customer-form.tsx
│   │   │   └── sortable-customer-row.tsx
│   │   ├── dashboard/
│   │   ├── layout/
│   │   └── ui/
│   │
│   ├── data/
│   │   └── customers.ts
│   │
│   ├── hooks/
│   │   └── use-customers.ts
│   │
│   ├── lib/
│   │   ├── customer-filters.ts
│   │   ├── customer-service.ts
│   │   ├── export-customers.ts
│   │   ├── format-date.ts
│   │   ├── query-client.ts
│   │   └── utils.ts
│   │
│   └── types/
│       └── customer.ts
│
├── components.json
├── package.json
├── package-lock.json
└── tsconfig.json
```

The structure above describes the application's feature and infrastructure boundaries; generated directories such as `.next` and `node_modules` are intentionally excluded.

## Customer Data Model

Customer records use the following TypeScript model:

```ts
type CustomerStatus = "active" | "inactive";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: CustomerStatus;
  lastContactDate: string;
  notes: string;
}
```

Create and update operations derive their input types from the `Customer` model so the data contract remains centralized.

## Local Setup

### Prerequisites

- Node.js with npm available.
- A local clone of this repository.

### Installation

Install the project dependencies:

```bash
npm install
```

### Development

Start the Next.js development server:

```bash
npm run dev
```

Then open the local URL shown by Next.js, normally:

```text
http://localhost:3000
```

### Production build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Environment Variables

The current application does not require environment variables for its mock-data implementation.

No API keys, database credentials, or other secrets are required to run the current version locally.

If a real backend is introduced later, its configuration should be added through environment variables rather than committed credentials.

## Validation

The repository defines the following validation-related npm scripts:

```bash
npm run lint
npm run build
```

For an explicit TypeScript-only check, the project can also be checked with:

```bash
npx tsc --noEmit
```

There is no dedicated automated test suite configured in the current `package.json`.

## Mock Data and Persistence

The initial customer dataset is deterministic and contains 50 customer records.

The current customer service uses an in-memory store. Customer mutations therefore update the running application state but are not backed by a persistent database.

Saved customer filters are stored in browser `localStorage`, allowing saved filter configurations and their ordering to survive page reloads in the same browser.

This distinction is intentional: the project demonstrates the application architecture and complete customer-management workflow without claiming to have a production backend or database.

## UI and UX Decisions

Several implementation decisions were made specifically to keep the interface stable and usable:

- Primary customer actions remain visually distinct from secondary controls.
- Destructive operations use confirmation dialogs.
- Bulk actions appear only when customers are selected.
- Filter changes reset pagination and clear the current selection to prevent stale selections.
- Loading, empty, filtered-empty, and error states are handled explicitly.
- Customer and saved-filter drag interactions use dedicated handles.
- The customer drag overlay prevents the underlying table from visually shifting while dragging.
- The filter experience uses a right-side sheet rather than permanently occupying table space.
- The filter sheet provides a close control and fixed action area so the filtering workflow remains usable while scrolling.
- Interactive controls include accessible labels, titles, and keyboard-focus states where appropriate.

## Current Data/API Boundary

There is no external REST or GraphQL backend in the current implementation.

The application currently follows this boundary:

```text
Components
    ↓
React Query hooks
    ↓
Customer service module
    ↓
Deterministic in-memory data
```

The service function signatures provide a clear replacement point for a future HTTP/API implementation.

## Future Improvements

The current implementation is complete for its mock-data scope. Meaningful next steps for a production system would be:

- Replace the in-memory service with a persistent backend.
- Add authentication and authorization.
- Add automated unit and end-to-end tests.
- Persist customer ordering outside the browser process.
- Add server-side filtering, sorting, pagination, and CSV generation when dataset size requires it.
- Add durable database-backed saved filters for multi-user workflows.

These are future production enhancements, not features claimed by the current implementation.

## Development Notes

The project uses a centralized `Providers` component to create and provide the TanStack Query client. Query defaults include a one-minute stale time, five-minute garbage-collection time, one retry, and disabled automatic refetching on window focus.

The UI uses shared primitives and utility functions rather than implementing every interactive control independently. Component aliases and the Hugeicons icon library are configured through `components.json`.

---

## License

This repository does not currently define a license in the project configuration.
