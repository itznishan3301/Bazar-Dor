export default function ProductSkeleton({ count = 6 }) {
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {items.map((item) => (
        <div
          key={item}
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 animate-pulse"
        >
          <div className="flex justify-between items-center">
            <div className="h-5 w-20 bg-slate-200 rounded-full"></div>
            <div className="h-5 w-14 bg-slate-200 rounded-full"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-slate-200 rounded-xl"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
            <div className="h-6 w-24 bg-slate-200 rounded"></div>
            <div className="h-4 w-12 bg-slate-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
