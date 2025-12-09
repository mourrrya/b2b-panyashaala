import Link from "next/link";

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbNavigation({ items }: BreadcrumbNavigationProps) {
  return (
    <section className="bg-white/80 border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-slate-600">
          {items.map((item, index) => (
            <div key={item.path} className="flex items-center gap-2">
              <Link
                href={item.path}
                className="text-emerald-700 hover:text-emerald-800 transition-colors"
              >
                {item.name}
              </Link>
              {index < items.length - 1 && (
                <span className="text-slate-400">/</span>
              )}
            </div>
          ))}
        </nav>
      </div>
    </section>
  );
}
