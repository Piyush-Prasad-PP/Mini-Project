"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AppLogo } from "@/components/icons/AppLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut, UserCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { siteConfig, getNavItemsForRole } from "@/config/site";
import type { NavigationItem } from "@/types";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const navItemsToDisplay = user ? getNavItemsForRole(user.role) : getNavItemsForRole(null).filter(item => item.href !== '/login');

  const UserAvatar = () => {
    if (loading) return <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />;
    if (!user) {
      return (
        <Button onClick={() => router.push('/login')} variant="outline">
          Login
        </Button>
      );
    }
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://placehold.co/40x40.png?text=${user.name.charAt(0)}`} alt={user.name} data-ai-hint="avatar person" />
              <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email} ({user.role})
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href={user ? getNavItemsForRole(user.role)[0]?.href || "/" : "/"} className="mr-6 flex items-center space-x-2">
            <AppLogo className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">
              {siteConfig.name}
            </span>
          </Link>
          <nav className="flex items-center gap-4 text-sm lg:gap-6">
            {navItemsToDisplay.map((item: NavigationItem) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === item.href ? "text-foreground" : "text-foreground/60"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <Link href="/" className="flex items-center space-x-2 mb-6">
                  <AppLogo className="h-6 w-6 text-primary" />
                  <span className="font-bold font-headline">{siteConfig.name}</span>
                </Link>
                <div className="flex flex-col space-y-3">
                  {navItemsToDisplay.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "transition-colors hover:text-foreground/80 p-2 rounded-md",
                        pathname === item.href ? "text-foreground bg-accent/20" : "text-foreground/60"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex items-center gap-2">
             <UserAvatar />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
