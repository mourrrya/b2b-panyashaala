"use client";

import { useStore } from "@/lib/store";
import { useAuthStore } from "@/store/auth-store";
import type { MenuProps } from "antd";
import { Drawer, Dropdown } from "antd";
import { LogIn, LogOut, ShoppingBag, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { BasketDrawer } from "./BasketDrawer";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [basketDrawerOpen, setBasketDrawerOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLDivElement>(null);
  const { basket, products, removeFromBasketOptimistic } = useStore();
  const { user, signOut, isLoading } = useAuthStore();

  // Memoize basketProducts to avoid infinite loops
  const basketProducts = useMemo(
    () => products.filter((product) => basket.includes(product.id)),
    [products, basket],
  );

  const navLinks = [
    { href: "/products", label: "Products" },
    { href: "/about", label: "About" },
    { href: "/applications", label: "Applications" },
    { href: "/quality", label: "Quality" },
    { href: "/contact", label: "Contact" },
  ];

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
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-emerald-800 font-semibold text-xl">
          <Image
            src="/logo-text.svg"
            alt="Aukra Chem Essentials LLP"
            width={150}
            height={50}
          />
        </Link>
        <nav
          ref={navRef}
          aria-label="Main navigation"
          className="hidden md:flex gap-6 text-sm font-medium text-slate-600 relative"
        >
          {navLinks.map((link) => (
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
        <div className="flex items-center gap-4">
          {/* Login/Profile Button */}
          {user ? (
            <Dropdown
              menu={{
                items: [
                  {
                    key: "profile",
                    label: "My Profile",
                    icon: <User className="w-4 h-4" />,
                    onClick: () => router.push("/profile"),
                  },
                  { type: "divider" },
                  {
                    key: "logout",
                    label: "Sign Out",
                    icon: <LogOut className="w-4 h-4" />,
                    danger: true,
                    disabled: isLoading,
                    onClick: async () => {
                      await signOut();
                      router.push("/");
                    },
                  },
                ] as MenuProps["items"],
              }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <button
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-emerald-100 to-teal-100 text-emerald-700 hover:from-emerald-200 hover:to-teal-200 transition-all duration-300 group focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                title="Account menu"
                aria-label="Account menu"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">
                  {user.fullName || user.companyName || "Account"}
                </span>
              </button>
            </Dropdown>
          ) : (
            <Link
              href={`/login?redirect=${pathname !== "/login" ? encodeURIComponent(pathname) : "/"}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 group focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
              title="Login to your account"
              aria-label="Login"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">
                Login
              </span>
            </Link>
          )}

          <button
            onClick={() => setBasketDrawerOpen(true)}
            className="relative cursor-pointer inline-flex items-center gap-2 text-emerald-800 hover:text-emerald-700 transition-colors group focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            title={`View enquiry basket with ${basket.length} items`}
            aria-label="Open enquiry basket drawer"
            aria-expanded={basketDrawerOpen}
            aria-controls="basket-drawer"
          >
            <ShoppingBag className="w-6 h-6" />
            {basket.length > 0 && (
              <span
                className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse"
                aria-label={`${basket.length} items in enquiry basket`}
              >
                {basket.length}
              </span>
            )}
            <span className="hidden sm:inline text-sm font-medium">
              Enquiry
            </span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-emerald-800"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-7 h-7"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
              />
            </svg>
          </button>
        </div>

        {/* Basket Drawer */}
        <Drawer
          id="basket-drawer"
          title={`Enquiry Basket (${basket.length})`}
          placement="right"
          onClose={() => setBasketDrawerOpen(false)}
          open={basketDrawerOpen}
          className="basket-drawer"
        >
          <BasketDrawer
            basketProducts={basketProducts}
            basketLength={basket.length}
            removeFromBasket={removeFromBasketOptimistic}
            setBasketDrawerOpen={setBasketDrawerOpen}
          />
        </Drawer>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav
          className="md:hidden border-t border-slate-100 bg-white"
          aria-label="Mobile navigation"
        >
          <div className="px-6 py-4 flex flex-col gap-3 text-sm text-slate-600">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${
                  pathname === link.href
                    ? "text-emerald-800 font-semibold border-l-4 border-emerald-800 pl-2"
                    : "hover:text-emerald-800"
                }`}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
