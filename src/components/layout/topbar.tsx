"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Menu01Icon,
  Moon01Icon,
  Notification03Icon,
  Sun01Icon,
} from "@hugeicons/core-free-icons";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SidebarNav } from "@/components/layout/sidebar-nav";

export function Topbar() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { setTheme } = useTheme();

  function handleThemeToggle() {
    const isDark =
      document.documentElement.classList.contains("dark");

    setTheme(isDark ? "light" : "dark");
  }

  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-background px-4">
      <Sheet
        open={mobileNavOpen}
        onOpenChange={setMobileNavOpen}
      >
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
          <HugeiconsIcon
            icon={Menu01Icon}
            className="size-4"
          />
        </SheetTrigger>

        <SheetContent
          side="left"
          className="w-64 bg-sidebar p-0"
        >
          <SheetTitle className="sr-only">
            Navigation
          </SheetTitle>

          <div className="flex h-14 items-center px-4">
            <span className="text-sm font-semibold text-sidebar-foreground">
              CRM Dashboard
            </span>
          </div>

          <div className="py-2">
            <SidebarNav
              onNavigate={() =>
                setMobileNavOpen(false)
              }
            />
          </div>
        </SheetContent>
      </Sheet>

      <div className="ml-auto flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleThemeToggle}
          aria-label="Toggle dark and light mode"
          title="Toggle dark and light mode"
          className="relative"
        >
          <HugeiconsIcon
            icon={Moon01Icon}
            className="size-4 dark:hidden"
          />

          <HugeiconsIcon
            icon={Sun01Icon}
            className="hidden size-4 dark:block"
          />
        </Button>

        <Popover>
          <PopoverTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="View notifications"
                title="Notifications"
              />
            }
          >
            <HugeiconsIcon
              icon={Notification03Icon}
              className="size-4"
            />
          </PopoverTrigger>

          <PopoverContent
            align="end"
            className="w-80 p-0"
          >
            <div className="border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold">
                Notifications
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Recent activity from your CRM.
              </p>
            </div>

            <div className="flex min-h-32 items-center justify-center px-4 py-6 text-center">
              <div>
                <p className="text-sm font-medium">
                  No new notifications
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  You&apos;re all caught up.
                </p>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Avatar className="size-7">
          <AvatarImage
            src="/profile.jpg"
            alt="Profile"
            className="object-cover"
          />
        </Avatar>
      </div>
    </header>
  );
}