"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import PrivateRoute from "@/app/components/PrivateRoute";
import { getProductById, getAllProducts } from "@/app/lib/api";
import {
  formatPrice,
  toBanglaNumber,
  getUnitBangla,
  getChangeBadge,
} from "@/app/lib/utils";
import {
  FiArrowLeft,
  FiHome,
  FiMapPin,
  FiCalendar,
  FiTrendingUp,
  FiTrendingDown,
  FiTag,
  FiActivity,
} from "react-icons/fi";

export default function ProductDetailPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDivision, setSelectedDivision] = useState("all");

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        // প্রথমে সরাসরি id দিয়ে চেষ্টা করি
        let data = await getProductById(slug);

        // যদি slug স্ট্রিং হয় কিন্তু API তে না মেলে, তাহলে সব প্রোডাক্ট এনে slug ম্যাচ করি
        if (!data) {
          const allProds = await getAllProducts();
          const found = allProds.find(
            (p) => String(p.id) === String(slug) || p.slug === slug
          );
          if (found) {
            data = await getProductById(found.id);
          }
        }
        setProduct(data);
      } catch (err) {
        console.error("প্রোডাক্ট ডিটেইলস লোড হয়নি:", err);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadProduct();
    }
  }, [slug]);

  // প্রাইস স্ট্যাটিস্টিকস ক্যালকুলেশন
  const markets = product?.markets || [];
  const minPrice =
    markets.length > 0
      ? Math.min(...markets.map((m) => m.min))
      : product?.today || 0;
  const maxPrice =
    markets.length > 0
      ? Math.max(...markets.map((m) => m.max))
      : product?.today || 0;
  const avgPrice =
    markets.length > 0
      ? Math.round(
          markets.reduce((acc, m) => acc + (m.min + m.max) / 2, 0) /
            markets.length
        )
      : product?.today || 0;

  // বিভাগ লিস্ট ফিল্টারিং
  const divisions = [
    "all",
    ...new Set(markets.map((m) => m.division).filter(Boolean)),
  ];

  const filteredMarkets =
    selectedDivision === "all"
      ? markets
      : markets.filter((m) => m.division === selectedDivision);

  const changeInfo = product ? getChangeBadge(product.change) : null;

  return (
    <PrivateRoute>
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />

        <main className="flex-grow container-main py-4 sm:py-8">
          {/* ব্রেডক্রাম্ব ও ব্যাক বাটন (Responsive Layout) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
            <nav className="flex items-center gap-1.5 sm:gap-2 text-xs text-slate-500 overflow-hidden text-ellipsis whitespace-nowrap">
              <Link
                href="/"
                className="flex items-center gap-1 hover:text-blue-600 transition-colors shrink-0"
              >
                <FiHome />
                <span>হোম</span>
              </Link>
              <span>/</span>
              {product && (
                <>
                  <Link
                    href={`/category/${product.category}`}
                    className="hover:text-blue-600 transition-colors shrink-0"
                  >
                    {product.categoryNameBn || "ক্যাটাগরি"}
                  </Link>
                  <span>/</span>
                </>
              )}
              <span className="text-slate-800 font-medium truncate">
                {product?.nameBn || "পণ্য বিবরণ"}
              </span>
            </nav>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm self-start sm:self-auto"
            >
              <FiArrowLeft />
              <span>তালিকায় ফিরুন</span>
            </Link>
          </div>

          {loading ? (
            <div className="space-y-6">
              <div className="h-40 bg-white rounded-2xl border border-slate-200 animate-pulse"></div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="h-28 bg-white rounded-2xl border border-slate-200 animate-pulse"></div>
                <div className="h-28 bg-white rounded-2xl border border-slate-200 animate-pulse"></div>
                <div className="h-28 bg-white rounded-2xl border border-slate-200 animate-pulse"></div>
              </div>
              <div className="h-64 bg-white rounded-2xl border border-slate-200 animate-pulse"></div>
            </div>
          ) : !product ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-12 text-center max-w-lg mx-auto shadow-sm my-6 sm:my-10">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                পণ্যের তথ্য পাওয়া যায়নি
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-2 mb-6">
                আপনার কাঙ্ক্ষিত পণ্যের বিস্তারিত তথ্য এই মুহূর্তে উপলব্ধ নেই।
              </p>
              <Link
                href="/"
                className="btn btn-primary rounded-full px-6 text-white text-sm"
              >
                হোম পেজে ফিরে যান
              </Link>
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8">
              {/* ============================================
                  ১. টপ সামারি কার্ড (Responsive)
                 ============================================ */}
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-6 md:p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
                  {/* বামে: ইমোজি, টাইটেল ও সাবটাইটেল */}
                  <div className="flex items-start gap-3.5 sm:gap-5">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-blue-50 to-slate-100 border border-slate-200/70 flex items-center justify-center text-3xl sm:text-4xl md:text-5xl shadow-inner shrink-0">
                      {product.image || "📦"}
                    </div>

                    <div className="space-y-1.5 sm:space-y-2 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <Link
                          href={`/category/${product.category}`}
                          className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 sm:py-1 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        >
                          <FiTag className="text-xs" />
                          <span>{product.categoryIcon}</span>
                          <span>{product.categoryNameBn || "ক্যাটাগরি"}</span>
                        </Link>
                        <span className="text-[11px] sm:text-xs text-slate-500 bg-slate-100 px-2 py-0.5 sm:py-1 rounded-full">
                          একক: {getUnitBangla(product.unit)}
                        </span>
                      </div>

                      <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight break-words">
                        {product.nameBn}
                      </h1>

                      <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
                        সারাদেশের বিভিন্ন পাইকারি ও খুচরা বাজার থেকে সংগৃহীত নির্ভরযোগ্য তথ্য অনুযায়ী আজকের বাজারদর বিশ্লেষণ।
                      </p>
                    </div>
                  </div>

                  {/* ডানে: আজকের প্রাইস ও চেঞ্জ ব্যাজ */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 w-full md:w-auto md:min-w-[220px] text-center md:text-right shrink-0">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                      আজকের গড় দাম
                    </span>
                    <div className="flex items-baseline justify-center md:justify-end gap-1.5 my-1">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900">
                        {formatPrice(product.today)}
                      </span>
                      <span className="text-sm font-bold text-slate-600">
                        টাকা
                      </span>
                    </div>
                    {changeInfo && (
                      <div className="inline-block mt-0.5">
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-bold ${changeInfo.className}`}
                        >
                          {changeInfo.text} গত দিনের তুলনা
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* হিস্টোরিকাল কম্প্যারিজন স্ট্রিপ (Responsive Grid) */}
                <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-center">
                  <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50/80 border border-slate-100/50">
                    <span className="text-[11px] sm:text-xs text-slate-500 block">আজকে</span>
                    <span className="text-sm sm:text-lg font-bold text-slate-800">
                      {formatPrice(product.today)} ৳
                    </span>
                  </div>
                  <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50/80 border border-slate-100/50">
                    <span className="text-[11px] sm:text-xs text-slate-500 block">গতকাল</span>
                    <span className="text-sm sm:text-lg font-bold text-slate-800">
                      {formatPrice(product.yesterday || product.today)} ৳
                    </span>
                  </div>
                  <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50/80 border border-slate-100/50">
                    <span className="text-[11px] sm:text-xs text-slate-500 block">গত সপ্তাহ</span>
                    <span className="text-sm sm:text-lg font-bold text-slate-800">
                      {formatPrice(product.lastWeek || product.today)} ৳
                    </span>
                  </div>
                  <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50/80 border border-slate-100/50">
                    <span className="text-[11px] sm:text-xs text-slate-500 block">গত মাস</span>
                    <span className="text-sm sm:text-lg font-bold text-slate-800">
                      {formatPrice(product.lastMonth || product.today)} ৳
                    </span>
                  </div>
                </div>
              </div>

              {/* ============================================
                  ২. প্রাইস সামারি মেট্রিক্স কার্ড (Min, Max, Avg)
                 ============================================ */}
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <FiActivity className="text-blue-600" />
                  <span>মূল্য সারাংশ (Price Summary)</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {/* সর্বনিম্ন দাম */}
                  <div className="bg-white rounded-2xl border border-emerald-200/80 p-4 sm:p-5 shadow-sm">
                    <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold mb-1.5 sm:mb-2">
                      <span>সর্বনিম্ন মূল্য</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100">
                        সাশ্রয়ী
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-black text-emerald-700">
                        {formatPrice(minPrice)}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-emerald-600">
                        টাকা / {getUnitBangla(product.unit)}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-1 sm:mt-2">
                      দেশের সর্বনিম্ন বাজারদর
                    </p>
                  </div>

                  {/* সর্বোচ্চ দাম */}
                  <div className="bg-white rounded-2xl border border-rose-200/80 p-4 sm:p-5 shadow-sm">
                    <div className="flex items-center justify-between text-xs text-rose-700 font-semibold mb-1.5 sm:mb-2">
                      <span>সর্বোচ্চ মূল্য</span>
                      <span className="px-2 py-0.5 rounded-full bg-rose-100">
                        উচ্চমূল্য
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-black text-rose-700">
                        {formatPrice(maxPrice)}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-rose-600">
                        টাকা / {getUnitBangla(product.unit)}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-1 sm:mt-2">
                      দেশের সর্বোচ্চ বাজারদর
                    </p>
                  </div>

                  {/* গড় দাম */}
                  <div className="bg-white rounded-2xl border border-blue-200/80 p-4 sm:p-5 shadow-sm">
                    <div className="flex items-center justify-between text-xs text-blue-700 font-semibold mb-1.5 sm:mb-2">
                      <span>গড় মূল্য</span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-100">
                        জাতীয় গড়
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-black text-blue-700">
                        {formatPrice(avgPrice)}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-blue-600">
                        টাকা / {getUnitBangla(product.unit)}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-1 sm:mt-2">
                      সব বাজারের সাধারণ গড় মান
                    </p>
                  </div>
                </div>
              </div>

              {/* ============================================
                  ৩. বাজারভিত্তিক আজকের দাম (Table & Mobile Cards)
                 ============================================ */}
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-6 md:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-lg sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                      <FiMapPin className="text-blue-600 shrink-0" />
                      <span>বাজারভিত্তিক আজকের দাম</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
                      বিভাগ ও বাজার অনুযায়ী মূল্য তালিকা ({toBanglaNumber(filteredMarkets.length)}টি বাজার সক্রিয়)
                    </p>
                  </div>

                  {/* বিভাগ ফিল্টার বাটন (Smooth Horizontal Scroll on Mobile) */}
                  {divisions.length > 1 && (
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
                      {divisions.map((div) => (
                        <button
                          key={div}
                          onClick={() => setSelectedDivision(div)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                            selectedDivision === div
                              ? "bg-blue-600 text-white shadow-sm"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {div === "all" ? "সকল বিভাগ" : div}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {filteredMarkets.length > 0 ? (
                  <>
                    {/* মোবাইল ভিউ: রেসপনসিভ মার্কেট কার্ড গ্রিড (Phone Friendly) */}
                    <div className="grid grid-cols-1 gap-3 md:hidden">
                      {filteredMarkets.map((m, idx) => {
                        const marketAvg = Math.round((m.min + m.max) / 2);
                        return (
                          <div
                            key={idx}
                            className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-2.5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                                <span className="truncate">{m.market}</span>
                              </span>
                              <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-xs font-medium text-slate-600 shrink-0">
                                {m.division}
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-200/60">
                              <div className="bg-white rounded-lg p-1.5 border border-emerald-100">
                                <span className="text-[10px] text-emerald-600 block">সর্বনিম্ন</span>
                                <span className="text-xs font-bold text-emerald-700">
                                  {formatPrice(m.min)} ৳
                                </span>
                              </div>
                              <div className="bg-white rounded-lg p-1.5 border border-rose-100">
                                <span className="text-[10px] text-rose-600 block">সর্বোচ্চ</span>
                                <span className="text-xs font-bold text-rose-700">
                                  {formatPrice(m.max)} ৳
                                </span>
                              </div>
                              <div className="bg-white rounded-lg p-1.5 border border-blue-100">
                                <span className="text-[10px] text-blue-600 block">গড় দাম</span>
                                <span className="text-xs font-black text-slate-900">
                                  {formatPrice(marketAvg)} ৳
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* ট্যাবলেট ও ডেস্কটপ ভিউ: ফুল টেবিল */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left text-sm min-w-[550px]">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                            <th className="py-3 px-4">বাজারের নাম</th>
                            <th className="py-3 px-4">বিভাগ</th>
                            <th className="py-3 px-4 text-center">সর্বনিম্ন রেট</th>
                            <th className="py-3 px-4 text-center">সর্বোচ্চ রেট</th>
                            <th className="py-3 px-4 text-right">গড় মূল্য</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredMarkets.map((m, idx) => {
                            const marketAvg = Math.round((m.min + m.max) / 2);
                            return (
                              <tr
                                key={idx}
                                className="hover:bg-slate-50/80 transition-colors"
                              >
                                <td className="py-3.5 px-4 font-semibold text-slate-800">
                                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                  {m.market}
                                </td>
                                <td className="py-3.5 px-4 text-slate-600">
                                  <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-xs font-medium">
                                    {m.division}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-center font-bold text-emerald-700">
                                  {formatPrice(m.min)} ৳
                                </td>
                                <td className="py-3.5 px-4 text-center font-bold text-rose-700">
                                  {formatPrice(m.max)} ৳
                                </td>
                                <td className="py-3.5 px-4 text-right font-black text-slate-900">
                                  {formatPrice(marketAvg)} ৳
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <p className="text-center text-slate-500 py-8 text-sm">
                    এই বিভাগে কোনো বাজারের তথ্য পাওয়া যায়নি।
                  </p>
                )}
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </PrivateRoute>
  );
}
