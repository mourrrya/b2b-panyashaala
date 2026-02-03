import { Mail, Phone, Search } from "lucide-react";
import Link from "next/link";

interface ApplicationHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function ApplicationHeader({
  searchTerm,
  onSearchChange,
}: ApplicationHeaderProps) {
  const contactNumber = "+91 8076450898";

  return (
    <div className="mb-8 sm:mb-10 lg:mb-12">
      <p className="text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] text-emerald-600 mb-2 sm:mb-3">
        Applications
      </p>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900 mb-3 sm:mb-4">
        Premium ingredient solutions for your formulations
      </h1>
      <p className="text-sm sm:text-base lg:text-lg text-slate-600 mb-6 sm:mb-8">
        Explore our curated ingredient combinations designed for specific
        applications and product categories
      </p>

      {/* Search Bar */}
      <div className="relative mb-6 sm:mb-8">
        <input
          type="text"
          placeholder="Search applications or ingredients..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 sm:px-6 py-3 sm:py-4 pl-10 sm:pl-14 border border-slate-200 rounded-lg sm:rounded-xl text-sm sm:text-base text-slate-900 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-white/95"
        />
        <Search className="absolute left-3 sm:left-5 top-3 sm:top-4 w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
      </div>

      {/* Contact Banner */}
      <div className="bg-linear-to-r from-emerald-500 to-teal-600 rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 text-white shadow-lg">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-1.5 sm:mb-2">
          Need personalized ingredient recommendations?
        </h3>
        <p className="text-sm sm:text-base text-emerald-50 mb-4 sm:mb-6">
          Our sourcing specialists are ready to help you create the perfect
          formulation
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
          <a
            href={`tel:${contactNumber}`}
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-white text-emerald-600 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:bg-emerald-50 transition-colors"
          >
            <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
            Call {contactNumber}
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-emerald-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:bg-emerald-800 transition-colors"
          >
            <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
            Email Us
          </Link>
        </div>
      </div>
    </div>
  );
}
