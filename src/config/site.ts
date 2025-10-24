import type { NavigationItem, Role } from "@/types";
import { LayoutDashboard, Stethoscope, BedDouble, Pill, UserCog, Building, ShieldCheck } from "lucide-react";

export const siteConfig = {
  name: "AI MeDciAssist",
  description: "Your intelligent partner for medical assistance.",
};

export const navItems: NavigationItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["patient", "admin", "pharmacy"] },
  { href: "/bed-availability", label: "Bed Availability", icon: BedDouble, roles: ["patient", "admin"] },
  { href: "/medicine-checker", label: "Medicine Checker", icon: Pill, roles: ["patient", "pharmacy"] },
  { 
    href: "/admin/dashboard", 
    label: "Admin Dashboard", 
    icon: UserCog,
    roles: ["admin"] 
  },
  { 
    href: "/pharmacy/dashboard", 
    label: "Pharmacy Dashboard", 
    icon: Building, 
    roles: ["pharmacy"] 
  },
];

export const publicNavItems: NavigationItem[] = [
    { href: "/", label: "Home", public: true },
    { href: "/login", label: "Login", public: true },
];

export function getNavItemsForRole(role: Role): NavigationItem[] {
  if (!role) {
    return publicNavItems.filter(item => item.href !== '/login'); // Don't show login if not logged in and already on /
  }
  return navItems.filter(item => item.roles?.includes(role));
}

export function getRoleBasedDashboardPath(role: Role): string {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'pharmacy') return '/pharmacy/dashboard';
    if (role === 'patient') return '/dashboard';
    return '/login';
}

export const ROLES: { value: Exclude<Role, null>; label: string; icon: React.ElementType }[] = [
  { value: 'patient', label: 'Patient', icon: Stethoscope },
  { value: 'admin', label: 'Hospital Admin', icon: UserCog },
  { value: 'pharmacy', label: 'Pharmacy Staff', icon: ShieldCheck },
];
