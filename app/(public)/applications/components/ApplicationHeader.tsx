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
    <div className="mb-12">
      <p className="text-sm uppercase tracking-[0.2em] text-emerald-600 mb-3">
        Applications
      </p>
      <h1 className="text-4xl font-semibold text-slate-900 mb-4">
        Premium ingredient solutions for your formulations
      </h1>
      <p className="text-lg text-slate-600 mb-8">
        Explore our curated ingredient combinations designed for specific
        applications and product categories
      </p>

      {/* Search Bar */}
      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Search applications or ingredients..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-6 py-4 pl-14 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-white/95"
        />
        <Search className="absolute left-5 top-4 w-6 h-6 text-slate-400" />
      </div>

      {/* Contact Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 text-white shadow-lg">
        <h3 className="text-2xl font-semibold mb-2">
          Need personalized ingredient recommendations?
        </h3>
        <p className="text-emerald-50 mb-6">
          Our sourcing specialists are ready to help you create the perfect
          formulation
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href={`tel:${contactNumber}`}
            className="inline-flex items-center gap-2 bg-white text-emerald-600 px-6 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-colors"
          >
            <Phone className="w-5 h-5" />
            Call {contactNumber}
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-800 transition-colors"
          >
            <Mail className="w-5 h-5" />
            Email Us
          </Link>
        </div>
      </div>
    </div>
  );
}
