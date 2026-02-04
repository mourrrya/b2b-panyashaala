"use client";

import { LogIn, LogOut, Package, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "../ui/sheet";

interface NavLink {
  href: string;
  label: string;
}

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pathname: string;
  navLinks: NavLink[];
  user: { fullName?: string | null; companyName?: string | null } | null;
  isLoading: boolean;
  onSignOut: () => Promise<void>;
  trigger: React.ReactNode;
}

export function MobileNav({
  open,
  onOpenChange,
  pathname,
  navLinks,
  user,
  isLoading,
  onSignOut,
  trigger,
}: MobileNavProps) {
  const closeMenu = () => onOpenChange(false);

  const handleSignOut = async () => {
    await onSignOut();
    closeMenu();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side="right"
        className="max-w-85 w-[calc(100%-80px)] min-w-50 p-0 bg-linear-to-b from-emerald-50 via-white to-teal-50 "
      >
        <SheetHeader className="px-4 sm:px-6 py-3 sm:py-4 border-b border-emerald-100/50 ">
          <Image
            src="/logo-text.svg"
            alt="Aukra Chem Essentials LLP"
            width={100}
            height={33}
            className="w-24 sm:w-28 md:w-36 h-auto"
          />
        </SheetHeader>

        <nav className="flex flex-col py-4" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-6 py-3 text-sm font-medium transition-all duration-200 ${
                pathname === link.href
                  ? "text-emerald-800 bg-linear-to-r from-emerald-100/80 to-teal-100/60 border-r-4 border-emerald-600"
                  : "text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/50 hover:pl-8"
              }`}
              onClick={closeMenu}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}

          {/* User Actions */}
          <div className="mt-4 px-6 pt-4 border-t border-emerald-100/50">
            {user ? (
              <div className="space-y-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/50 transition-colors"
                  onClick={closeMenu}
                >
                  <User className="w-4 h-4" />
                  My Profile
                </Link>
                <Link
                  href="/order"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/50 transition-colors"
                  onClick={closeMenu}
                >
                  <Package className="w-4 h-4" />
                  My Orders
                </Link>
                <button
                  className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  disabled={isLoading}
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href={`/login?redirect=${pathname !== "/login" ? encodeURIComponent(pathname) : "/"}`}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-linear-to-r from-emerald-600 to-teal-600 text-white text-sm font-medium hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all duration-300"
                onClick={closeMenu}
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
