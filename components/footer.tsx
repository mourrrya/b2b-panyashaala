import {
  CONTACT_INFO,
  FOOTER_LINKS,
  MARKETING_COPY,
  SITE_CONFIG,
  UI_LABELS,
} from "@/lib/constants";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-linear-to-br from-emerald-50/80 via-white/80 to-teal-50/80 border-t border-emerald-200/50 mt-12 sm:mt-16 lg:mt-20 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-semibold text-slate-900 mb-3 sm:mb-4 text-sm sm:text-base">
              {UI_LABELS.SECTIONS.ABOUT}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              {MARKETING_COPY.FOOTER_ABOUT}
            </p>
          </div>
          <nav>
            <h3 className="font-semibold text-slate-900 mb-3 sm:mb-4 text-sm sm:text-base">
              {UI_LABELS.SECTIONS.PRODUCTS}
            </h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-600">
              {FOOTER_LINKS.products.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-emerald-800 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav>
            <h3 className="font-semibold text-slate-900 mb-3 sm:mb-4 text-sm sm:text-base">
              {UI_LABELS.SECTIONS.RESOURCES}
            </h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-600">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-emerald-800 transition-colors duration-200"
                    {...("external" in link && link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h3 className="font-semibold text-slate-900 mb-3 sm:mb-4 text-sm sm:text-base">
              {UI_LABELS.SECTIONS.CONTACT}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-2 sm:mb-3">
              <a
                href={`tel:${CONTACT_INFO.PHONE}`}
                className="hover:text-emerald-800 transition-colors duration-200 font-medium"
              >
                {CONTACT_INFO.PHONE_DISPLAY}
              </a>
            </p>
            {/* <p className="text-sm text-slate-600 mb-4">
              <Link
                href="/contact"
                className="hover:text-emerald-800 transition-colors duration-200"
              >
                Get in touch
              </Link>
            </p>
            <div className="flex gap-3">
              <a
                href="https://twitter.com/cosmeticsupply"
                aria-label="Follow us on Twitter"
                className="text-slate-600 hover:text-emerald-800 transition-colors"
                rel="noopener noreferrer"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 19c11 0 17-9 17-16.86a12.04 12.04 0 0 0 2.95-3.06 11.84 11.84 0 0 1-3.4.93 5.92 5.92 0 0 0 2.6-3.27 11.86 11.86 0 0 1-3.74 1.43 5.92 5.92 0 0 0-10.33 5.4A16.78 16.78 0 0 1 2.2 4.2a5.92 5.92 0 0 0 1.83 7.9A5.88 5.88 0 0 1 2 11.7v.08a5.92 5.92 0 0 0 4.75 5.8 5.9 5.9 0 0 1-2.68.1 5.92 5.92 0 0 0 5.52 4.1A11.87 11.87 0 0 1 1 20.31a16.77 16.77 0 0 0 9.09 2.66" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/b2b-cosmetics"
                aria-label="Follow us on LinkedIn"
                className="text-slate-600 hover:text-emerald-800 transition-colors"
                rel="noopener noreferrer"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div> */}
          </div>
        </div>
        <div className="border-t border-emerald-200/50 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-slate-600">
          <p>
            &copy; {currentYear} {SITE_CONFIG.NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
