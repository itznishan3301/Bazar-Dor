import Link from "next/link";
import { formatPrice, getUnitBangla, getChangeBadge } from "@/app/lib/utils";
import { FiArrowRight } from "react-icons/fi";

export default function ProductCard({ product }) {
  if (!product) return null;

  const changeInfo = getChangeBadge(product.change);
  // Product details URL can use slug or id
  const detailUrl = `/product/${product.id || product.slug}`;

  return (
    <Link
      href={detailUrl}
      className="product-card group block bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition-all duration-200 relative overflow-hidden"
    >
      {/* ক্যাটাগরি ও ব্যাজ টপ রো */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
          <span>{product.categoryIcon || "🏷️"}</span>
          <span>{product.categoryNameBn || product.category || "পণ্য"}</span>
        </span>

        <span
          className={`text-xs px-2.5 py-0.5 rounded-full font-semibold inline-flex items-center gap-1 ${changeInfo.className}`}
        >
          {changeInfo.text}
        </span>
      </div>

      {/* ইমোজি ও নাম */}
      <div className="flex items-center gap-3.5 my-3">
        <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
          {product.image || "📦"}
        </div>
        <div className="min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
            {product.nameBn}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {getUnitBangla(product.unit)}
          </p>
        </div>
      </div>

      {/* প্রাইস ডিটেইলস রো */}
      <div className="pt-3 border-t border-slate-100 flex items-end justify-between mt-2">
        <div>
          <span className="block text-[11px] font-medium text-slate-400 uppercase tracking-wide">
            আজকের দাম
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl sm:text-2xl font-black text-slate-900">
              {formatPrice(product.today)}
            </span>
            <span className="text-xs font-semibold text-slate-600">টাকা</span>
          </div>
        </div>

        <div className="text-right">
          {product.yesterday && (
            <span className="block text-[11px] text-slate-400">
              গতকাল: {formatPrice(product.yesterday)}৳
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform mt-1">
            <span>বিস্তারিত</span>
            <FiArrowRight className="text-xs" />
          </span>
        </div>
      </div>
    </Link>
  );
}
