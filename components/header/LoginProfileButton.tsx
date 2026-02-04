"use client";

import { useAuthStore } from "@/store/auth-store";
import { ChevronDown, LogIn, LogOut, Package, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function LoginProfileButton() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, isLoading } = useAuthStore();

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="inline-flex items-center gap-1.5 sm:gap-2 pr-3 rounded-full bg-linear-to-r from-emerald-100 to-teal-100 text-emerald-700 hover:from-emerald-200 hover:to-teal-200 transition-all duration-300 group focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            title="Account menu"
            aria-label="Account menu"
          >
            {user ? (
              <Image
                src={user?.avatarUrl || ""}
                alt={user.fullName || user.companyName || "User avatar"}
                width={16}
                height={16}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-emerald-200 text-emerald-600 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
            )}
            <span className="hidden sm:inline text-xs sm:text-sm font-medium">
              {user.fullName || user.companyName || "Account"}
            </span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            <User className="w-4 h-4 mr-2" />
            My Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/order")}>
            <Package className="w-4 h-4 mr-2" />
            My Orders
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
            disabled={isLoading}
            onClick={async () => {
              await signOut();
              router.push("/");
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Link
      href={`/login?redirect=${pathname !== "/login" ? encodeURIComponent(pathname) : "/"}`}
      className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-linear-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 group focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
      title="Login to your account"
      aria-label="Login"
    >
      <LogIn className="w-4 h-4" />
      <span className="hidden sm:inline text-xs sm:text-sm font-medium">
        Login
      </span>
    </Link>
  );
}
