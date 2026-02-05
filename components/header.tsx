"use client";

import { SITE_CONFIG, UI_LABELS } from "@/lib/constants";
import { useAuthLoading, useSignOut } from "@/store/authStore";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { BasketButton } from "./header/BasketButton";
import { LoginProfileButton } from "./header/LoginProfileButton";
import { MobileNav } from "./header/MobileNav";
import { NAV_LINKS, NavigationMenu } from "./header/NavigationMenu";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isLoading = useAuthLoading();
  const signOut = useSignOut();

  return (
    <header className="bg-white/90 backdrop-blur border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <Link href="/" className="text-emerald-800 font-semibold text-xl">
          <Image
            src={SITE_CONFIG.LOGO.TEXT}
            alt={SITE_CONFIG.NAME}
            width={120}
            height={40}
            className="w-24 sm:w-28 md:w-36 h-auto"
          />
        </Link>
        <NavigationMenu pathname={pathname} />

        <div className="flex items-center gap-4 sm:gap-6">
          {/* Basket Button */}
          <BasketButton />

          {/* Login/Profile Button */}
          <LoginProfileButton />

          {/* Mobile Sidebar Menu */}
          <MobileNav
            open={mobileMenuOpen}
            onOpenChange={setMobileMenuOpen}
            pathname={pathname}
            navLinks={[...NAV_LINKS]}
            isLoading={isLoading}
            onSignOut={async () => {
              await signOut();
              router.push("/");
            }}
            trigger={
              <button
                className="lg:hidden text-emerald-800 p-1 hover:bg-emerald-50 rounded-md transition-colors"
                aria-label={UI_LABELS.NAV.TOGGLE_MENU}
              >
                <Menu className="w-6 h-6 sm:w-7 sm:h-7" />
              </button>
            }
          />
        </div>
      </div>
    </header>
  );
}
