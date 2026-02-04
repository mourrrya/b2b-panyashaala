"use client";

import { useStore } from "@/lib/store";
import { useAuthStore } from "@/store/auth-store";
import { LogIn, LogOut, Menu, Package, ShoppingBag, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { BasketDrawer } from "./BasketDrawer";
import { MobileNav } from "./MobileNav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const NAV_LINKS = [
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/applications", label: "Applications" },
  { href: "/quality", label: "Quality" },
  { href: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [basketDrawerOpen, setBasketDrawerOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLDivElement>(null);
  const { basket, products, removeFromBasketOptimistic } = useStore();
  const { user, signOut, isLoading } = useAuthStore();

  const basketProducts = useMemo(
    () => products.filter((product) => basket.includes(product.id)),
    [products, basket],
  );

  const activeLink = navRef?.current?.querySelector(
    `a[href="${pathname}"]`,
  ) as HTMLAnchorElement;

  useEffect(() => {
    if (!navRef.current) return;

    if (activeLink) {
      const { offsetLeft, offsetWidth } = activeLink;
      setSliderStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [pathname]);

  return (
    <header className="bg-white/90 backdrop-blur border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <Link href="/" className="text-emerald-800 font-semibold text-xl">
          <Image
            src="/logo-text.svg"
            alt="Aukra Chem Essentials LLP"
            width={120}
            height={40}
            className="w-24 sm:w-28 md:w-36 h-auto"
          />
        </Link>
        <nav
          ref={navRef}
          aria-label="Main navigation"
          className="hidden lg:flex gap-4 lg:gap-6 text-sm font-medium text-slate-600 relative"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`pb-0.5 transition-colors relative z-10 ${
                pathname === link.href
                  ? "text-emerald-800"
                  : "hover:text-emerald-800"
              }`}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}

          {activeLink && (
            <div
              className="absolute bottom-0 h-0.5 bg-emerald-800 rounded-full transition-all duration-300 ease-out"
              style={{
                left: `${sliderStyle.left}px`,
                width: `${sliderStyle.width}px`,
              }}
              aria-hidden="true"
            />
          )}
        </nav>
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Login/Profile Button */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-linear-to-r from-emerald-100 to-teal-100 text-emerald-700 hover:from-emerald-200 hover:to-teal-200 transition-all duration-300 group focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                  title="Account menu"
                  aria-label="Account menu"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs sm:text-sm font-medium">
                    {user.fullName || user.companyName || "Account"}
                  </span>
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
          ) : (
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
          )}

          {/* Basket Drawer */}
          <Sheet open={basketDrawerOpen} onOpenChange={setBasketDrawerOpen}>
            <SheetTrigger asChild>
              <button
                className="relative cursor-pointer inline-flex items-center gap-1.5 sm:gap-2 text-emerald-800 hover:text-emerald-700 transition-colors group focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                title={`View enquiry basket with ${basket.length} items`}
                aria-label="Open enquiry basket drawer"
              >
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                {basket.length > 0 && (
                  <span
                    className="absolute -top-1.5 sm:-top-2 -right-1.5 sm:-right-2 bg-emerald-600 text-white text-[10px] sm:text-xs font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center animate-pulse"
                    aria-label={`${basket.length} items in enquiry basket`}
                  >
                    {basket.length}
                  </span>
                )}
                <span className="hidden sm:inline text-xs sm:text-sm font-medium">
                  Enquiry
                </span>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md p-0">
              <SheetHeader className="px-6 py-4 border-b border-slate-100">
                <SheetTitle className="text-lg font-semibold text-emerald-900">
                  Enquiry Basket ({basket.length})
                </SheetTitle>
              </SheetHeader>
              <BasketDrawer
                basketProducts={basketProducts}
                basketLength={basket.length}
                removeFromBasket={removeFromBasketOptimistic}
                setBasketDrawerOpen={setBasketDrawerOpen}
              />
            </SheetContent>
          </Sheet>

          {/* Mobile Sidebar Menu */}
          <MobileNav
            open={mobileMenuOpen}
            onOpenChange={setMobileMenuOpen}
            pathname={pathname}
            navLinks={[...NAV_LINKS]}
            user={user}
            isLoading={isLoading}
            onSignOut={async () => {
              await signOut();
              router.push("/");
            }}
            trigger={
              <button
                className="lg:hidden text-emerald-800 p-1 hover:bg-emerald-50 rounded-md transition-colors"
                aria-label="Toggle navigation menu"
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
