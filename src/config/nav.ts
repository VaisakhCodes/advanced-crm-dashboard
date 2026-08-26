import type { IconSvgElement } from "@hugeicons/react";
import {
  Home01Icon,
  UserGroupIcon,
  Money03Icon,
  Task01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";

export interface NavItem {
  label: string;
  href: string;
  icon: IconSvgElement;
}

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: Home01Icon },
  { label: "Customers", href: "/customers", icon: UserGroupIcon },
  { label: "Deals", href: "/deals", icon: Money03Icon },
  { label: "Tasks", href: "/tasks", icon: Task01Icon },
  { label: "Settings", href: "/settings", icon: Settings01Icon },
];
