"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ProductCard from "@/app/components/ProductCard";
import ProductSkeleton from "@/app/components/ProductSkeleton";
import { getCategories, getAllProducts } from "@/app/lib/api";
import { toBanglaNumber } from "@/app/lib/utils";
import { FiChevronDown, FiHome, FiAlertCircle } from "react-icons/fi";

export default function CategoryPage({ params }) {
  // Next.js 15+ params unwrap
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategoryData() {
      try {
        setLoading(true);
        const [cats, allProds] = await Promise.all([
          getCategories(),
          getAllProducts(),
        ]);

        // ক্যাটাগরি তথ্য ম্যাচিং
        const matchedCat = cats.find(
          (c) => c.slug === slug || c.id === slug
        );
        setCategory(matchedCat || null);

        // ওই ক্যাটাগরির পণ্যসমূহ ফিল্টারিং
        const matchedProducts = allProds.filter(
          (p) =>
            p.category === slug ||
            p.categorySlug === slug ||
            (matchedCat && p.category === matchedCat.id)
        );
        setProducts(matchedProducts);
      } catch (err) {
        console.error("ক্যাটাগরি ডেটা লোড হয়নি:", err);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadCategoryData();
    }
  }, [slug]);

  // C1 Challenge: সঠিক সংখ্যাগত মানের ভিত্তিতে সর্টিং (Numeric Sort)
  const sortedProducts = [...products].sort((a, b) => {
    const priceA = typeof a.today === "number" ? a.today : parseFloat(a.today) || 0;
    const priceB = typeof b.today === "number" ? b.today : parseFloat(b.today) || 0;

    if (sortBy === "price-asc") {
      return priceA - priceB;
    }
    if (sortBy === "price-desc") {
      return priceB - priceA;
    }
    return 0; // ডিফল্ট অর্ডার
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 w-full overflow-x-hidden">
      <Navbar />

      <main className="flex-grow container-main py-4 sm:py-8 w-full overflow-x-hidden">
        {/* ব্রেডক্রাম্ব */}
        <nav className="flex items-center gap-1.5 sm:gap-2 text-xs text-slate-500 mb-4 sm:mb-6 overflow-hidden text-ellipsis whitespace-nowrap">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-blue-600 transition-colors shrink-0"
          >
            <FiHome />
            <span>হোম</span>
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-medium truncate">
            {category?.nameBn || slug}
          </span>
        </nav>

        {loading ? (
          <div className="space-y-6">
            <div className="h-10 w-48 bg-slate-200 rounded animate-pulse"></div>
            <ProductSkeleton count={8} />
          </div>
        ) : !category && products.length === 0 ? (
          /* রিকোয়ারমেন্ট: খালি বা অবৈধ ক্যাটাগরি স্টেট */
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-12 text-center max-w-lg mx-auto shadow-sm my-6 sm:my-10">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto text-2xl sm:text-3xl mb-4">
              <FiAlertCircle />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
              ক্যাটাগরি পাওয়া যায়নি
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-2 mb-6">
              আপনার অনুরোধকৃত ক্যাটাগরি &quot;{slug}&quot; আমাদের ডাটাবেজে নেই বা বর্তমানে কোনো পণ্য অন্তর্ভুক্ত নেই।
            </p>
            <Link
              href="/"
              className="btn btn-primary rounded-full px-6 text-white text-sm"
            >
              হোম পেজে ফিরে যান
            </Link>
          </div>
        ) : (
          <div className="space-y-5 sm:space-y-6">
            {/* হেডার ও সর্টিং ড্রপডাউন (মোবাইলে পরিচ্ছন্ন লেআউট) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200/80 pb-4 sm:pb-5">
              <div>
                <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl">{category?.icon || "🏷️"}</span>
                  <span>{category?.nameBn || slug}</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
                  মোট {toBanglaNumber(products.length)}টি পণ্য তালিকাভুক্ত
                </p>
              </div>

              {/* C1: সর্ট ড্রপডাউন (মোবাইলে ফুল উইডথ বা রাইট অ্যালাইন) */}
              <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto bg-slate-100/60 sm:bg-transparent p-2 sm:p-0 rounded-xl">
                <span className="text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap">
                  সাজান:
                </span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="select select-bordered select-sm rounded-full pr-8 text-xs sm:text-sm font-medium bg-white text-slate-800 border-slate-300 focus:border-blue-500"
                  >
                    <option value="default">ডিফল্ট</option>
                    <option value="price-asc">দাম: কম থেকে বেশি</option>
                    <option value="price-desc">দাম: বেশি থেকে কম</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs" />
                </div>
              </div>
            </div>

            {/* প্রোডাক্ট কার্ড লিস্ট */}
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm">
                <p className="text-slate-600 mb-4">
                  এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য পাওয়া যায়নি।
                </p>
                <Link
                  href="/"
                  className="btn btn-primary rounded-full px-6 text-white"
                >
                  হোম পেজে ফিরে যান
                </Link>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
