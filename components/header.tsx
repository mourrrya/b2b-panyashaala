"use client";

import { useStore } from "@/lib/store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLDivElement>(null);
  const basket = useStore((state) => state.basket);

  const navLinks = [
    { href: "/products", label: "Products" },
    { href: "/about", label: "About" },
    { href: "/applications", label: "Applications" },
    { href: "/quality", label: "Quality" },
    { href: "/contact", label: "Contact" },
  ];

  const activeLink = navRef?.current?.querySelector(
    `a[href="${pathname}"]`
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
          Aukra Chem Essentials
        </Link>
        <nav
          ref={navRef}
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
            />
          )}
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="/products"
            className="relative inline-flex items-center gap-2 text-emerald-800 hover:text-emerald-700 transition-colors group"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {basket.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {basket.length}
              </span>
            )}
            <span className="hidden sm:inline text-sm font-medium">
              Enquiry
            </span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-emerald-800"
            aria-label="Toggle navigation"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white">
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
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
