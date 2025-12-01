import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-emerald-50/80 via-white/80 to-teal-50/80 border-t border-emerald-200/50 mt-20 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">About</h3>
            <p className="text-sm text-slate-600">
              Natural cosmetic ingredients supplier for formulators and
              manufacturers.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Products</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link
                  href="/products"
                  className="hover:text-emerald-800 transition-colors duration-200"
                >
                  Essential Oils
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-emerald-800 transition-colors duration-200"
                >
                  Carrier Oils
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-emerald-800 transition-colors duration-200"
                >
                  Extracts
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-emerald-800 transition-colors duration-200"
                >
                  Hydrosols
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link
                  href="/about"
                  className="hover:text-emerald-800 transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/quality"
                  className="hover:text-emerald-800 transition-colors duration-200"
                >
                  Quality
                </Link>
              </li>
              <li>
                <Link
                  href="/applications"
                  className="hover:text-emerald-800 transition-colors duration-200"
                >
                  Applications
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Contact</h3>
            <p className="text-sm text-slate-600 mb-3">
              <a
                href="tel:+918076450898"
                className="hover:text-emerald-800 transition-colors duration-200 font-medium"
              >
                +91 8076450898
              </a>
            </p>
            <p className="text-sm text-slate-600">
              <Link
                href="/contact"
                className="hover:text-emerald-800 transition-colors duration-200"
              >
                Get in touch
              </Link>
            </p>
          </div>
        </div>
        <div className="border-t border-emerald-200/50 pt-8 text-center text-sm text-slate-600">
          <p>&copy; 2025 Aukra Chem Essentials LLP. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
