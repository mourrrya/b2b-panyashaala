"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/applications", label: "Applications" },
  { href: "/quality", label: "Quality" },
  { href: "/contact", label: "Contact" },
] as const;

interface NavigationMenuProps {
  pathname: string;
}

export function NavigationMenu({ pathname }: NavigationMenuProps) {
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLDivElement>(null);

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
  );
}

export { NAV_LINKS };
