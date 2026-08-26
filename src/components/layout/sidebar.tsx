import { SidebarNav } from "@/components/layout/sidebar-nav";

export function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-56 md:flex-col md:border-r md:border-sidebar-border md:bg-sidebar">
      <div className="flex h-14 items-center px-4">
        <span className="text-sm font-semibold text-sidebar-foreground">
          CRM Dashboard
        </span>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        <SidebarNav />
      </div>
    </aside>
  );
}
