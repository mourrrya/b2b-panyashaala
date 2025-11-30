export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-emerald-50 via-white to-emerald-50 border-t border-emerald-100 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">About</h3>
            <p className="text-sm text-slate-600">
              Natural cosmetic ingredients supplier for formulators and manufacturers.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Products</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <a href="/products" className="hover:text-emerald-800">
                  Essential Oils
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-emerald-800">
                  Carrier Oils
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-emerald-800">
                  Extracts
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-emerald-800">
                  Hydrosols
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <a href="/about" className="hover:text-emerald-800">
                  About Us
                </a>
              </li>
              <li>
                <a href="/quality" className="hover:text-emerald-800">
                  Quality
                </a>
              </li>
              <li>
                <a href="/applications" className="hover:text-emerald-800">
                  Applications
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Contact</h3>
            <p className="text-sm text-slate-600 mb-3">
              <a href="tel:+918076450898" className="hover:text-emerald-800 font-medium">
                +91 8076450898
              </a>
            </p>
            <p className="text-sm text-slate-600">
              <a href="/contact" className="hover:text-emerald-800">
                Get in touch
              </a>
            </p>
          </div>
        </div>
        <div className="border-t border-emerald-100 pt-8 text-center text-sm text-slate-600">
          <p>&copy; 2025 Aukra Chem Essentials LLP. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
