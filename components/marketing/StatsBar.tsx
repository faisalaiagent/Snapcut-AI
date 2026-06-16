// StatsBar.tsx
export function StatsBar() {
  const stats = [
    { num: "2.4M+", label: "Images processed" },
    { num: "98.7%", label: "Accuracy rate" },
    { num: "< 3s",  label: "Avg processing time" },
    { num: "50+",   label: "Countries supported" },
    { num: "47K+",  label: "Happy customers" },
  ];

  return (
    <div className="bg-ink py-10 px-4 sm:px-6 mt-0">
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <span className="block font-serif text-[2.2rem] text-white tracking-tight leading-none mb-1">{s.num}</span>
            <span className="text-[13px] text-white/50 font-light">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
