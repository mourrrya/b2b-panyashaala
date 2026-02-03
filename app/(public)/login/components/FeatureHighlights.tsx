export function FeatureHighlights() {
  const features = [
    { icon: "🌿", title: "500+", subtitle: "Natural Ingredients" },
    { icon: "🔬", title: "ISO", subtitle: "Certified Quality" },
    { icon: "🚚", title: "72hrs", subtitle: "Sample Dispatch" },
    { icon: "🌍", title: "Global", subtitle: "Sourcing Network" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:gap-4">
      {features.map((item, idx) => (
        <div
          key={idx}
          className="p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-white/60 backdrop-blur-sm border border-white/80 shadow-sm hover:shadow-md hover:bg-white/80 transition-all duration-300"
        >
          <span className="text-xl lg:text-2xl">{item.icon}</span>
          <p className="mt-1.5 lg:mt-2 text-lg lg:text-xl font-bold text-slate-900">
            {item.title}
          </p>
          <p className="text-xs lg:text-sm text-slate-500">{item.subtitle}</p>
        </div>
      ))}
    </div>
  );
}
