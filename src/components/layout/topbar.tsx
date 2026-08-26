"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon, Notification03Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarNav } from "@/components/layout/sidebar-nav";

export function Topbar() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-background px-4">
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open navigation menu"
            />
          }
        >
          <HugeiconsIcon icon={Menu01Icon} className="size-4" />
        </SheetTrigger>
        <SheetContent side="left" className="w-64 bg-sidebar p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex h-14 items-center px-4">
            <span className="text-sm font-semibold text-sidebar-foreground">
              CRM Dashboard
            </span>
          </div>
          <div className="py-2">
            <SidebarNav onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="View notifications">
          <HugeiconsIcon icon={Notification03Icon} className="size-4" />
        </Button>
        <Avatar className="size-7">
          <AvatarFallback>VM</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
