"use client";

import { PRIVATE_NAV, UI_LABELS } from "@/lib/constants";
import { useAuthLoading, useSignOut } from "@/store/authStore";
import { ChevronDown, LogIn, LogOut, Package, User } from "lucide-react";
import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();
  const isLoading = useAuthLoading();
  const signOut = useSignOut();

  if (session?.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="inline-flex items-center gap-1.5 sm:gap-2 pr-3 rounded-full bg-linear-to-r from-emerald-100 to-teal-100 text-emerald-700 hover:from-emerald-200 hover:to-teal-200 transition-all duration-300 group focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            title={UI_LABELS.NAV.ACCOUNT_MENU}
            aria-label={UI_LABELS.NAV.ACCOUNT_MENU}
          >
            {session?.user ? (
              <Image
                src={session.user.image || ""}
                alt={session.user.name || UI_LABELS.NAV.USER_AVATAR_ALT}
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
              {session.user.name || UI_LABELS.NAV.ACCOUNT}
            </span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => router.push(PRIVATE_NAV.PROFILE)}>
            <Link href={PRIVATE_NAV.PROFILE} className="flex items-center gap-4">
              <User className="w-4 h-4" />
              {UI_LABELS.NAV.MY_PROFILE}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(PRIVATE_NAV.ORDERS)}>
            <Link href={PRIVATE_NAV.ORDERS} className="flex items-center gap-4">
              <Package className="w-4 h-4" />
              {UI_LABELS.NAV.MY_ORDERS}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
            disabled={isLoading}
          >
            <Link
              href="#"
              onClick={async (e) => {
                e.preventDefault();
                await signOut();
                // TODO: if user on public page do not redirect otherwise redirect to home page after sign out
                router.push("/");
              }}
              className="flex items-center gap-4 text-red-600"
            >
              <LogOut className="w-4 h-4" />
              {UI_LABELS.NAV.SIGN_OUT}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Link
      href={`/login?redirect=${pathname !== "/login" ? encodeURIComponent(pathname) : "/"}`}
      className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-linear-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 group focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
      title={UI_LABELS.NAV.LOGIN_TITLE}
      aria-label={UI_LABELS.NAV.LOGIN_BUTTON}
    >
      <LogIn className="w-4 h-4" />
      <span className="hidden sm:inline text-xs sm:text-sm font-medium">
        {UI_LABELS.NAV.LOGIN_BUTTON}
      </span>
    </Link>
  );
}
